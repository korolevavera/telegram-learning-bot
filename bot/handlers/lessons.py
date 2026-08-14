from aiogram import F, Router
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, Message

from ..content import LESSONS
from ..keyboards import lesson_actions_keyboard, lessons_keyboard
from ..services import upsert_lesson_progress
from ..states import LessonState

router = Router()


def _get_lesson(lesson_id: str) -> dict | None:
    return next((lesson for lesson in LESSONS if lesson["id"] == lesson_id), None)


def _normalize(text: str) -> str:
    return " ".join(text.lower().split())


def _is_correct(reply: str, answer: str) -> bool:
    r = _normalize(reply)
    a = _normalize(answer)
    return r == a or a in r or r in a


@router.callback_query(F.data == "lessons")
async def show_lessons(cb: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await cb.message.edit_text("📚 Выбери урок:", reply_markup=lessons_keyboard())
    await cb.answer()


async def _show_section(message: Message, lesson: dict, section_index: int) -> None:
    await message.answer(
        f"📖 <b>{lesson['title']}</b>\n\n{lesson['sections'][section_index]}",
        parse_mode="HTML",
        reply_markup=lesson_actions_keyboard(lesson["id"]),
    )


async def _ask_question(message: Message, lesson: dict, q_index: int) -> None:
    questions = lesson["questions"]
    question = questions[q_index]
    await message.answer(
        f"❓ Вопрос {q_index + 1}/{len(questions)}:\n\n"
        f"{question['q']}\n\n<i>Напиши ответ текстом.</i>",
        parse_mode="HTML",
    )


async def _finish_lesson(message: Message, lesson_id: str) -> None:
    await upsert_lesson_progress(message.from_user.id, lesson_id)

    await message.answer(
        "🎉 Урок завершён! Отлично поработал.\n\n"
        "Возвращайся, чтобы повторить, или выбери следующий урок:",
        reply_markup=lessons_keyboard(),
    )


@router.callback_query(F.data.startswith("lesson:"))
async def start_lesson(cb: CallbackQuery, state: FSMContext) -> None:
    lesson_id = cb.data.split(":", 1)[1]
    lesson = _get_lesson(lesson_id)
    if lesson is None:
        await cb.answer("Урок не найден", show_alert=True)
        return

    await state.set_state(LessonState.section_index)
    await state.update_data(lesson_id=lesson_id, section_index=0)
    await _show_section(cb.message, lesson, 0)
    await cb.answer()


@router.callback_query(LessonState.section_index, F.data.startswith("lesson_next:"))
async def lesson_next(cb: CallbackQuery, state: FSMContext) -> None:
    data = await state.get_data()
    lesson = _get_lesson(data["lesson_id"])
    if lesson is None:
        await cb.answer("Урок не найден", show_alert=True)
        return

    section_index = data["section_index"] + 1
    await state.update_data(section_index=section_index)

    if section_index < len(lesson["sections"]):
        await _show_section(cb.message, lesson, section_index)
    else:
        questions = lesson["questions"]
        if not questions:
            await state.clear()
            await _finish_lesson(cb.message, lesson["id"])
        else:
            await state.set_state(LessonState.question_index)
            await state.update_data(question_index=0)
            await _ask_question(cb.message, lesson, 0)
    await cb.answer()


@router.message(LessonState.question_index)
async def answer_question(message: Message, state: FSMContext) -> None:
    data = await state.get_data()
    lesson = _get_lesson(data["lesson_id"])
    if lesson is None:
        await state.clear()
        return

    q_index = data["question_index"]
    question = lesson["questions"][q_index]

    if _is_correct(message.text or "", question["a"]):
        reply = "✅ Верно!"
    else:
        reply = f"❌ Не совсем. Правильный ответ: <b>{question['a']}</b>"

    next_index = q_index + 1
    if next_index < len(lesson["questions"]):
        await state.update_data(question_index=next_index)
        await message.answer(reply, parse_mode="HTML")
        await _ask_question(message, lesson, next_index)
    else:
        await state.clear()
        await message.answer(reply, parse_mode="HTML")
        await _finish_lesson(message, lesson["id"])
