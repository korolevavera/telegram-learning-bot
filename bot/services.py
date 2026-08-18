import json
from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select

from .challenges import week_start
from .content import CARDS, LESSONS
from .db import SessionLocal
from .models import (
    AdminContent,
    CardState,
    ChallengeProgress,
    CurrencyTransaction,
    Favorite,
    Friend,
    LessonProgress,
    MiniGameResult,
    PracticeLog,
    QuizResult,
    TrainingSession,
    UserProfile,
    UserSkill,
)


async def upsert_lesson_progress(user_id: int, lesson_id: str) -> None:
    async with SessionLocal() as session:
        existing = await session.scalar(
            select(LessonProgress).where(
                LessonProgress.user_id == user_id,
                LessonProgress.lesson_id == lesson_id,
            )
        )
        if existing is None:
            session.add(
                LessonProgress(
                    user_id=user_id,
                    lesson_id=lesson_id,
                    completed=True,
                    completed_at=datetime.now(timezone.utc),
                )
            )
        else:
            existing.completed = True
            existing.completed_at = datetime.now(timezone.utc)
        await session.commit()


async def set_card_known(user_id: int, index: int, known: bool) -> None:
    async with SessionLocal() as session:
        row = await session.scalar(
            select(CardState).where(
                CardState.user_id == user_id,
                CardState.card_index == index,
            )
        )
        if row is None:
            session.add(CardState(user_id=user_id, card_index=index, known=known))
        else:
            row.known = known
        await session.commit()


async def get_known_cards(user_id: int) -> set[int]:
    async with SessionLocal() as session:
        rows = await session.scalars(
            select(CardState.card_index).where(
                CardState.user_id == user_id,
                CardState.known.is_(True),
            )
        )
        return set(rows)


async def is_lesson_completed(user_id: int, lesson_id: str) -> bool:
    async with SessionLocal() as session:
        row = await session.scalar(
            select(LessonProgress).where(
                LessonProgress.user_id == user_id,
                LessonProgress.lesson_id == lesson_id,
                LessonProgress.completed.is_(True),
            )
        )
        return row is not None


async def is_quiz_completed(user_id: int, quiz_id: str) -> bool:
    async with SessionLocal() as session:
        count = await session.scalar(
            select(func.count())
            .select_from(QuizResult)
            .where(QuizResult.user_id == user_id, QuizResult.quiz_id == quiz_id)
        )
        return (count or 0) > 0


async def is_card_known(user_id: int, index: int) -> bool:
    async with SessionLocal() as session:
        row = await session.scalar(
            select(CardState).where(
                CardState.user_id == user_id,
                CardState.card_index == index,
            )
        )
        return row is not None and row.known


async def get_practice_attempts(user_id: int, map_id: str, lineup_id: str) -> int:
    async with SessionLocal() as session:
        row = await session.scalar(
            select(PracticeLog).where(
                PracticeLog.user_id == user_id,
                PracticeLog.map_id == map_id,
                PracticeLog.lineup_id == lineup_id,
            )
        )
        return row.attempts if row else 0


async def get_game_submissions_today(user_id: int, game_id: str) -> int:
    now = datetime.now(timezone.utc)
    day_start = (now - timedelta(hours=now.hour)).replace(tzinfo=None)
    async with SessionLocal() as session:
        count = await session.scalar(
            select(func.count())
            .select_from(MiniGameResult)
            .where(
                MiniGameResult.user_id == user_id,
                MiniGameResult.game_id == game_id,
                MiniGameResult.created_at >= day_start,
            )
        )
        return count or 0


async def find_duplicate_game_submit(
    user_id: int, game_id: str, score: int, total: int, duration_ms: int
) -> bool:
    """True, если идентичный результат уже отправлялся менее 30 секунд назад."""
    window_start = (datetime.now(timezone.utc) - timedelta(seconds=30)).replace(tzinfo=None)
    async with SessionLocal() as session:
        row = await session.scalar(
            select(MiniGameResult.id).where(
                MiniGameResult.user_id == user_id,
                MiniGameResult.game_id == game_id,
                MiniGameResult.score == score,
                MiniGameResult.total == total,
                MiniGameResult.duration_ms == duration_ms,
                MiniGameResult.created_at >= window_start,
            )
        )
        return row is not None


async def get_transactions(user_id: int, limit: int = 50) -> list[dict]:
    async with SessionLocal() as session:
        rows = await session.execute(
            select(CurrencyTransaction)
            .where(CurrencyTransaction.user_id == user_id)
            .order_by(CurrencyTransaction.id.desc())
            .limit(limit)
        )
        return [
            {
                "id": t.id,
                "xp_delta": t.xp_delta,
                "coin_delta": t.coin_delta,
                "reason": t.reason,
                "created_at": t.created_at.isoformat() if t.created_at else None,
            }
            for t in rows.scalars()
        ]


async def get_favorites(user_id: int) -> list[dict]:
    async with SessionLocal() as session:
        rows = await session.execute(
            select(Favorite)
            .where(Favorite.user_id == user_id)
            .order_by(Favorite.id.desc())
        )
        return [
            {"item_type": f.item_type, "item_id": f.item_id}
            for f in rows.scalars()
        ]


async def add_favorite(user_id: int, item_type: str, item_id: str) -> dict:
    if not item_type or not item_id or len(item_type) > 32 or len(item_id) > 128:
        return {"ok": False, "error": "invalid item"}
    async with SessionLocal() as session:
        existing = await session.scalar(
            select(Favorite).where(
                Favorite.user_id == user_id,
                Favorite.item_type == item_type,
                Favorite.item_id == item_id,
            )
        )
        if existing is None:
            session.add(Favorite(user_id=user_id, item_type=item_type, item_id=item_id))
            await session.commit()
    return {"ok": True}


async def remove_favorite(user_id: int, item_type: str, item_id: str) -> dict:
    async with SessionLocal() as session:
        row = await session.scalar(
            select(Favorite).where(
                Favorite.user_id == user_id,
                Favorite.item_type == item_type,
                Favorite.item_id == item_id,
            )
        )
        if row is not None:
            await session.delete(row)
            await session.commit()
    return {"ok": True}


async def get_plan_prefs(user_id: int) -> dict:
    async with SessionLocal() as session:
        profile = await session.scalar(
            select(UserProfile).where(UserProfile.user_id == user_id)
        )
        if profile is None:
            return {"training_minutes": 30, "goal": "aim", "role": "rifler", "faceit_level": 0}
        return {
            "training_minutes": profile.training_minutes or 30,
            "goal": profile.goal or "aim",
            "role": profile.role or "rifler",
            "faceit_level": profile.faceit_level or 0,
        }


async def get_user_skills(user_id: int) -> dict[str, int]:
    async with SessionLocal() as session:
        rows = await session.execute(
            select(UserSkill.skill_id, UserSkill.level).where(UserSkill.user_id == user_id)
        )
        return {skill_id: level for skill_id, level in rows}


async def add_skill_points(user_id: int, skill_id: str, points: int) -> int:
    async with SessionLocal() as session:
        row = await session.scalar(
            select(UserSkill).where(
                UserSkill.user_id == user_id,
                UserSkill.skill_id == skill_id,
            )
        )
        if row is None:
            row = UserSkill(user_id=user_id, skill_id=skill_id, level=0)
            session.add(row)
        row.level = min(100, row.level + points)
        await session.commit()
        return row.level


async def get_plan_completed(user_id: int, day_key: str) -> set[str]:
    async with SessionLocal() as session:
        rows = await session.scalars(
            select(TrainingSession.task_id).where(
                TrainingSession.user_id == user_id,
                TrainingSession.day_key == day_key,
                TrainingSession.completed.is_(True),
            )
        )
        return set(rows)


async def complete_plan_task(user_id: int, day_key: str, task_id: str, skill_id: str) -> bool:
    """Отметить задание выполненным. Возвращает True, если это первый раз."""
    async with SessionLocal() as session:
        row = await session.scalar(
            select(TrainingSession).where(
                TrainingSession.user_id == user_id,
                TrainingSession.day_key == day_key,
                TrainingSession.task_id == task_id,
            )
        )
        if row is None:
            session.add(
                TrainingSession(
                    user_id=user_id,
                    day_key=day_key,
                    task_id=task_id,
                    skill_id=skill_id,
                    completed=True,
                    completed_at=datetime.now(timezone.utc),
                )
            )
            await session.commit()
            return True
        if not row.completed:
            row.completed = True
            row.completed_at = datetime.now(timezone.utc)
            await session.commit()
            return True
        return False


async def save_plan_prefs(
    user_id: int,
    training_minutes: int,
    goal: str,
    role: str = "rifler",
    faceit_level: int = 0,
) -> dict:
    if training_minutes not in (15, 30, 45, 60):
        training_minutes = 30
    async with SessionLocal() as session:
        from .gamification import _get_or_create
        profile = await _get_or_create(session, user_id)
        profile.training_minutes = training_minutes
        profile.goal = goal or "aim"
        profile.role = role or "rifler"
        profile.faceit_level = faceit_level
        await session.commit()
        return {
            "training_minutes": profile.training_minutes,
            "goal": profile.goal,
            "role": profile.role,
            "faceit_level": profile.faceit_level,
        }


async def save_quiz_result(user_id: int, quiz_id: str, score: int, total: int) -> None:
    async with SessionLocal() as session:
        session.add(
            QuizResult(
                user_id=user_id,
                quiz_id=quiz_id,
                score=score,
                total=total,
            )
        )
        await session.commit()


async def get_progress(user_id: int) -> dict:
    async with SessionLocal() as session:
        lessons_done = await session.scalar(
            select(func.count())
            .select_from(LessonProgress)
            .where(LessonProgress.user_id == user_id, LessonProgress.completed.is_(True))
        )
        cards_known = await session.scalar(
            select(func.count())
            .select_from(CardState)
            .where(CardState.user_id == user_id, CardState.known.is_(True))
        )
        quizzes_taken = await session.scalar(
            select(func.count())
            .select_from(QuizResult)
            .where(QuizResult.user_id == user_id)
        )
        best_score = await session.scalar(
            select(func.max(QuizResult.score)).where(QuizResult.user_id == user_id)
        )
        done_ids = await session.scalars(
            select(LessonProgress.lesson_id).where(
                LessonProgress.user_id == user_id,
                LessonProgress.completed.is_(True),
            )
        )
        known_indexes = await session.scalars(
            select(CardState.card_index).where(
                CardState.user_id == user_id,
                CardState.known.is_(True),
            )
        )
        quiz_best_rows = await session.execute(
            select(QuizResult.quiz_id, func.max(QuizResult.score))
            .where(QuizResult.user_id == user_id)
            .group_by(QuizResult.quiz_id)
        )
        quizzes_best = {qid: score for qid, score in quiz_best_rows}

    return {
        "lessons_done": lessons_done or 0,
        "lessons_total": len(LESSONS),
        "lessons_done_ids": sorted(done_ids),
        "cards_known": cards_known or 0,
        "cards_total": len(CARDS),
        "cards_known_indexes": sorted(known_indexes),
        "quizzes_taken": quizzes_taken or 0,
        "quizzes_best": quizzes_best,
        "best_score": best_score,
    }


async def get_practice_progress(user_id: int) -> dict:
    async with SessionLocal() as session:
        rows = await session.execute(
            select(PracticeLog.map_id, PracticeLog.lineup_id, PracticeLog.attempts)
            .where(PracticeLog.user_id == user_id)
        )
        progress: dict[str, dict[str, int]] = {}
        for map_id, lineup_id, attempts in rows:
            progress.setdefault(map_id, {})[lineup_id] = attempts
    return progress


async def log_practice(user_id: int, map_id: str, lineup_id: str) -> None:
    async with SessionLocal() as session:
        row = await session.scalar(
            select(PracticeLog).where(
                PracticeLog.user_id == user_id,
                PracticeLog.map_id == map_id,
                PracticeLog.lineup_id == lineup_id,
            )
        )
        if row is None:
            session.add(
                PracticeLog(
                    user_id=user_id,
                    map_id=map_id,
                    lineup_id=lineup_id,
                    attempts=1,
                )
            )
        else:
            row.attempts += 1
        await session.commit()


async def save_mini_game_result(
    user_id: int, game_id: str, score: int, total: int, duration_ms: int = 0
) -> None:
    async with SessionLocal() as session:
        session.add(
            MiniGameResult(
                user_id=user_id,
                game_id=game_id,
                score=score,
                total=total,
                duration_ms=duration_ms,
            )
        )
        await session.commit()


async def get_mini_game_progress(user_id: int) -> dict:
    async with SessionLocal() as session:
        rows = await session.execute(
            select(
                MiniGameResult.game_id,
                func.max(MiniGameResult.score),
                func.count(),
            )
            .where(MiniGameResult.user_id == user_id)
            .group_by(MiniGameResult.game_id)
        )
        best: dict[str, int] = {}
        played: dict[str, int] = {}
        for game_id, max_score, cnt in rows:
            best[game_id] = max_score
            played[game_id] = cnt
    return {"best": best, "played": played}


async def get_leaderboard(user_id: int, limit: int = 20) -> dict:
    async with SessionLocal() as session:
        rows = await session.execute(
            select(
                UserProfile.user_id,
                UserProfile.xp,
                UserProfile.level,
                UserProfile.coins,
                UserProfile.streak,
            )
            .order_by(UserProfile.xp.desc())
            .limit(limit)
        )
        leaders = []
        user_rank = None
        for rank, (uid, xp, level, coins, streak) in enumerate(rows, 1):
            leaders.append({
                "user_id": uid,
                "xp": xp,
                "level": level,
                "coins": coins,
                "streak": streak,
                "rank": rank,
                "is_me": uid == user_id,
            })
            if uid == user_id:
                user_rank = rank

        if user_rank is None:
            me = await session.scalar(
                select(UserProfile).where(UserProfile.user_id == user_id)
            )
            if me:
                count = await session.scalar(
                    select(func.count()).select_from(UserProfile)
                )
                user_rank = (count or 0) + 1

    return {"leaders": leaders, "user_rank": user_rank}


async def get_week_challenge_progress(user_id: int, week_key: str) -> dict[str, int]:
    """Прогресс по типам челленджей за неделю, считается из реальных данных."""
    start = week_start()
    async with SessionLocal() as session:
        games = await session.scalar(
            select(func.count())
            .select_from(MiniGameResult)
            .where(MiniGameResult.user_id == user_id, MiniGameResult.created_at >= start)
        )
        training = await session.scalar(
            select(func.count())
            .select_from(TrainingSession)
            .where(
                TrainingSession.user_id == user_id,
                TrainingSession.completed.is_(True),
                TrainingSession.completed_at >= start,
            )
        )
        xp = await session.scalar(
            select(func.coalesce(func.sum(CurrencyTransaction.xp_delta), 0)).where(
                CurrencyTransaction.user_id == user_id,
                CurrencyTransaction.created_at >= start,
                CurrencyTransaction.xp_delta > 0,
            )
        )
        perfect = await session.scalar(
            select(func.count())
            .select_from(MiniGameResult)
            .where(
                MiniGameResult.user_id == user_id,
                MiniGameResult.created_at >= start,
                MiniGameResult.score >= MiniGameResult.total,
            )
        )
        claimed_rows = await session.execute(
            select(ChallengeProgress.challenge_id).where(
                ChallengeProgress.user_id == user_id,
                ChallengeProgress.week_key == week_key,
                ChallengeProgress.claimed.is_(True),
            )
        )
    return {
        "games_played": games or 0,
        "training_tasks": training or 0,
        "xp_earned": int(xp or 0),
        "perfect_games": perfect or 0,
        "claimed": set(claimed_rows.scalars()),
    }


async def claim_week_challenge(user_id: int, week_key: str, challenge_id: str) -> dict:
    """Выдать награду за выполненный челлендж недели (идемпотентно)."""
    from .challenges import CHALLENGES, week_challenges

    if challenge_id not in CHALLENGES:
        return {"ok": False, "error": "unknown challenge"}
    active = {c["id"] for c in week_challenges(week_key)}
    if challenge_id not in active:
        return {"ok": False, "error": "challenge not active this week"}
    progress = await get_week_challenge_progress(user_id, week_key)
    ch = CHALLENGES[challenge_id]
    if progress[ch["type"]] < ch["target"]:
        return {"ok": False, "error": "not completed"}
    if challenge_id in progress["claimed"]:
        return {"ok": False, "error": "already claimed"}
    async with SessionLocal() as session:
        session.add(
            ChallengeProgress(
                user_id=user_id,
                week_key=week_key,
                challenge_id=challenge_id,
                claimed=True,
            )
        )
        await session.commit()
    from .gamification import award_xp

    profile = await award_xp(user_id, ch["reward_xp"], ch["reward_coins"], reason="challenge")
    return {"ok": True, "profile": profile, "reward_xp": ch["reward_xp"], "reward_coins": ch["reward_coins"]}


async def send_friend_request(user_id: int, friend_id: int) -> dict:
    if friend_id == user_id:
        return {"ok": False, "error": "self request"}
    async with SessionLocal() as session:
        me = await session.scalar(
            select(Friend).where(
                Friend.user_id == user_id, Friend.friend_id == friend_id
            )
        )
        if me is None:
            session.add(
                Friend(user_id=user_id, friend_id=friend_id, status="pending")
            )
            await session.commit()
            return {"ok": True, "status": "pending"}
        if me.status == "pending":
            return {"ok": False, "error": "already sent"}
        return {"ok": False, "error": "already friends"}


async def accept_friend_request(user_id: int, requester_id: int) -> dict:
    async with SessionLocal() as session:
        row = await session.scalar(
            select(Friend).where(
                Friend.user_id == requester_id, Friend.friend_id == user_id
            )
        )
        if row is None:
            row = await session.scalar(
                select(Friend).where(
                    Friend.user_id == user_id, Friend.friend_id == requester_id
                )
            )
            if row is not None and row.status == "pending":
                row.status = "accepted"
                await session.commit()
                return {"ok": True}
            return {"ok": False, "error": "no request"}
        if row.status != "pending":
            return {"ok": False, "error": "not pending"}
        row.status = "accepted"
        await session.commit()
        return {"ok": True}


async def remove_friend(user_id: int, friend_id: int) -> dict:
    async with SessionLocal() as session:
        row = await session.scalar(
            select(Friend).where(
                Friend.user_id == user_id, Friend.friend_id == friend_id
            )
        )
        if row is None:
            row = await session.scalar(
                select(Friend).where(
                    Friend.user_id == friend_id, Friend.friend_id == user_id
                )
            )
        if row is not None:
            await session.delete(row)
            await session.commit()
    return {"ok": True}


async def get_friends_data(user_id: int) -> dict:
    """Друзья (accepted) + входящие запросы с профилями и рангами."""
    async with SessionLocal() as session:
        pairs = await session.execute(
            select(Friend.user_id, Friend.friend_id)
            .where(
                (Friend.user_id == user_id) | (Friend.friend_id == user_id),
                Friend.status == "accepted",
            )
        )
        friend_ids = set()
        for uid, fid in pairs:
            friend_ids.add(uid if fid == user_id else fid)
        requests_rows = await session.execute(
            select(Friend.user_id).where(
                Friend.friend_id == user_id, Friend.status == "pending"
            )
        )
        requester_ids = list(requests_rows.scalars())

        async def _fmt(fid: int) -> dict:
            p = await session.scalar(
                select(UserProfile).where(UserProfile.user_id == fid)
            )
            if p is None:
                return {
                    "user_id": fid,
                    "name": f"Player {fid}",
                    "xp": 0,
                    "level": 1,
                    "coins": 0,
                }
            return {
                "user_id": fid,
                "name": p.faceit_name or f"Player {fid}",
                "xp": p.xp,
                "level": p.level,
                "coins": p.coins,
            }

        friends = []
        for fid in friend_ids:
            friends.append(await _fmt(fid))
        friends.sort(key=lambda f: f["xp"], reverse=True)
        requests = []
        for rid in requester_ids:
            requests.append(await _fmt(rid))
    return {"friends": friends, "requests": requests}


_ADMIN_CONTENT_CACHE: dict[str, dict[str, dict]] | None = None


def reset_admin_cache() -> None:
    """Reset admin content cache so it gets reloaded on next access."""
    global _ADMIN_CONTENT_CACHE
    _ADMIN_CONTENT_CACHE = None


def get_cached_overrides(content_type: str) -> dict[str, dict]:
    """Синхронное чтение кеша оверрайдов (для sync-контекстов, напр. get_lineups)."""
    if _ADMIN_CONTENT_CACHE is None:
        return {}
    return _ADMIN_CONTENT_CACHE.get(content_type, {})


async def refresh_admin_content_cache() -> None:
    global _ADMIN_CONTENT_CACHE
    try:
        async with SessionLocal() as session:
            rows = await session.execute(
                select(AdminContent.content_type, AdminContent.content_key, AdminContent.payload)
            )
            cache: dict[str, dict[str, dict]] = {}
            for content_type, key, payload in rows:
                try:
                    cache.setdefault(content_type, {})[key] = json.loads(payload)
                except (TypeError, ValueError):
                    cache.setdefault(content_type, {})[key] = {}
        _ADMIN_CONTENT_CACHE = cache
    except Exception:
        _ADMIN_CONTENT_CACHE = {}


async def get_content_overrides(content_type: str) -> dict[str, dict]:
    """Все переопределения контента типа: key -> payload dict."""
    if _ADMIN_CONTENT_CACHE is None:
        await refresh_admin_content_cache()
    return get_cached_overrides(content_type)


async def save_content_override(content_type: str, key: str, payload: dict) -> dict:
    if not content_type or not key or len(content_type) > 32 or len(key) > 128:
        return {"ok": False, "error": "invalid key"}
    async with SessionLocal() as session:
        row = await session.scalar(
            select(AdminContent).where(
                AdminContent.content_type == content_type,
                AdminContent.content_key == key,
            )
        )
        text = json.dumps(payload, ensure_ascii=False)[:4096]
        if row is None:
            session.add(AdminContent(content_type=content_type, content_key=key, payload=text))
        else:
            row.payload = text
        await session.commit()
    await refresh_admin_content_cache()
    return {"ok": True}


async def delete_content_override(content_type: str, key: str) -> dict:
    async with SessionLocal() as session:
        row = await session.scalar(
            select(AdminContent).where(
                AdminContent.content_type == content_type,
                AdminContent.content_key == key,
            )
        )
        if row is not None:
            await session.delete(row)
            await session.commit()
    await refresh_admin_content_cache()
    return {"ok": True}
