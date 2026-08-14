from aiogram import F, Router
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery

from ..content import QUIZZES
from ..keyboards import quiz_question_keyboard, quizzes_keyboard
from ..services import save_quiz_result
from ..states import QuizState

router = Router()


def _get_quiz(quiz_id: str) -> dict | None:
    return next((quiz for quiz in QUIZZES if quiz["id"] == quiz_id), None)


@router.callback_query(F.data == "quizzes")
async def show_quizzes(cb: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await cb.message.edit_text("🧪 Выбери тест:", reply_markup=quizzes_keyboard())
    await cb.answer()


async def _show_question(cb: CallbackQuery, quiz: dict, q_index: int) -> None:
    question = quiz["questions"][q_index]
    await cb.message.edit_text(
        f"🧪 <b>{quiz['title']}</b>\n\n"
        f"Вопрос {q_index + 1}/{len(quiz['questions'])}:\n\n{question['q']}",
        parse_mode="HTML",
        reply_markup=quiz_question_keyboard(quiz["id"], q_index, question["options"]),
    )


@router.callback_query(F.data.startswith("quiz:"))
async def start_quiz(cb: CallbackQuery, state: FSMContext) -> None:
    quiz_id = cb.data.split(":", 1)[1]
    quiz = _get_quiz(quiz_id)
    if quiz is None:
        await cb.answer("Тест не найден", show_alert=True)
        return

    await state.set_state(QuizState.question_index)
    await state.update_data(quiz_id=quiz_id, question_index=0, score=0)
    await _show_question(cb, quiz, 0)
    await cb.answer()


@router.callback_query(QuizState.question_index, F.data.startswith("quiz_answer:"))
async def quiz_answer(cb: CallbackQuery, state: FSMContext) -> None:
    _, quiz_id, q_index, chosen = cb.data.split(":")
    q_index = int(q_index)
    chosen = int(chosen)

    data = await state.get_data()
    quiz = _get_quiz(quiz_id)
    if quiz is None:
        await cb.answer("Тест не найден", show_alert=True)
        return

    question = quiz["questions"][q_index]
    correct = question["answer"] == chosen
    score = data["score"] + (1 if correct else 0)

    feedback = (
        "✅ Верно!"
        if correct
        else f"❌ Неверно. Правильный ответ: <b>{question['options'][question['answer']]}</b>"
    )

    next_index = q_index + 1
    if next_index < len(quiz["questions"]):
        await state.update_data(question_index=next_index, score=score)
        await cb.message.edit_text(feedback, parse_mode="HTML")
        await cb.answer()
        await _show_question(cb, quiz, next_index)
        return

    await state.clear()

    await save_quiz_result(cb.from_user.id, quiz_id, score, len(quiz["questions"]))

    percent = score * 100 // len(quiz["questions"])
    emoji = "🏆" if percent >= 80 else "👍" if percent >= 50 else "💪"
    await cb.message.edit_text(
        f"{emoji} <b>{quiz['title']}</b> завершён!\n\n"
        f"Твой результат: <b>{score}/{len(quiz['questions'])}</b> ({percent}%)\n\n"
        "Выбирай следующий тест или возвращайся в меню:",
        parse_mode="HTML",
        reply_markup=quizzes_keyboard(),
    )
    await cb.answer()
