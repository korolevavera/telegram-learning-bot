"""Gamification: XP, coins, levels, streaks, achievements."""

import json
from datetime import datetime, timezone, timedelta

from sqlalchemy import select

from .db import SessionLocal
from .models import CurrencyTransaction, UserProfile

# XP rewards for various actions
XP_LESSON = 25
XP_QUIZ_PASS = 15
XP_QUIZ_PERFECT = 30
XP_CARD_BATCH = 10
XP_GAME_PLAY = 10
XP_GAME_PERFECT = 25
XP_PRACTICE = 5
XP_FIRST_DAILY = 20

COIN_LESSON = 5
COIN_QUIZ_PASS = 3
COIN_QUIZ_PERFECT = 8
COIN_GAME_PLAY = 3
COIN_GAME_PERFECT = 7
COIN_DAILY_STREAK = 2
COIN_PRACTICE = 0

# Защита от фарма мини-игр: награда — только за первые N сабмитов в день на игру
GAME_DAILY_REWARD_CAP = 3

# Level curve: XP needed = level * 100
def xp_for_level(level: int) -> int:
    return level * 100

# Achievements
ACHIEVEMENTS = {
    "first_lesson": {"name": "First Steps", "name_ru": "Первые шаги", "icon": "📖", "desc": "Complete your first lesson", "desc_ru": "Пройди первый урок"},
    "all_lessons": {"name": "Scholar", "name_ru": "Учёный", "icon": "🎓", "desc": "Complete all lessons", "desc_ru": "Пройди все уроки"},
    "first_quiz": {"name": "Quiz Tamer", "name_ru": "Укротитель тестов", "icon": "🧪", "desc": "Pass your first quiz", "desc_ru": "Пройди первый тест"},
    "perfect_quiz": {"name": "Perfect Score", "name_ru": "Идеальный счёт", "icon": "💯", "desc": "Get a perfect quiz score", "desc_ru": "Набери 100% в тесте"},
    "first_card": {"name": "Card Collector", "name_ru": "Коллекционер", "icon": "🃏", "desc": "Learn your first flashcard", "desc_ru": "Выучи первую карточку"},
    "all_cards": {"name": "Walking Wiki", "name_ru": "Ходячая вики", "icon": "📚", "desc": "Learn all flashcards", "desc_ru": "Выучи все карточки"},
    "first_game": {"name": "Gamer", "name_ru": "Геймер", "icon": "🎮", "desc": "Play your first mini-game", "desc_ru": "Сыграй первую мини-игру"},
    "streak_3": {"name": "On Fire", "name_ru": "В ударе", "icon": "🔥", "desc": "3-day streak", "desc_ru": "Стрик 3 дня"},
    "streak_7": {"name": "Unstoppable", "name_ru": "Неостановимый", "icon": "⚡", "desc": "7-day streak", "desc_ru": "Стрик 7 дней"},
    "streak_30": {"name": "Legend", "name_ru": "Легенда", "icon": "👑", "desc": "30-day streak", "desc_ru": "Стрик 30 дней"},
    "level_5": {"name": "Rising Star", "name_ru": "Восходящая звезда", "icon": "⭐", "desc": "Reach level 5", "desc_ru": "Достигни 5 уровня"},
    "level_10": {"name": "Veteran", "name_ru": "Ветеран", "icon": "🌟", "desc": "Reach level 10", "desc_ru": "Достигни 10 уровня"},
    "level_25": {"name": "Master", "name_ru": "Мастер", "icon": "🏆", "desc": "Reach level 25", "desc_ru": "Достигни 25 уровня"},
    "practice_10": {"name": "Practitioner", "name_ru": "Практик", "icon": "🎯", "desc": "Practice 10 lineups", "desc_ru": "Отработай 10 раскидок"},
    "xp_1000": {"name": "XP Hunter", "name_ru": "Охотник за XP", "icon": "🏹", "desc": "Earn 1000 XP total", "desc_ru": "Набери 1000 XP"},
}


async def get_profile(user_id: int) -> dict:
    async with SessionLocal() as session:
        profile = await session.scalar(
            select(UserProfile).where(UserProfile.user_id == user_id)
        )
        if profile is None:
            return {"xp": 0, "coins": 0, "level": 1, "streak": 0, "achievements": [], "inventory": [], "equipped_title": "", "equipped_avatar": "", "equipped_badge": "", "faceit_id": "", "faceit_name": "", "faceit_level": 0, "faceit_elo": 0}
        return {
            "xp": profile.xp,
            "coins": profile.coins,
            "level": profile.level,
            "streak": profile.streak,
            "achievements": json.loads(profile.achievements) if profile.achievements else [],
            "inventory": json.loads(profile.inventory) if profile.inventory else [],
            "equipped_title": profile.equipped_title or "",
            "equipped_avatar": profile.equipped_avatar or "",
            "equipped_badge": profile.equipped_badge or "",
            "faceit_id": profile.faceit_id or "",
            "faceit_name": profile.faceit_name or "",
            "faceit_level": profile.faceit_level or 0,
            "faceit_elo": profile.faceit_elo or 0,
        }


async def _get_or_create(session, user_id: int) -> UserProfile:
    profile = await session.scalar(
        select(UserProfile).where(UserProfile.user_id == user_id)
    )
    if profile is None:
        profile = UserProfile(
            user_id=user_id,
            xp=0,
            coins=0,
            level=1,
            streak=0,
            achievements="[]",
        )
        session.add(profile)
        await session.flush()
    return profile


def _update_streak(profile: UserProfile) -> int:
    now = datetime.now(timezone.utc)
    if profile.last_active is None:
        profile.streak = 1
    else:
        last = profile.last_active
        if last.tzinfo is None:
            last = last.replace(tzinfo=timezone.utc)
        diff = (now - last).total_seconds()
        if diff < 86400 * 1.5:
            if diff >= 86400 * 0.5:
                profile.streak += 1
        else:
            profile.streak = 1
    profile.last_active = now
    return profile.streak


def _recalc_level(profile: UserProfile) -> None:
    total_xp = profile.xp
    lvl = 1
    while total_xp >= xp_for_level(lvl):
        total_xp -= xp_for_level(lvl)
        lvl += 1
    profile.level = lvl


def _add_achievement(profile: UserProfile, ach_id: str) -> bool:
    current = json.loads(profile.achievements) if profile.achievements else []
    if ach_id in current:
        return False
    current.append(ach_id)
    profile.achievements = json.dumps(current)
    return True


async def award_xp(user_id: int, xp_amount: int, coins: int = 0, reason: str = "") -> dict:
    """Award XP and coins, update level, write ledger entry. Return new profile."""
    async with SessionLocal() as session:
        profile = await _get_or_create(session, user_id)
        _update_streak(profile)
        profile.xp += xp_amount
        profile.coins += coins
        _recalc_level(profile)
        new_achievements = []

        session.add(
            CurrencyTransaction(
                user_id=user_id,
                xp_delta=xp_amount,
                coin_delta=coins,
                reason=reason or "action",
            )
        )

        # Check streak achievements
        if profile.streak >= 3:
            if _add_achievement(profile, "streak_3"):
                new_achievements.append("streak_3")
        if profile.streak >= 7:
            if _add_achievement(profile, "streak_7"):
                new_achievements.append("streak_7")
        if profile.streak >= 30:
            if _add_achievement(profile, "streak_30"):
                new_achievements.append("streak_30")

        # Level achievements
        for lvl_ach, lvl_req in [("level_5", 5), ("level_10", 10), ("level_25", 25)]:
            if profile.level >= lvl_req:
                if _add_achievement(profile, lvl_ach):
                    new_achievements.append(lvl_ach)

        # XP achievements
        if profile.xp >= 1000:
            if _add_achievement(profile, "xp_1000"):
                new_achievements.append("xp_1000")

        await session.commit()
        return {
            "xp": profile.xp,
            "coins": profile.coins,
            "level": profile.level,
            "streak": profile.streak,
            "achievements": json.loads(profile.achievements),
            "new_achievements": new_achievements,
        }


async def add_achievement(user_id: int, ach_id: str) -> dict:
    async with SessionLocal() as session:
        profile = await _get_or_create(session, user_id)
        new = _add_achievement(profile, ach_id)
        await session.commit()
        return {"added": new}


async def get_achievements_catalog() -> dict:
    return ACHIEVEMENTS


async def award_practice(user_id: int) -> dict:
    return await award_xp(user_id, XP_PRACTICE, COIN_PRACTICE, reason="practice")


async def award_lesson(user_id: int) -> dict:
    result = await award_xp(user_id, XP_LESSON, COIN_LESSON, reason="lesson")
    ach = await add_achievement(user_id, "first_lesson")
    if ach.get("added"):
        result.setdefault("new_achievements", []).append("first_lesson")
    return result


async def award_quiz(user_id: int, score: int, total: int) -> dict:
    perfect = score >= total
    xp = XP_QUIZ_PERFECT if perfect else XP_QUIZ_PASS
    coins = COIN_QUIZ_PERFECT if perfect else COIN_QUIZ_PASS
    result = await award_xp(user_id, xp, coins, reason="quiz")
    ach1 = await add_achievement(user_id, "first_quiz")
    if ach1.get("added"):
        result.setdefault("new_achievements", []).append("first_quiz")
    if perfect:
        ach2 = await add_achievement(user_id, "perfect_quiz")
        if ach2.get("added"):
            result.setdefault("new_achievements", []).append("perfect_quiz")
    return result


async def award_card(user_id: int) -> dict:
    return await award_xp(user_id, XP_CARD_BATCH, 0, reason="card")


async def award_game(user_id: int, perfect: bool = False, rewarded: bool = True) -> dict:
    if not rewarded:
        return await get_profile(user_id)
    xp = XP_GAME_PERFECT if perfect else XP_GAME_PLAY
    coins = COIN_GAME_PERFECT if perfect else COIN_GAME_PLAY
    result = await award_xp(user_id, xp, coins, reason="game")
    ach = await add_achievement(user_id, "first_game")
    if ach.get("added"):
        result.setdefault("new_achievements", []).append("first_game")
    return result


async def award_training(user_id: int) -> dict:
    from .skills import COIN_TRAINING, XP_TRAINING
    return await award_xp(user_id, XP_TRAINING, COIN_TRAINING, reason="training")
