from aiogram import F, Router
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery

from ..keyboards import progress_keyboard
from ..services import get_progress

router = Router()


def _bar(percent: int) -> str:
    filled = round(percent / 10)
    return "█" * filled + "░" * (10 - filled)


@router.callback_query(F.data == "progress")
async def show_progress(cb: CallbackQuery, state: FSMContext) -> None:
    await state.clear()

    progress = await get_progress(cb.from_user.id)

    lessons_percent = progress["lessons_done"] * 100 // progress["lessons_total"]
    cards_percent = progress["cards_known"] * 100 // progress["cards_total"]

    best_text = (
        f"{progress['best_score']} баллов (максимум)"
        if progress["best_score"] is not None
        else "пока нет"
    )

    text = (
        "📊 <b>Твой прогресс</b>\n\n"
        f"📚 Уроки: <b>{progress['lessons_done']}/{progress['lessons_total']}</b> "
        f"{_bar(lessons_percent)} {lessons_percent}%\n"
        f"🃏 Карточки: <b>{progress['cards_known']}/{progress['cards_total']}</b> "
        f"{_bar(cards_percent)} {cards_percent}%\n"
        f"🧪 Тестов пройдено: <b>{progress['quizzes_taken']}</b>\n"
        f"🏆 Лучший результат: <b>{best_text}</b>\n\n"
        "Продолжай тренироваться — скоро будешь клатчить как профи!"
    )
    await cb.message.edit_text(text, parse_mode="HTML", reply_markup=progress_keyboard())
    await cb.answer()
