"""Недельные челленджи: каталог, ротация по неделям, награды."""

from datetime import datetime, timedelta, timezone

# Типы челленджей: прогресс считается из реальных данных (игры/тренировки/XP)
CHALLENGES = {
    "games_week": {
        "type": "games_played",
        "target": 7,
        "reward_xp": 40,
        "reward_coins": 10,
        "icon": "🎮",
        "title": "Game Marathon",
        "title_ru": "Игровой марафон",
        "desc": "Play 7 mini-games this week",
        "desc_ru": "Сыграй 7 мини-игр за неделю",
    },
    "training_week": {
        "type": "training_tasks",
        "target": 10,
        "reward_xp": 40,
        "reward_coins": 10,
        "icon": "🏋️",
        "title": "Training Grind",
        "title_ru": "Тренировочный гринд",
        "desc": "Complete 10 plan tasks this week",
        "desc_ru": "Выполни 10 заданий плана за неделю",
    },
    "xp_week": {
        "type": "xp_earned",
        "target": 120,
        "reward_xp": 60,
        "reward_coins": 15,
        "icon": "📈",
        "title": "XP Collector",
        "title_ru": "Коллекционер XP",
        "desc": "Earn 120 XP this week",
        "desc_ru": "Заработай 120 XP за неделю",
    },
    "perfect_week": {
        "type": "perfect_games",
        "target": 2,
        "reward_xp": 50,
        "reward_coins": 12,
        "icon": "💯",
        "title": "Flawless",
        "title_ru": "Безупречность",
        "desc": "Finish 2 games with a perfect score",
        "desc_ru": "Пройди 2 игры с идеальным результатом",
    },
}

WEEKLY_COUNT = 3


def current_week_key(now: datetime | None = None) -> str:
    now = now or datetime.now(timezone.utc)
    iso = now.isocalendar()
    return f"{iso.year}-W{iso.week:02d}"


def week_start(now: datetime | None = None) -> datetime:
    now = now or datetime.now(timezone.utc)
    monday = now - timedelta(days=now.weekday())
    return monday.replace(hour=0, minute=0, second=0, microsecond=0)


def week_challenges(week_key: str | None = None) -> list[dict]:
    """3 челленджа недели, детерминированная ротация по номеру недели."""
    week_key = week_key or current_week_key()
    try:
        _, wk = week_key.rsplit("-W", 1)
        seed = int(wk)
    except (ValueError, IndexError):
        seed = 0
    ids = list(CHALLENGES.keys())
    rotated = ids[seed % len(ids):] + ids[:seed % len(ids)]
    picked = rotated[:WEEKLY_COUNT]
    return [dict(CHALLENGES[cid], id=cid) for cid in picked]
