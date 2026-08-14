from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

from .config_loader import CONFIG
from .content import CARDS, LESSONS, QUIZZES


def main_menu_keyboard() -> InlineKeyboardMarkup:
    rows = [
        [InlineKeyboardButton(text="🌸 Уроки", callback_data="lessons")],
        [InlineKeyboardButton(text="🩷 Карточки", callback_data="cards")],
        [InlineKeyboardButton(text="💖 Тесты", callback_data="quizzes")],
        [InlineKeyboardButton(text="📊 Прогресс", callback_data="progress")],
    ]
    if CONFIG.webapp_url:
        rows.append(
            [
                InlineKeyboardButton(
                    text="🎮 Открыть приложение",
                    web_app=WebAppInfo(url=CONFIG.webapp_url),
                )
            ]
        )
    return InlineKeyboardMarkup(inline_keyboard=rows)


def lessons_keyboard() -> InlineKeyboardMarkup:
    rows = [
        [InlineKeyboardButton(text="🌸 " + lesson["title"], callback_data=f"lesson:{lesson['id']}")]
        for lesson in LESSONS
    ]
    rows.append([InlineKeyboardButton(text="🩷 Назад", callback_data="menu")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def quizzes_keyboard() -> InlineKeyboardMarkup:
    rows = [
        [InlineKeyboardButton(text="💖 " + quiz["title"], callback_data=f"quiz:{quiz['id']}")]
        for quiz in QUIZZES
    ]
    rows.append([InlineKeyboardButton(text="🩷 Назад", callback_data="menu")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def lesson_actions_keyboard(lesson_id: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="➡️ Дальше", callback_data=f"lesson_next:{lesson_id}")],
            [
                InlineKeyboardButton(text="🔄 Заново", callback_data=f"lesson:{lesson_id}"),
                InlineKeyboardButton(text="⬅️ К урокам", callback_data="lessons"),
            ],
            [InlineKeyboardButton(text="🏠 Меню", callback_data="menu")],
        ]
    )


def cards_keyboard(card_index: int, total: int) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="💡 Показать ответ", callback_data=f"card_flip:{card_index}")],
            [
                InlineKeyboardButton(text="✅ Знаю", callback_data=f"card_known:{card_index}"),
                InlineKeyboardButton(text="❌ Не знаю", callback_data=f"card_unknown:{card_index}"),
            ],
            [InlineKeyboardButton(text="🏠 Меню", callback_data="menu")],
        ]
    )


def card_answer_keyboard(card_index: int, total: int) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="✅ Знаю", callback_data=f"card_known:{card_index}"),
                InlineKeyboardButton(text="❌ Не знаю", callback_data=f"card_unknown:{card_index}"),
            ],
            [InlineKeyboardButton(text="🏠 Меню", callback_data="menu")],
        ]
    )


def quiz_question_keyboard(quiz_id: str, question_index: int, options: list[str]) -> InlineKeyboardMarkup:
    rows = [
        [
            InlineKeyboardButton(
                text=option,
                callback_data=f"quiz_answer:{quiz_id}:{question_index}:{i}",
            )
        ]
        for i, option in enumerate(options)
    ]
    rows.append([InlineKeyboardButton(text="🏠 Меню", callback_data="menu")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def progress_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🏠 Меню", callback_data="menu")],
        ]
    )
