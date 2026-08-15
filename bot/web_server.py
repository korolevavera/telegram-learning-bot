import hashlib
import hmac
import json
from pathlib import Path
from typing import Any
from urllib.parse import parse_qsl

from aiohttp import web

from .config_loader import CONFIG
from .content import CARDS, LESSONS, LINEUP_TYPES, MAPS, QUIZZES, TACTICS
from .lineups_loader import get_lineups
from .services import get_progress, save_quiz_result, set_card_known, upsert_lesson_progress
from .stats import (
    clear_cache,
    get_faceit_player_info,
    get_player_info,
    get_stats,
    get_team_info,
)

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


async def api_guides(request: web.Request) -> web.Response:
    return web.json_response(
        {
            "maps": MAPS,
            "lineups": get_lineups(),
            "tactics": TACTICS,
            "types": LINEUP_TYPES,
        }
    )


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
    if request.query.get("refresh"):
        clear_cache()
    region = (request.query.get("region") or "EU").upper()
    try:
        period = int(request.query.get("period") or 180)
    except (TypeError, ValueError):
        period = 180
    if period not in (90, 180, 365):
        period = 180
    try:
        stats = await get_stats(region=region, period_days=period)
    except Exception:
        return web.json_response({"ok": False, "error": "stats unavailable"}, status=502)
    return web.json_response({"ok": True, "stats": stats})


async def api_team(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    slug = request.query.get("slug", "").strip()
    if not slug:
        return web.json_response({"ok": False, "error": "missing slug"}, status=400)
    try:
        info = await get_team_info(slug)
    except Exception:
        return web.json_response({"ok": False, "error": "team unavailable"}, status=502)
    if info is None:
        return web.json_response({"ok": False, "error": "team not found"}, status=404)
    return web.json_response({"ok": True, "team": info})


async def api_player(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    slug = request.query.get("slug", "").strip()
    if not slug:
        return web.json_response({"ok": False, "error": "missing slug"}, status=400)
    try:
        period = int(request.query.get("period") or 180)
    except (TypeError, ValueError):
        period = 180
    if period not in (90, 180, 365):
        period = 180
    try:
        info = await get_player_info(slug, period_days=period)
    except Exception:
        return web.json_response({"ok": False, "error": "player unavailable"}, status=502)
    if info is None:
        return web.json_response({"ok": False, "error": "player not found"}, status=404)
    return web.json_response({"ok": True, "player": info})


async def api_faceit_player(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    pid = request.query.get("id", "").strip()
    if not pid:
        return web.json_response({"ok": False, "error": "missing id"}, status=400)
    try:
        info = await get_faceit_player_info(pid)
    except Exception:
        return web.json_response({"ok": False, "error": "player unavailable"}, status=502)
    if info is None:
        return web.json_response({"ok": False, "error": "player not found"}, status=404)
    return web.json_response({"ok": True, "player": info})


@web.middleware
async def _cache_control(request: web.Request, handler: Any) -> web.StreamResponse:
    response = await handler(request)
    response.headers.setdefault("Cache-Control", "no-cache")
    return response


def create_app() -> web.Application:
    app = web.Application(middlewares=[_cache_control])
    app.router.add_get("/", index_handler)
    app.router.add_get("/api/init", api_init)
    app.router.add_get("/api/content", api_content)
    app.router.add_get("/api/guides", api_guides)
    app.router.add_get("/api/progress", api_progress)
    app.router.add_get("/api/stats", api_stats)
    app.router.add_get("/api/team", api_team)
    app.router.add_get("/api/player", api_player)
    app.router.add_get("/api/faceit-player", api_faceit_player)
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
