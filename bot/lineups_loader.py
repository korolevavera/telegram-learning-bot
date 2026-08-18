import json
import re
from pathlib import Path

from .content import MAPS

LINEUPS_JSON = Path(__file__).resolve().parent / "lineups.json"


def load_lineups() -> list[dict]:
    try:
        data = json.loads(LINEUPS_JSON.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []
    return data if isinstance(data, list) else []


def _norm(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", (name or "").lower()).replace("ii", "2")


def _map_name_to_id(name: str) -> str | None:
    if not name:
        return None
    needle = _norm(name)
    for m in MAPS:
        if m["id"] == needle or _norm(m["name"]) == needle:
            return m["id"]
    return None


def get_lineups_for_map(map_name: str) -> list[dict]:
    map_id = _map_name_to_id(map_name)
    if map_id is None:
        return []
    return [entry for entry in load_lineups() if _map_name_to_id(entry.get("map", "")) == map_id]


def _steps_from(description: str) -> list[str]:
    text = str(description or "").strip()
    return [text] if text else []


def merge_lineups(lineups: dict[str, list[dict]]) -> dict[str, list[dict]]:
    for entry in load_lineups():
        map_id = _map_name_to_id(entry.get("map", ""))
        lineup_id = str(entry.get("id") or "").strip()
        if map_id is None or not lineup_id:
            continue
        target = next((l for l in lineups.get(map_id, []) if l["id"] == lineup_id), None)
        if target is None:
            new_lineup = {
                "id": lineup_id,
                "type": entry.get("type", "default"),
                "title": entry.get("name", lineup_id),
                "steps": _steps_from(entry.get("description", "")),
                "side": entry.get("side", "T"),
                "site": entry.get("site", "A"),
                "difficulty": entry.get("difficulty", 1),
            }
            if entry.get("video_url"):
                new_lineup["video"] = entry["video_url"]
            lineups.setdefault(map_id, []).append(new_lineup)
        elif entry.get("video_url"):
            target["video"] = entry["video_url"]
    return lineups


def get_lineups() -> dict[str, list[dict]]:
    from .content import LINEUPS

    merged = {map_id: [dict(lineup) for lineup in lineups] for map_id, lineups in LINEUPS.items()}
    merged = merge_lineups(merged)
    _apply_admin_overrides(merged)
    return merged


def _apply_admin_overrides(lineups: dict[str, list[dict]]) -> None:
    """Применить переопределения гранат от админа (поверх JSON-файлов)."""
    import asyncio

    from .content import MAPS
    from .services import get_cached_overrides

    try:
        asyncio.get_running_loop()
    except RuntimeError:
        return

    overrides = get_cached_overrides("grenade")
    if not overrides:
        return
    if not overrides:
        return
    for lineup_id, data in overrides.items():
        map_id = str(data.get("map") or "").strip().lower()
        if map_id not in {m["id"] for m in MAPS}:
            continue
        target = next((l for l in lineups.get(map_id, []) if l["id"] == lineup_id), None)
        entry = {
            "id": lineup_id,
            "type": data.get("type", "default"),
            "title": data.get("title", lineup_id),
            "steps": [s for s in (data.get("steps") or []) if s],
            "side": data.get("side", "T"),
            "site": data.get("site", "A"),
            "difficulty": int(data.get("difficulty") or 1),
        }
        if target is None:
            lineups.setdefault(map_id, []).append(entry)
        else:
            target.update(entry)
