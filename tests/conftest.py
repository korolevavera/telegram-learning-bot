import hashlib
import hmac
import json
import os
import time
import urllib.parse
from pathlib import Path

import pytest

TEST_TOKEN = "123456789:TESTTOKEN_abcdefgh"
TEST_DB = Path(__file__).parent / "test.db"

os.environ["BOT_TOKEN"] = TEST_TOKEN
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{TEST_DB}"
os.environ["WEBAPP_URL"] = ""
os.environ["FACEIT_API_KEY"] = ""

import bot.web_server as web_server  # noqa: E402
from bot.db import engine  # noqa: E402


def make_init_data(
    token: str = TEST_TOKEN,
    user_id: int = 123,
    first_name: str = "Test",
    auth_date: int | None = None,
) -> str:
    auth_date = auth_date if auth_date is not None else int(time.time())
    user = json.dumps(
        {"id": user_id, "first_name": first_name}, separators=(",", ":")
    )
    params = {"auth_date": str(auth_date), "user": user}
    secret = hmac.new(b"WebAppData", token.encode(), hashlib.sha256).digest()
    data_check_string = "\n".join(f"{k}={params[k]}" for k in sorted(params))
    h = hmac.new(secret, data_check_string.encode(), hashlib.sha256).hexdigest()
    params["hash"] = h
    return urllib.parse.urlencode(params)


@pytest.fixture(autouse=True)
def _reset_db():
    from bot.db import Base, engine

    import asyncio

    async def _init():
        await engine.dispose()
        if TEST_DB.exists():
            TEST_DB.unlink()
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    asyncio.run(_init())
    web_server._rate.clear()
    from bot.services import _ADMIN_CONTENT_CACHE, refresh_admin_content_cache
    global _ADMIN_CONTENT_CACHE
    _ADMIN_CONTENT_CACHE = None
    asyncio.run(refresh_admin_content_cache())
    yield


@pytest.fixture
async def client():
    from aiohttp.test_utils import TestClient, TestServer
    from bot.web_server import create_app

    app = create_app()
    server = TestServer(app)
    cli = TestClient(server)
    await cli.start_server()
    yield cli
    await cli.close()
