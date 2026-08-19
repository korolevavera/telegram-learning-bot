import hashlib
import hmac
import json
import time
from pathlib import Path
from typing import Any
from urllib.parse import parse_qsl

import mimetypes

from aiohttp import web

from .config_loader import CONFIG
from .content import CARDS, LESSONS, LINEUP_TYPES, MAPS, MAP_SPOTS, POSITIONS, QUIZZES, ROLES, TACTICS, TERMS, DIFFICULTY
from .challenges import current_week_key, week_challenges
from .games import GAMES, daily_game
from .gamification import (
    GAME_DAILY_REWARD_CAP,
    XP_FIRST_DAILY,
    award_card,
    award_game,
    award_lesson,
    award_practice,
    award_quiz,
    award_training,
    award_xp,
    get_achievements_catalog,
    get_profile,
)
from .shop import buy_item, equip_item, get_inventory, get_shop_catalog
from .lineups_loader import get_lineups
from .skills import SKILLS, plan_tasks, recommendation, weakest_skill
from .services import (
    accept_friend_request,
    add_favorite,
    add_skill_points,
    claim_week_challenge,
    complete_plan_task,
    find_duplicate_game_submit,
    get_favorites,
    get_friends_data,
    get_game_submissions_today,
    get_leaderboard,
    get_plan_completed,
    get_plan_prefs,
    get_practice_attempts,
    get_practice_progress,
    get_progress,
    get_week_challenge_progress,
    remove_friend,
    send_friend_request,
    get_mini_game_progress,
    get_transactions,
    get_user_skills,
    is_card_known,
    is_lesson_completed,
    is_quiz_completed,
    log_practice,
    remove_favorite,
    save_mini_game_result,
    save_plan_prefs,
    save_quiz_result,
    set_card_known,
    upsert_lesson_progress,
)
from .stats import (
    clear_cache,
    close as close_stats_session,
    get_faceit_player_info,
    get_player_info,
    get_stats,
    get_team_info,
)
from .version import APP_VERSION

STATIC_DIR = Path(__file__).resolve().parent / "webapp"

_TEXT_TYPES = {"text/", "application/javascript", "application/json"}


def _charset_for(path: str) -> str | None:
    ct, _ = mimetypes.guess_type(path)
    if ct and any(ct.startswith(p) for p in _TEXT_TYPES):
        return "utf-8"
    return None


async def _static_handler(request: web.Request) -> web.Response:
    rel = request.match_info["filename"]
    file_path = STATIC_DIR / rel
    if not file_path.is_file():
        raise web.HTTPNotFound()
    charset = _charset_for(rel)
    ct, _ = mimetypes.guess_type(rel)
    if not ct:
        ct = "application/octet-stream"
    data = file_path.read_bytes()
    if charset == "utf-8" and data[:3] == b"\xef\xbb\xbf":
        data = data[3:]
    resp = web.Response(body=data, content_type=ct, charset=charset)
    resp.headers.setdefault("Cache-Control", "no-cache")
    return resp

AUTH_MAX_AGE = 86400
RATE_WINDOW = 60
RATE_MAX_AUTH = 120
RATE_MAX_ANON = 60

_rate: dict[str, list[float]] = {}


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
    auth_date = pairs.get("auth_date")
    try:
        if auth_date and int(auth_date) < time.time() - AUTH_MAX_AGE:
            return None
    except (TypeError, ValueError):
        return None
    return pairs


def _rate_allowed(key: str, limit: int) -> bool:
    now = time.monotonic()
    window = [t for t in _rate.get(key, []) if now - t < RATE_WINDOW]
    if len(window) >= limit:
        _rate[key] = window
        return False
    window.append(now)
    _rate[key] = window
    if len(_rate) > 10000:
        _rate.clear()
    return True


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
    html = (STATIC_DIR / "index.html").read_text(encoding="utf-8")
    html = html.replace("{{APP_VERSION}}", APP_VERSION)
    return web.Response(text=html, content_type="text/html", charset="utf-8")


async def api_init(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, first_name = auth
    profile = await get_profile(user_id)
    return web.json_response({
        "ok": True,
        "user": {"id": user_id, "first_name": first_name},
        "profile": profile,
        "is_admin": _is_admin(user_id),
    })


async def api_content(request: web.Request) -> web.Response:
    return web.json_response({"lessons": LESSONS, "cards": CARDS, "quizzes": QUIZZES})


async def api_guides(request: web.Request) -> web.Response:
    return web.json_response(
        {
            "ok": True,
            "maps": MAPS,
            "lineups": get_lineups(),
            "tactics": TACTICS,
            "types": LINEUP_TYPES,
            "spots": MAP_SPOTS,
            "positions": POSITIONS,
            "roles": ROLES,
            "terms": TERMS,
            "difficulty": DIFFICULTY,
        }
    )


def _all_grenades() -> list[dict]:
    """Все гранаты плоским списком с полем map (для базы гранат и поиска)."""
    map_names = {m["id"]: m["name"] for m in MAPS}
    out: list[dict] = []
    for map_id, lineups in get_lineups().items():
        for lu in lineups:
            item = dict(lu)
            item["map"] = map_id
            item["map_name"] = map_names.get(map_id, map_id)
            out.append(item)
    return out


def _filter_grenades(items: list[dict], query) -> list[dict]:
    map_id = (query.get("map") or "").strip().lower()
    side = (query.get("side") or "").strip().upper()
    site = (query.get("site") or "").strip().lower()
    gtype = (query.get("type") or "").strip().lower()
    q = (query.get("q") or "").strip().lower()
    res = []
    for g in items:
        if map_id and g["map"] != map_id:
            continue
        if side and g.get("side", "").upper() != side:
            continue
        if site and g.get("site", "").lower() != site:
            continue
        if gtype and g.get("type", "").lower() != gtype:
            continue
        if q:
            hay = f"{g.get('title', '')} {g['map']} {g.get('map_name', '')} {g.get('site', '')} {g.get('type', '')}".lower()
            if q not in hay:
                continue
        res.append(g)
    return res


async def api_grenades(request: web.Request) -> web.Response:
    items = _all_grenades()
    filters = dict(request.query)
    if any(filters.get(k) for k in ("map", "side", "site", "type", "q")):
        items = _filter_grenades(items, filters)
    return web.json_response({"ok": True, "grenades": items, "total": len(items)})


async def api_grenade_detail(request: web.Request) -> web.Response:
    gid = request.match_info.get("id", "").strip()
    if not gid:
        return web.json_response({"ok": False, "error": "missing id"}, status=400)
    for g in _all_grenades():
        if g["id"] == gid:
            return web.json_response({"ok": True, "grenade": g})
    return web.json_response({"ok": False, "error": "not found"}, status=404)


async def api_favorites(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    favs = await get_favorites(user_id)
    return web.json_response({"ok": True, "favorites": favs})


async def api_favorite_add(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    result = await add_favorite(
        user_id,
        str(data.get("item_type") or "").strip(),
        str(data.get("item_id") or "").strip(),
    )
    if not result.get("ok"):
        return web.json_response(result, status=400)
    return web.json_response(result)


async def api_favorite_remove(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    result = await remove_favorite(
        user_id,
        str(request.query.get("item_type") or "").strip(),
        str(request.query.get("item_id") or "").strip(),
    )
    return web.json_response(result)


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
    try:
        idx = int(data["index"])
    except (TypeError, ValueError, KeyError):
        return web.json_response({"ok": False, "error": "bad index"}, status=400)
    known = bool(data.get("known"))
    was_known = await is_card_known(user_id, idx)
    await set_card_known(user_id, idx, known)
    if known and not was_known:
        profile = await award_card(user_id)
    else:
        profile = await get_profile(user_id)
    return web.json_response({"ok": True, "profile": profile})


async def api_lesson(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    lesson_id = str(data["lesson_id"])
    first_time = not await is_lesson_completed(user_id, lesson_id)
    await upsert_lesson_progress(user_id, lesson_id)
    if first_time:
        profile = await award_lesson(user_id)
    else:
        profile = await get_profile(user_id)
    return web.json_response({"ok": True, "profile": profile})


async def api_quiz(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    try:
        score = int(data["score"])
        total = int(data["total"])
    except (TypeError, ValueError, KeyError):
        return web.json_response({"ok": False, "error": "bad score/total"}, status=400)
    if score < 0 or total <= 0 or score > total:
        return web.json_response({"ok": False, "error": "impossible score"}, status=400)
    quiz_id = str(data.get("quiz_id", ""))
    first_time = not await is_quiz_completed(user_id, quiz_id)
    await save_quiz_result(user_id, quiz_id, score, total)
    if first_time:
        profile = await award_quiz(user_id, score, total)
    else:
        profile = await get_profile(user_id)
    return web.json_response({"ok": True, "profile": profile})


async def api_training(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    return web.json_response(
        {"ok": True, "practice": await get_practice_progress(user_id)}
    )


async def api_training_plan(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    prefs = await get_plan_prefs(user_id)
    skills = await get_user_skills(user_id)
    weak = weakest_skill(skills)
    day_key = time.strftime("%Y-%m-%d", time.localtime())
    tasks = plan_tasks(prefs["training_minutes"], prefs["goal"], weak)
    completed = await get_plan_completed(user_id, day_key)
    for task in tasks:
        task["completed"] = task["task_id"] in completed
    return web.json_response({
        "ok": True,
        "date": day_key,
        "plan": tasks,
        "skills": {sid: {"level": skills.get(sid, 0), **SKILLS[sid]} for sid in SKILLS},
        "weakest": recommendation(weak, skills),
        "prefs": prefs,
        "completed_count": len(completed),
    })


async def api_training_complete(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    task_id = str(data.get("task_id") or "").strip()
    skill_id = str(data.get("skill_id") or "").strip()
    if not task_id or skill_id not in SKILLS:
        return web.json_response({"ok": False, "error": "invalid task"}, status=400)
    day_key = time.strftime("%Y-%m-%d", time.localtime())
    prefs = await get_plan_prefs(user_id)
    skills = await get_user_skills(user_id)
    weak = weakest_skill(skills)
    valid_ids = {t["task_id"] for t in plan_tasks(prefs["training_minutes"], prefs["goal"], weak)}
    if task_id not in valid_ids:
        return web.json_response({"ok": False, "error": "task not in today plan"}, status=400)
    first_time = await complete_plan_task(user_id, day_key, task_id, skill_id)
    level = await add_skill_points(user_id, skill_id, 5)
    if first_time:
        profile = await award_training(user_id)
    else:
        profile = await get_profile(user_id)
    return web.json_response({
        "ok": True,
        "profile": profile,
        "skill_level": level,
        "rewarded": first_time,
    })


async def api_onboarding(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    try:
        minutes = int(data.get("training_minutes") or 30)
    except (TypeError, ValueError):
        minutes = 30
    goal = str(data.get("goal") or "aim").strip()
    if goal not in ("aim", "utility", "game_sense", "movement", "faceit10"):
        goal = "aim"
    try:
        faceit_level = int(data.get("faceit_level") or 0)
    except (TypeError, ValueError):
        faceit_level = 0
    prefs = await save_plan_prefs(
        user_id,
        minutes,
        goal,
        str(data.get("role") or "rifler").strip() or "rifler",
        faceit_level,
    )
    return web.json_response({"ok": True, "prefs": prefs})


async def api_training_log(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    map_id = str(data["map_id"] or "").strip()
    lineup_id = str(data["lineup_id"] or "").strip()
    if not map_id or not lineup_id:
        return web.json_response({"ok": False, "error": "missing ids"}, status=400)
    first_time = await get_practice_attempts(user_id, map_id, lineup_id) == 0
    await log_practice(user_id, map_id, lineup_id)
    if first_time:
        profile = await award_practice(user_id)
    else:
        profile = await get_profile(user_id)
    return web.json_response({"ok": True, "profile": profile})


async def api_games_progress(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    return web.json_response(
        {"ok": True, "progress": await get_mini_game_progress(user_id)}
    )


# Anti-cheat правила для мини-игр: минимальное время на вопрос, лимит вопросов
GAME_RULES: dict[str, dict] = {
    "callouts": {"min_ms_per_question": 800, "max_total": 30},
    "utility": {"min_ms_per_question": 600, "max_total": 15},
    "economy": {"min_ms_per_question": 1000, "max_total": 10},
    "reaction": {"min_ms_per_question": 120, "max_total": 5},
    "aim": {"min_ms_per_question": 250, "max_total": 15},
    "whosaid": {"min_ms_per_question": 600, "max_total": 12},
    "guessmap": {"min_ms_per_question": 800, "max_total": 10},
}
DEFAULT_GAME_RULE = {"min_ms_per_question": 500, "max_total": 200}
MAX_DURATION_MS = 24 * 60 * 60 * 1000


async def api_games_submit(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    game_id = str(data.get("game_id") or "").strip()
    if game_id not in GAMES:
        return web.json_response({"ok": False, "error": "unknown game"}, status=400)
    try:
        score = int(data.get("score") or 0)
        total = int(data.get("total") or 0)
        duration_ms = int(data.get("duration_ms") or 0)
    except (TypeError, ValueError):
        return web.json_response({"ok": False, "error": "bad numeric params"}, status=400)
    rule = GAME_RULES.get(game_id, DEFAULT_GAME_RULE)
    qlen = len(GAMES[game_id]["questions"])
    max_total = rule["max_total"] if qlen == 0 else min(rule["max_total"], qlen)
    if total <= 0 or total > max_total or score < 0 or score > total:
        return web.json_response({"ok": False, "error": "impossible score"}, status=400)
    min_duration = total * rule["min_ms_per_question"]
    if duration_ms < min_duration or duration_ms > MAX_DURATION_MS:
        return web.json_response({"ok": False, "error": "impossible duration"}, status=400)
    if await find_duplicate_game_submit(user_id, game_id, score, total, duration_ms):
        return web.json_response({"ok": False, "error": "duplicate"}, status=400)
    await save_mini_game_result(user_id, game_id, score, total, duration_ms)
    rewarded = await get_game_submissions_today(user_id, game_id) <= GAME_DAILY_REWARD_CAP
    profile = await award_game(user_id, perfect=(score >= total), rewarded=rewarded)
    daily_bonus = False
    if game_id == daily_game(time.localtime().tm_yday):
        if await get_game_submissions_today(user_id, game_id) == 1:
            profile = await award_xp(user_id, XP_FIRST_DAILY, 5, reason="daily")
            daily_bonus = True
    return web.json_response(
        {"ok": True, "profile": profile, "rewarded": rewarded, "daily_bonus": daily_bonus}
    )


async def api_games(request: web.Request) -> web.Response:
    from .services import get_content_overrides

    game_overrides = await get_content_overrides("game")
    out = {}
    for gid, g in GAMES.items():
        override = game_overrides.get(gid) or {}
        questions = override.get("questions") if isinstance(override.get("questions"), list) else g["questions"]
        out[gid] = {
            "id": g["id"],
            "title": override.get("title") or g["title"],
            "title_ru": override.get("title_ru") or g["title_ru"],
            "desc": override.get("desc") or g["desc"],
            "desc_ru": override.get("desc_ru") or g["desc_ru"],
            "icon": g["icon"],
            "kind": g.get("kind", "quiz"),
            "questions": questions,
        }
    return web.json_response({"ok": True, "games": out})


async def api_games_daily(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    gid = daily_game(time.localtime().tm_yday)
    g = GAMES[gid]
    day_key = time.strftime("%Y-%m-%d", time.localtime())
    completed = False
    if await get_game_submissions_today(user_id, gid) > 0:
        completed = True
    return web.json_response({
        "ok": True,
        "date": day_key,
        "game": {
            "id": g["id"],
            "title": g["title"],
            "title_ru": g["title_ru"],
            "icon": g["icon"],
            "kind": g.get("kind", "quiz"),
        },
        "completed": completed,
    })


async def api_profile(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    profile = await get_profile(user_id)
    return web.json_response({"ok": True, "profile": profile})


async def api_challenges(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    week_key = current_week_key()
    progress = await get_week_challenge_progress(user_id, week_key)
    challenges = []
    for ch in week_challenges(week_key):
        cur = progress.get(ch["type"], 0)
        challenges.append({
            "id": ch["id"],
            "type": ch["type"],
            "title": ch["title"],
            "title_ru": ch["title_ru"],
            "desc": ch["desc"],
            "desc_ru": ch["desc_ru"],
            "icon": ch["icon"],
            "target": ch["target"],
            "progress": cur,
            "completed": cur >= ch["target"],
            "claimed": ch["id"] in progress["claimed"],
            "reward_xp": ch["reward_xp"],
            "reward_coins": ch["reward_coins"],
        })
    return web.json_response({"ok": True, "week_key": week_key, "challenges": challenges})


async def api_challenges_claim(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    challenge_id = str(data.get("challenge_id") or "").strip()
    if not challenge_id:
        return web.json_response({"ok": False, "error": "missing challenge_id"}, status=400)
    result = await claim_week_challenge(user_id, current_week_key(), challenge_id)
    if not result["ok"]:
        return web.json_response({"ok": False, "error": result["error"]}, status=400)
    return web.json_response(result)


async def api_friends(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await get_friends_data(user_id)
    return web.json_response({"ok": True, **data})


async def api_friends_request(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    try:
        friend_id = int(data.get("user_id") or 0)
    except (TypeError, ValueError):
        return web.json_response({"ok": False, "error": "bad user_id"}, status=400)
    if friend_id <= 0:
        return web.json_response({"ok": False, "error": "bad user_id"}, status=400)
    result = await send_friend_request(user_id, friend_id)
    if not result["ok"]:
        return web.json_response({"ok": False, "error": result["error"]}, status=400)
    return web.json_response(result)


async def api_friends_accept(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    try:
        requester_id = int(data.get("user_id") or 0)
    except (TypeError, ValueError):
        return web.json_response({"ok": False, "error": "bad user_id"}, status=400)
    result = await accept_friend_request(user_id, requester_id)
    if not result["ok"]:
        return web.json_response({"ok": False, "error": result["error"]}, status=400)
    return web.json_response(result)


async def api_friends_remove(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    try:
        friend_id = int(data.get("user_id") or 0)
    except (TypeError, ValueError):
        return web.json_response({"ok": False, "error": "bad user_id"}, status=400)
    await remove_friend(user_id, friend_id)
    return web.json_response({"ok": True})


async def api_friends_leaderboard(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await get_friends_data(user_id)
    leaders = [{"rank": i + 1, **f} for i, f in enumerate(data["friends"])]
    return web.json_response({"ok": True, "leaders": leaders})


async def api_transactions(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    tx = await get_transactions(user_id)
    return web.json_response({"ok": True, "transactions": tx})


async def api_achievements(request: web.Request) -> web.Response:
    catalog = await get_achievements_catalog()
    return web.json_response({"ok": True, "achievements": catalog})


async def api_leaderboard(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    lb = await get_leaderboard(user_id)
    return web.json_response({"ok": True, "leaderboard": lb})


async def api_shop(request: web.Request) -> web.Response:
    catalog = await get_shop_catalog()
    auth = _auth(request)
    inventory = {}
    if auth:
        inventory = await get_inventory(auth[0])
    return web.json_response({"ok": True, "catalog": catalog, "inventory": inventory})


async def api_shop_buy(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    item_id = str(data.get("item_id") or "").strip()
    result = await buy_item(user_id, item_id)
    if result.get("ok"):
        result["profile"] = await get_profile(user_id)
    return web.json_response(result)


async def api_shop_equip(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    item_id = str(data.get("item_id") or "").strip()
    result = await equip_item(user_id, item_id)
    return web.json_response(result)


async def api_faceit_link(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    data = await request.json()
    faceit_name = str(data.get("faceit_name") or "").strip()
    if not faceit_name:
        return web.json_response({"ok": False, "error": "name required"}, status=400)
    faceit_info = await get_faceit_player_info(faceit_name, force=True)
    if not faceit_info or not faceit_info.get("player_id"):
        return web.json_response({"ok": False, "error": "FACEIT player not found"}, status=404)
    from sqlalchemy import update
    from .models import UserProfile
    from .db import SessionLocal
    async with SessionLocal() as session:
        await session.execute(
            update(UserProfile)
            .where(UserProfile.user_id == user_id)
            .values(
                faceit_id=faceit_info["player_id"],
                faceit_name=faceit_name,
                faceit_level=int(faceit_info.get("skill_level") or 0),
                faceit_elo=int(faceit_info.get("elo") or 0),
            )
        )
        await session.commit()
    profile = await get_profile(user_id)
    return web.json_response({"ok": True, "profile": profile})


async def api_faceit_sync(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    from sqlalchemy import select, update
    from .models import UserProfile
    from .db import SessionLocal
    async with SessionLocal() as session:
        profile = await session.scalar(
            select(UserProfile).where(UserProfile.user_id == user_id)
        )
        faceit_id = profile.faceit_id if profile else ""
    if not faceit_id:
        return web.json_response({"ok": False, "error": "not linked"}, status=400)
    try:
        faceit_info = await get_faceit_player_info(faceit_id, force=True)
    except Exception:
        return web.json_response({"ok": False, "error": "sync failed"}, status=502)
    if not faceit_info:
        return web.json_response({"ok": False, "error": "FACEIT player not found"}, status=404)
    async with SessionLocal() as session:
        await session.execute(
            update(UserProfile)
            .where(UserProfile.user_id == user_id)
            .values(
                faceit_name=faceit_info.get("nickname") or profile.faceit_name,
                faceit_level=int(faceit_info.get("skill_level") or 0),
                faceit_elo=int(faceit_info.get("elo") or 0),
            )
        )
        await session.commit()
    profile = await get_profile(user_id)
    return web.json_response({"ok": True, "profile": profile})


async def api_faceit_unlink(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None:
        return _unauthorized()
    user_id, _ = auth
    from sqlalchemy import update
    from .models import UserProfile
    from .db import SessionLocal
    async with SessionLocal() as session:
        await session.execute(
            update(UserProfile)
            .where(UserProfile.user_id == user_id)
            .values(faceit_id="", faceit_name="")
        )
        await session.commit()
    profile = await get_profile(user_id)
    return web.json_response({"ok": True, "profile": profile})


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


@web.middleware
async def _rate_limit(request: web.Request, handler: Any) -> web.StreamResponse:
    if not request.path.startswith("/api/"):
        return await handler(request)
    auth = _auth(request)
    if auth is not None:
        key = f"user:{auth[0]}"
        limit = RATE_MAX_AUTH
    else:
        key = f"ip:{request.remote or 'unknown'}"
        limit = RATE_MAX_ANON
    if not _rate_allowed(key, limit):
        return web.json_response(
            {"ok": False, "error": "too many requests"}, status=429
        )
    return await handler(request)


async def health_handler(request: web.Request) -> web.Response:
    return web.json_response({"ok": True, "status": "up", "service": "cs2-coach"})


async def calibrate_handler(request: web.Request) -> web.Response:
    spots = MAP_SPOTS.get("dust2", [])
    existing = json.dumps(spots)
    html = """<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Calibrate Dust2</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#111; color:#eee; font-family:monospace; padding:20px; }
h2 { margin-bottom:6px; }
p.hint { color:#888; margin-bottom:12px; font-size:13px; }
.radar { position:relative; width:512px; height:512px; border:2px solid #333; margin-bottom:16px; user-select:none; }
.radar img { width:100%; height:100%; display:block; pointer-events:none; }
.dot { position:absolute; width:16px; height:16px; border-radius:50%; background:#f44; border:2px solid #fff; transform:translate(-50%,-50%); cursor:grab; z-index:10; }
.dot:active { cursor:grabbing; background:#ff0; }
.dot .tip { position:absolute; top:-20px; left:14px; white-space:nowrap; font-size:11px; background:rgba(0,0,0,.85); padding:2px 6px; border-radius:3px; pointer-events:none; }
.output { background:#1a1a1a; border:1px solid #333; padding:12px; border-radius:6px; }
.output pre { white-space:pre-wrap; font-size:13px; line-height:1.6; color:#0f0; }
.btns { margin:12px 0; display:flex; gap:8px; }
button { background:#333; color:#eee; border:1px solid #555; padding:6px 14px; border-radius:4px; cursor:pointer; font-family:monospace; }
button:hover { background:#555; }
</style></head><body>
<h2>Dust2 — Калибровка точек</h2>
<p class="hint">Перетаскивай точки по карте. Координаты обновляются в реальном времени.</p>
<div class="radar" id="radar">
  <img src="/maps/dust2.png" id="map">
</div>
<div class="btns">
  <button onclick="copyAll()">Копировать JSON</button>
  <button onclick="clearAll()">Очистить всё</button>
</div>
<div class="output"><pre id="out"></pre></div>
<script>
const radar = document.getElementById('radar');
const out = document.getElementById('out');
let points = [];
let dragId = null;
""" + """
const existing = """ + existing + """;
existing.forEach(s => {
  addPoint(s.x, s.y, s.name, s.id);
});
""" + """
function addPoint(x, y, name, sid) {
  const id = points.length;
  points.push({id, x, y, name: name || '', sid: sid || ('sp-' + (id+1))});
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.dataset.idx = id;
  dot.style.left = x + '%';
  dot.style.top = y + '%';
  dot.innerHTML = '<span class="tip">' + (name || '#'+(id+1)) + '</span>';
  radar.appendChild(dot);
  render();
}
function render() {
  let s = '[';
  points.forEach((p, i) => {
    if (!p.name) {
      p.name = 'point-' + (i+1);
      document.querySelector('[data-idx="'+p.id+'"] .tip').textContent = p.name;
    }
    s += (i?',':'') + '\\n  {"id":"' + p.sid + '","name":"' + p.name + '","x":' + p.x + ',"y":' + p.y + ',"videos":[]}';
  });
  s += '\\n]';
  out.textContent = s;
}
radar.addEventListener('mousedown', e => {
  const dot = e.target.closest('.dot');
  if (!dot) return;
  dragId = parseInt(dot.dataset.idx);
  e.preventDefault();
});
document.addEventListener('mousemove', e => {
  if (dragId === null) return;
  const r = radar.getBoundingClientRect();
  const x = Math.round(Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)));
  const y = Math.round(Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100)));
  const dot = document.querySelector('[data-idx="'+dragId+'"]');
  dot.style.left = x + '%';
  dot.style.top = y + '%';
  points[dragId].x = x;
  points[dragId].y = y;
  render();
});
document.addEventListener('mouseup', () => { dragId = null; });
radar.addEventListener('dblclick', e => {
  if (e.target.closest('.dot')) return;
  const r = radar.getBoundingClientRect();
  const x = Math.round((e.clientX - r.left) / r.width * 100);
  const y = Math.round((e.clientY - r.top) / r.height * 100);
  const name = prompt('Имя точки:') || ('point-' + (points.length+1));
  addPoint(x, y, name);
});
function copyAll() {
  navigator.clipboard.writeText(out.textContent).then(() => alert('Скопировано!'));
}
function clearAll() {
  if (!confirm('Удалить все точки?')) return;
  points = [];
  radar.querySelectorAll('.dot').forEach(d => d.remove());
  render();
}
render();
</script></body></html>"""
    return web.Response(text=html, content_type="text/html")


def _is_admin(user_id: int) -> bool:
    return user_id in CONFIG.admin_ids


async def api_admin_dashboard(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None or not _is_admin(auth[0]):
        return web.json_response({"ok": False, "error": "forbidden"}, status=403)
    from sqlalchemy import func, select
    from .db import SessionLocal
    from .models import (
        ChallengeProgress,
        CurrencyTransaction,
        MiniGameResult,
        PracticeLog,
        QuizResult,
        TrainingSession,
        User,
        LessonProgress,
        UserProfile,
    )
    async with SessionLocal() as session:
        total_users = await session.scalar(select(func.count(User.id)))
        total_profiles = await session.scalar(select(func.count(UserProfile.user_id)))
        total_lessons = await session.scalar(select(func.count(LessonProgress.id)))
        total_quizzes = await session.scalar(select(func.count(QuizResult.id)))
        total_practices = await session.scalar(select(func.count(PracticeLog.id)))
        total_games = await session.scalar(select(func.count(MiniGameResult.id)))
        total_training = await session.scalar(select(func.count(TrainingSession.id)))
        total_challenges = await session.scalar(select(func.count(ChallengeProgress.id)))
        total_xp_given = await session.scalar(
            select(func.coalesce(func.sum(CurrencyTransaction.xp_delta), 0)).where(
                CurrencyTransaction.xp_delta > 0
            )
        )
        total_coins_spent = await session.scalar(
            select(func.coalesce(func.sum(-CurrencyTransaction.coin_delta), 0)).where(
                CurrencyTransaction.coin_delta < 0
            )
        )
        total_tx = await session.scalar(select(func.count(CurrencyTransaction.id)))
        top_rows = await session.execute(
            select(UserProfile.user_id, UserProfile.xp)
            .order_by(UserProfile.xp.desc())
            .limit(3)
        )
        top_users = [{"user_id": uid, "xp": xp} for uid, xp in top_rows]
    return web.json_response({
        "ok": True,
        "dashboard": {
            "total_users": total_users or 0,
            "total_profiles": total_profiles or 0,
            "total_lessons_done": total_lessons or 0,
            "total_quizzes_done": total_quizzes or 0,
            "total_practices_done": total_practices or 0,
            "total_games_done": total_games or 0,
            "total_training_done": total_training or 0,
            "total_challenges_claimed": total_challenges or 0,
            "total_xp_given": int(total_xp_given or 0),
            "total_coins_spent": int(total_coins_spent or 0),
            "total_transactions": total_tx or 0,
            "top_users": top_users,
        },
    })


async def api_admin_users(request: web.Request) -> web.Response:
    auth = _auth(request)
    if auth is None or not _is_admin(auth[0]):
        return web.json_response({"ok": False, "error": "forbidden"}, status=403)
    from sqlalchemy import select
    from .db import SessionLocal
    from .models import User, UserProfile

    async with SessionLocal() as session:
        rows = await session.execute(
            select(User, UserProfile).outerjoin(UserProfile, User.id == UserProfile.user_id)
        )
        users = []
        for user, profile in rows.all():
            users.append({
                "user_id": user.id,
                "first_name": user.first_name,
                "username": user.username or "",
                "xp": profile.xp if profile else 0,
                "coins": profile.coins if profile else 0,
                "level": profile.level if profile else 1,
                "faceit_name": profile.faceit_name if profile else "",
            })
    return web.json_response({"ok": True, "users": users})


def _admin_auth(request: web.Request):
    auth = _auth(request)
    if auth is None or not _is_admin(auth[0]):
        return None
    return auth[0]


async def api_admin_content(request: web.Request) -> web.Response:
    user_id = _admin_auth(request)
    if user_id is None:
        return web.json_response({"ok": False, "error": "forbidden"}, status=403)
    from .services import delete_content_override, save_content_override
    data = await request.json()
    content_type = str(data.get("content_type") or "").strip()
    key = str(data.get("content_key") or "").strip()
    if not content_type or not key:
        return web.json_response({"ok": False, "error": "missing fields"}, status=400)
    if content_type not in ("grenade", "shop", "game"):
        return web.json_response({"ok": False, "error": "bad content_type"}, status=400)
    result = await save_content_override(content_type, key, data.get("payload") or {})
    return web.json_response(result)


async def api_admin_content_delete(request: web.Request) -> web.Response:
    user_id = _admin_auth(request)
    if user_id is None:
        return web.json_response({"ok": False, "error": "forbidden"}, status=403)
    from .services import delete_content_override
    data = await request.json()
    content_type = str(data.get("content_type") or "").strip()
    key = str(data.get("content_key") or "").strip()
    if not content_type or not key:
        return web.json_response({"ok": False, "error": "missing fields"}, status=400)
    await delete_content_override(content_type, key)
    return web.json_response({"ok": True})


async def api_admin_grenades(request: web.Request) -> web.Response:
    user_id = _admin_auth(request)
    if user_id is None:
        return web.json_response({"ok": False, "error": "forbidden"}, status=403)
    from .services import get_content_overrides
    overrides = await get_content_overrides("grenade")
    return web.json_response({"ok": True, "overrides": overrides})


async def _on_shutdown(app: web.Application) -> None:
    await close_stats_session()


def create_app() -> web.Application:
    app = web.Application(middlewares=[_cache_control, _rate_limit])
    app.on_shutdown.append(_on_shutdown)
    app.router.add_get("/", index_handler)
    app.router.add_get("/healthz", health_handler)
    app.router.add_get("/calibrate/dust2", calibrate_handler)
    app.router.add_get("/api/init", api_init)
    app.router.add_get("/api/content", api_content)
    app.router.add_get("/api/guides", api_guides)
    app.router.add_get("/api/grenades", api_grenades)
    app.router.add_get("/api/grenades/{id}", api_grenade_detail)
    app.router.add_get("/api/favorites", api_favorites)
    app.router.add_post("/api/favorites", api_favorite_add)
    app.router.add_delete("/api/favorites", api_favorite_remove)
    app.router.add_get("/api/progress", api_progress)
    app.router.add_get("/api/stats", api_stats)
    app.router.add_get("/api/team", api_team)
    app.router.add_get("/api/player", api_player)
    app.router.add_get("/api/faceit-player", api_faceit_player)
    app.router.add_post("/api/card", api_card)
    app.router.add_post("/api/lesson", api_lesson)
    app.router.add_post("/api/quiz", api_quiz)
    app.router.add_get("/api/training", api_training)
    app.router.add_post("/api/training", api_training_log)
    app.router.add_get("/api/training/plan", api_training_plan)
    app.router.add_post("/api/training/complete", api_training_complete)
    app.router.add_post("/api/onboarding", api_onboarding)
    app.router.add_get("/api/games/progress", api_games_progress)
    app.router.add_post("/api/games/submit", api_games_submit)
    app.router.add_get("/api/games", api_games)
    app.router.add_get("/api/games/daily", api_games_daily)
    app.router.add_get("/api/profile", api_profile)
    app.router.add_get("/api/transactions", api_transactions)
    app.router.add_get("/api/challenges", api_challenges)
    app.router.add_post("/api/challenges/claim", api_challenges_claim)
    app.router.add_get("/api/friends", api_friends)
    app.router.add_post("/api/friends/request", api_friends_request)
    app.router.add_post("/api/friends/accept", api_friends_accept)
    app.router.add_post("/api/friends/remove", api_friends_remove)
    app.router.add_get("/api/friends/leaderboard", api_friends_leaderboard)
    app.router.add_get("/api/achievements", api_achievements)
    app.router.add_get("/api/leaderboard", api_leaderboard)
    app.router.add_get("/api/shop", api_shop)
    app.router.add_post("/api/shop/buy", api_shop_buy)
    app.router.add_post("/api/shop/equip", api_shop_equip)
    app.router.add_post("/api/faceit/link", api_faceit_link)
    app.router.add_post("/api/faceit/sync", api_faceit_sync)
    app.router.add_post("/api/faceit/unlink", api_faceit_unlink)
    app.router.add_get("/api/admin/dashboard", api_admin_dashboard)
    app.router.add_get("/api/admin/users", api_admin_users)
    app.router.add_get("/api/admin/grenades", api_admin_grenades)
    app.router.add_post("/api/admin/content", api_admin_content)
    app.router.add_post("/api/admin/content/delete", api_admin_content_delete)
    app.router.add_get("/static/{filename:.*}", _static_handler)
    return app


async def start_web_server() -> web.AppRunner:
    app = create_app()
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, host="0.0.0.0", port=CONFIG.port)
    await site.start()
    return runner
