import logging
import time
from datetime import datetime, timezone
from typing import Any

import aiohttp

from .config_loader import CONFIG

FACEIT_BASE = "https://open.faceit.com/data/v4"
FACEIT_RANKING_TTL = 15 * 60

_session: aiohttp.ClientSession | None = None
_cache: dict[str, tuple[float, Any]] = {}

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


async def get_faceit_ranking(region: str = "EU", limit: int = 20) -> list[dict]:
    key = f"faceit:{region}:{limit}"
    cached = _read_cache(key, FACEIT_RANKING_TTL)
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
    result = [
        {
            "position": it.get("position"),
            "nickname": it.get("nickname"),
            "country": it.get("country"),
            "faceit_elo": it.get("faceit_elo"),
            "skill_level": it.get("game_skill_level"),
        }
        for it in data.get("items", [])
    ]
    logger.info("fetched faceit ranking %s: %s", region, len(result))
    return _write_cache(key, result)


async def get_stats() -> dict:
    faceit = await get_faceit_ranking("EU", 20)
    return {
        "source": "faceit",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "faceit": {"region": "EU", "players": faceit},
    }


async def close() -> None:
    await _close_session()
