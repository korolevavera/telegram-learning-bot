from datetime import datetime, timezone

from sqlalchemy import func, select

from .content import CARDS, LESSONS
from .db import SessionLocal
from .models import CardState, LessonProgress, QuizResult


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

    return {
        "lessons_done": lessons_done or 0,
        "lessons_total": len(LESSONS),
        "cards_known": cards_known or 0,
        "cards_total": len(CARDS),
        "quizzes_taken": quizzes_taken or 0,
        "best_score": best_score,
    }
