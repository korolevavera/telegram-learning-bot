from aiogram import F, Router
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery
from sqlalchemy import func, select

from ..content import CARDS, LESSONS
from ..db import SessionLocal
from ..keyboards import progress_keyboard
from ..models import CardState, LessonProgress, QuizResult

router = Router()


def _bar(percent: int) -> str:
    filled = round(percent / 10)
    return "█" * filled + "░" * (10 - filled)


@router.callback_query(F.data == "progress")
async def show_progress(cb: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    user_id = cb.from_user.id

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

    lessons_percent = lessons_done * 100 // len(LESSONS)
    cards_percent = cards_known * 100 // len(CARDS)

    best_text = (
        f"{best_score} баллов (максимум)" if best_score is not None else "пока нет"
    )

    text = (
        "📊 <b>Твой прогресс</b>\n\n"
        f"📚 Уроки: <b>{lessons_done}/{len(LESSONS)}</b> {_bar(lessons_percent)} {lessons_percent}%\n"
        f"🃏 Карточки: <b>{cards_known}/{len(CARDS)}</b> {_bar(cards_percent)} {cards_percent}%\n"
        f"🧪 Тестов пройдено: <b>{quizzes_taken}</b>\n"
        f"🏆 Лучший результат: <b>{best_text}</b>\n\n"
        "Продолжай тренироваться — скоро будешь клатчить как профи!"
    )
    await cb.message.edit_text(text, parse_mode="HTML", reply_markup=progress_keyboard())
    await cb.answer()
