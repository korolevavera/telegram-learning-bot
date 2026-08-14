import asyncio
import logging
import time
from datetime import datetime, timezone
from typing import Any

import aiohttp

BO3_BASE = "https://api.bo3.gg/api/v1"
_HEADERS = {
    "accept": "application/json, text/plain, */*",
    "origin": "https://bo3.gg",
    "referer": "https://bo3.gg/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0",
}

TOP_PLAYERS_TTL = 15 * 60
TOP_EARNERS_TTL = 15 * 60

_session: aiohttp.ClientSession | None = None
_cache: dict[str, tuple[float, Any]] = {}

logger = logging.getLogger(__name__)


async def _get_session() -> aiohttp.ClientSession:
    global _session
    if _session is None or _session.closed:
        _session = aiohttp.ClientSession(headers=_HEADERS)
    return _session


def _read_cache(key: str, ttl: float) -> Any | None:
    item = _cache.get(key)
    if item and time.monotonic() - item[0] < ttl:
        return item[1]
    return None


def _write_cache(key: str, value: Any) -> Any:
    _cache[key] = (time.monotonic(), value)
    return value


async def _get_json(url: str, params: dict | None = None) -> dict:
    session = await _get_session()
    async with session.get(url, params=params, timeout=20) as response:
        response.raise_for_status()
        return await response.json()


async def _close_session() -> None:
    global _session
    if _session is not None and not _session.closed:
        await _session.close()


def _first_team(teams: list | None) -> dict | None:
    return (teams or [{}])[0] or None


async def get_top_players(limit: int = 20) -> list[dict]:
    key = f"top_players:{limit}"
    cached = _read_cache(key, TOP_PLAYERS_TTL)
    if cached is not None:
        return cached
    data = await _get_json(
        f"{BO3_BASE}/players",
        {
            "page[offset]": 0,
            "page[limit]": limit,
            "sort": "rank",
            "with": "teams,country",
        },
    )
    result: list[dict] = []
    for p in data.get("results", []):
        team = _first_team(p.get("teams"))
        country = p.get("country") or {}
        result.append(
            {
                "rank": p.get("rank"),
                "nickname": p.get("nickname"),
                "first_name": p.get("first_name"),
                "last_name": p.get("last_name"),
                "rating": p.get("six_month_avg_rating"),
                "team": team.get("name") if team else None,
                "team_slug": team.get("slug") if team else None,
                "country": country.get("name"),
                "country_code": country.get("code"),
                "image_url": p.get("image_url"),
            }
        )
    logger.info("fetched top players: %s", len(result))
    return _write_cache(key, result)


async def get_top_earners(limit: int = 10) -> list[dict]:
    key = f"top_earners:{limit}"
    cached = _read_cache(key, TOP_EARNERS_TTL)
    if cached is not None:
        return cached
    data = await _get_json(
        f"{BO3_BASE}/players/earnings",
        {"page[offset]": 0, "page[limit]": limit},
    )
    result: list[dict] = []
    for p in data.get("results", []):
        team = _first_team(p.get("teams"))
        result.append(
            {
                "nickname": p.get("nickname"),
                "team": team.get("name") if team else None,
                "team_slug": team.get("slug") if team else None,
                "total_earnings": p.get("total_earnings"),
                "tour_wins": p.get("tour_wins"),
                "last_earnings_date": p.get("last_earnings_date"),
                "image_url": p.get("image_url"),
            }
        )
    logger.info("fetched top earners: %s", len(result))
    return _write_cache(key, result)


async def get_stats() -> dict:
    top_players, top_earners = await asyncio.gather(get_top_players(20), get_top_earners(10))
    return {
        "source": "bo3.gg",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "top_players": top_players,
        "top_earners": top_earners,
    }


async def close() -> None:
    await _close_session()
