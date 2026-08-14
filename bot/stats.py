import asyncio
import logging
import time
from datetime import datetime, timedelta, timezone
from typing import Any

import aiohttp

from .config_loader import CONFIG

BO3_BASE = "https://api.bo3.gg/api/v1"
BO3_HEADERS = {
    "accept": "application/json, text/plain, */*",
    "origin": "https://bo3.gg",
    "referer": "https://bo3.gg/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0",
}

FACEIT_BASE = "https://open.faceit.com/data/v4"

CACHE_TTL = 15 * 60

TOP_TEAMS = 10
TOP_FACEIT = 20
TOP_PRO = 30

_session: aiohttp.ClientSession | None = None
_cache: dict[str, tuple[float, Any]] = {}
_avatar_semaphore = asyncio.Semaphore(5)

logger = logging.getLogger(__name__)


async def _get_session() -> aiohttp.ClientSession:
    global _session
    if _session is None or _session.closed:
        _session = aiohttp.ClientSession()
    return _session


def _read_cache(key: str, ttl: float) -> Any | None:
    item = _cache.get(key)
    if item and time.monotonic() - item[0] < ttl:
        return item[1]
    return None


def _write_cache(key: str, value: Any) -> Any:
    _cache[key] = (time.monotonic(), value)
    return value


async def _close_session() -> None:
    global _session
    if _session is not None and not _session.closed:
        await _session.close()


def _faceit_headers() -> dict[str, str] | None:
    if not CONFIG.faceit_api_key:
        return None
    return {"Authorization": f"Bearer {CONFIG.faceit_api_key}", "Accept": "application/json"}


async def _bo3_json(path: str, params: dict[str, Any]) -> list[dict]:
    session = await _get_session()
    async with session.get(
        f"{BO3_BASE}{path}", params=params, headers=BO3_HEADERS, timeout=20
    ) as response:
        response.raise_for_status()
        data = await response.json()
    return data.get("results", [])


async def _faceit_player_avatar(
    session: aiohttp.ClientSession, headers: dict[str, str], player_id: str
) -> str | None:
    if not player_id:
        return None
    async with _avatar_semaphore:
        try:
            async with session.get(
                f"{FACEIT_BASE}/players/{player_id}", headers=headers, timeout=15
            ) as response:
                if response.status != 200:
                    return None
                data = await response.json()
                return data.get("avatar")
        except Exception:
            return None


async def get_faceit_ranking(region: str = "EU", limit: int = TOP_FACEIT) -> list[dict]:
    key = f"faceit:{region}:{limit}"
    cached = _read_cache(key, CACHE_TTL)
    if cached is not None:
        return cached
    headers = _faceit_headers()
    if headers is None:
        return []
    session = await _get_session()
    async with session.get(
        f"{FACEIT_BASE}/rankings/games/cs2/regions/{region}",
        params={"limit": limit},
        headers=headers,
        timeout=20,
    ) as response:
        response.raise_for_status()
        data = await response.json()
    items = data.get("items", [])
    avatars = await asyncio.gather(
        *[_faceit_player_avatar(session, headers, it.get("player_id")) for it in items],
        return_exceptions=True,
    )
    result = []
    for it, av in zip(items, avatars):
        if isinstance(av, Exception):
            av = None
        result.append(
            {
                "position": it.get("position"),
                "nickname": it.get("nickname"),
                "country": it.get("country"),
                "faceit_elo": it.get("faceit_elo"),
                "skill_level": it.get("game_skill_level"),
                "image": av,
            }
        )
    logger.info("fetched faceit ranking %s: %s", region, len(result))
    return _write_cache(key, result)


async def _team_winrate(slug: str) -> float | None:
    today = datetime.now(timezone.utc)
    start = (today - timedelta(days=180)).strftime("%Y-%m-%d")
    end = today.strftime("%Y-%m-%d")
    session = await _get_session()
    async with session.get(
        f"{BO3_BASE}/teams/{slug}/general_stats",
        params={"filter[start_date_from]": start, "filter[start_date_to]": end},
        headers=BO3_HEADERS,
        timeout=20,
    ) as response:
        response.raise_for_status()
        data = await response.json()
    games = data.get("games_count") or 0
    won = data.get("games_won_count") or 0
    if games <= 0:
        return None
    return round(won / games * 100, 1)


async def get_bo3_teams(limit: int = TOP_TEAMS) -> list[dict]:
    key = f"bo3:teams:{limit}"
    cached = _read_cache(key, CACHE_TTL)
    if cached is not None:
        return cached
    raw = await _bo3_json(
        "/filters/teams",
        {
            "page[offset]": 0,
            "page[limit]": limit,
            "filter[teams.discipline_id][eq]": 1,
            "sort": "rank",
            "with": "country",
        },
    )
    winrates = await asyncio.gather(
        *[_team_winrate(t["slug"]) for t in raw], return_exceptions=True
    )
    result = []
    for t, wr in zip(raw, winrates):
        if isinstance(wr, Exception):
            wr = None
        result.append(
            {
                "rank": t.get("rank"),
                "name": t.get("name"),
                "country_code": (t.get("country") or {}).get("code"),
                "value": wr,
                "decimals": 1,
                "image": t.get("image_url"),
            }
        )
    logger.info("fetched bo3 teams: %s", len(result))
    return _write_cache(key, result)


async def get_bo3_players(limit: int = TOP_PRO) -> list[dict]:
    key = f"bo3:players:{limit}"
    cached = _read_cache(key, CACHE_TTL)
    if cached is not None:
        return cached
    raw = await _bo3_json(
        "/players",
        {
            "page[offset]": 0,
            "page[limit]": limit,
            "sort": "rank",
            "with": "team,country",
        },
    )
    result = []
    for p in raw:
        rating = p.get("six_month_avg_rating")
        result.append(
            {
                "rank": p.get("rank"),
                "name": p.get("nickname"),
                "team": (p.get("team") or {}).get("name"),
                "country_code": (p.get("country") or {}).get("code"),
                "value": rating,
                "decimals": 2,
                "image": (p.get("image_versions") or {}).get("webp") or p.get("image_url"),
            }
        )
    logger.info("fetched bo3 players: %s", len(result))
    return _write_cache(key, result)


async def get_stats() -> dict:
    faceit, teams, pro = await asyncio.gather(
        get_faceit_ranking("EU", TOP_FACEIT),
        get_bo3_teams(TOP_TEAMS),
        get_bo3_players(TOP_PRO),
        return_exceptions=True,
    )
    sections = []
    if isinstance(teams, list):
        sections.append(
            {
                "id": "teams",
                "title": "Команды",
                "subtitle": f"Топ-{len(teams)} · рейтинг про-сцены",
                "unit": "WIN%",
                "items": teams,
            }
        )
    if isinstance(faceit, list):
        items = [
            {
                "rank": it.get("position"),
                "name": it.get("nickname"),
                "country_code": it.get("country"),
                "value": it.get("faceit_elo"),
                "decimals": 0,
                "image": it.get("image"),
            }
            for it in faceit
        ]
        sections.append(
            {
                "id": "faceit",
                "title": "FACEIT",
                "subtitle": f"Топ-{len(items)} · регион EU",
                "unit": "ELO",
                "items": items,
            }
        )
    if isinstance(pro, list):
        sections.append(
            {
                "id": "pro",
                "title": "Про-сцена",
                "subtitle": f"Топ-{len(pro)} · рейтинг за 6 мес.",
                "unit": "RATING",
                "items": pro,
            }
        )
    return {
        "source": "faceit+bo3",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "sections": sections,
    }


async def close() -> None:
    await _close_session()


def clear_cache() -> None:
    _cache.clear()
