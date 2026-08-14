import hashlib
import hmac
import json
from pathlib import Path
from urllib.parse import parse_qsl

from aiohttp import web

from .config_loader import CONFIG
from .content import CARDS, LESSONS, QUIZZES
from .services import get_progress, save_quiz_result, set_card_known, upsert_lesson_progress
from .stats import get_stats

STATIC_DIR = Path(__file__).resolve().parent / "webapp"


def _secret_key() -> bytes:
    return hmac.new(b"WebAppData", CONFIG.bot_token.encode(), hashlib.sha256).digest()


def _validate_init_data(init_data: str) -> dict | None:
    pairs = dict(parse_qsl(init_data, keep_blank_values=True))
    received = pairs.pop("hash", None)
    if not received:
        return None
    data_check_string = "\n".join(f"{k}={pairs[k]}" for k in sorted(pairs))
    computed = hmac.new(
        _secret_key(), data_check_string.encode(), hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(computed, received):
        return None
    return pairs


def _auth(request: web.Request) -> tuple[int, str] | None:
    init_data = request.headers.get("x-init-data") or request.query.get("initData")
    if not init_data:
        return None
    pairs = _validate_init_data(init_data)
    if not pairs:
        return None
    try:
        user = json.loads(pairs["user"])
    except (KeyError, ValueError):
        return None
    return int(user["id"]), str(user.get("first_name", ""))


def _unauthorized() -> web.Response:
    return web.json_response({"ok": False, "error": "unauthorized"}, status=401)


async def index_handler(request: web.Request) -> web.Response:
    return web.FileResponse(STATIC_DIR / "index.html")


async def api_init(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, first_name = auth
    return web.json_response({"ok": True, "user": {"id": user_id, "first_name": first_name}})


async def api_content(request: web.Request) -> web.Response:
    return web.json_response({"lessons": LESSONS, "cards": CARDS, "quizzes": QUIZZES})


async def api_progress(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    return web.json_response({"ok": True, "progress": await get_progress(user_id)})


async def api_card(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    await set_card_known(user_id, int(data["index"]), bool(data["known"]))
    return web.json_response({"ok": True})


async def api_lesson(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    await upsert_lesson_progress(user_id, str(data["lesson_id"]))
    return web.json_response({"ok": True})


async def api_quiz(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    await save_quiz_result(
        user_id, str(data["quiz_id"]), int(data["score"]), int(data["total"])
    )
    return web.json_response({"ok": True})


async def api_stats(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    try:
        stats = await get_stats()
    except Exception:
        return web.json_response({"ok": False, "error": "stats unavailable"}, status=502)
    return web.json_response({"ok": True, "stats": stats})


def create_app() -> web.Application:
    app = web.Application()
    app.router.add_get("/", index_handler)
    app.router.add_get("/api/init", api_init)
    app.router.add_get("/api/content", api_content)
    app.router.add_get("/api/progress", api_progress)
    app.router.add_get("/api/stats", api_stats)
    app.router.add_post("/api/card", api_card)
    app.router.add_post("/api/lesson", api_lesson)
    app.router.add_post("/api/quiz", api_quiz)
    app.router.add_static("/static", STATIC_DIR)
    return app


async def start_web_server() -> None:
    app = create_app()
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, host="0.0.0.0", port=CONFIG.port)
    await site.start()
