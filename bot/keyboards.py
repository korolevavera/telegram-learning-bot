from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

from .config_loader import CONFIG
from .content import CARDS, LESSONS, LINEUP_TYPES, MAPS, QUIZZES
from .lineups_loader import get_lineups
from .version import APP_VERSION

LINEUPS = get_lineups()


def _app_url() -> str:
    url = CONFIG.webapp_url
    if not url:
        return ""
    sep = "&" if "?" in url else "?"
    return f"{url}{sep}v={APP_VERSION}"


def main_menu_keyboard() -> InlineKeyboardMarkup:
    rows = [
        [InlineKeyboardButton(text="🌸 Уроки", callback_data="lessons")],
        [InlineKeyboardButton(text="🩷 Карточки", callback_data="cards")],
        [InlineKeyboardButton(text="💖 Тесты", callback_data="quizzes")],
        [InlineKeyboardButton(text="🧭 Гайды", callback_data="guides")],
        [InlineKeyboardButton(text="📊 Прогресс", callback_data="progress")],
    ]
    if CONFIG.webapp_url:
        rows.append(
            [
                InlineKeyboardButton(
                    text="🎮 Открыть приложение",
                    web_app=WebAppInfo(url=_app_url()),
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


def guides_keyboard() -> InlineKeyboardMarkup:
    rows = [
        [
            InlineKeyboardButton(
                text=f"{m['emoji']} {m['name']}",
                callback_data=f"guide_map:{m['id']}",
            )
        ]
        for m in MAPS
    ]
    rows.append([InlineKeyboardButton(text="🏠 Меню", callback_data="menu")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def _lineup_button(map_id: str, lineup: dict) -> InlineKeyboardButton:
    type_info = LINEUP_TYPES.get(lineup.get("type", ""), {})
    emoji = type_info.get("emoji", "🧨")
    return InlineKeyboardButton(
        text=f"{emoji} {lineup['title']}",
        callback_data=f"guide_lineup:{map_id}:{lineup['id']}",
    )


def guide_lineups_keyboard(map_id: str) -> InlineKeyboardMarkup:
    rows = [[_lineup_button(map_id, lineup)] for lineup in LINEUPS.get(map_id, [])]
    rows.append([InlineKeyboardButton(text="⬅️ К картам", callback_data="guides")])
    rows.append([InlineKeyboardButton(text="🏠 Меню", callback_data="menu")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def guide_back_keyboard(map_id: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="⬅️ Назад", callback_data=f"guide_lineups:{map_id}")],
            [InlineKeyboardButton(text="🏠 Меню", callback_data="menu")],
        ]
    )
