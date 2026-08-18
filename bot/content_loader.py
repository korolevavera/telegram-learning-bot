"""Data-driven контент: загрузка из JSON-файлов с фолбэком на Python.

Порядок:
1. Если файл bot/data/<section>.json существует и валиден — берём его.
2. Иначе используем значения, объявленные в content.py (фолбэк).

Это позволяет менять уроки, карточки, тесты, гайды и тактики
без правки кода — достаточно поправить JSON и задеплоить.
"""
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parent / "data"

SECTIONS: dict[str, tuple[str, type]] = {
    "LESSONS": ("lessons.json", list),
    "CARDS": ("cards.json", list),
    "QUIZZES": ("quizzes.json", list),
    "MAPS": ("maps.json", list),
    "LINEUP_TYPES": ("lineup_types.json", dict),
    "ROLES": ("roles.json", dict),
    "DIFFICULTY": ("difficulty.json", dict),
    "POSITIONS": ("positions.json", dict),
    "TERMS": ("terms.json", dict),
    "LINEUPS": ("lineups.json", dict),
    "TACTICS": ("tactics.json", dict),
    "MAP_SPOTS": ("map_spots.json", dict),
}


def _coerce(name: str, data):
    if name == "DIFFICULTY":
        try:
            return {int(k): v for k, v in data.items()}
        except (TypeError, ValueError):
            return data
    return data


def load_section(name: str):
    entry = SECTIONS.get(name)
    if entry is None:
        return None
    fname, expected = entry
    path = DATA_DIR / fname
    if not path.exists():
        return None
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        logger.warning("content: не удалось прочитать %s: %s", fname, exc)
        return None
    if not isinstance(data, expected):
        logger.warning("content: %s не является %s — игнорирую", fname, expected.__name__)
        return None
    return _coerce(name, data)


def apply_overrides(module_globals) -> None:
    """Подменяет модульные константы контента данными из JSON (если есть)."""
    for name in SECTIONS:
        data = load_section(name)
        if data is not None:
            module_globals[name] = data
            logger.info("content: %s загружен из JSON (%s)", name, SECTIONS[name][0])
