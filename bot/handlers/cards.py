from aiogram import F, Router
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery

from ..content import CARDS
from ..keyboards import card_answer_keyboard, cards_keyboard, main_menu_keyboard
from ..services import get_known_cards, set_card_known
from ..states import CardState as CardStateGroup

router = Router()


def _next_unknown(known: set[int], start: int) -> int | None:
    total = len(CARDS)
    for step in range(total):
        idx = (start + 1 + step) % total
        if idx not in known:
            return idx
    return None


@router.callback_query(F.data == "cards")
async def start_cards(cb: CallbackQuery, state: FSMContext) -> None:
    known = await get_known_cards(cb.from_user.id)

    if len(known) >= len(CARDS):
        await state.clear()
        await cb.message.edit_text(
            "🎉 Поздравляю! Все карточки выучены!\n\n"
            "Возвращайся позже, чтобы повторить.",
            reply_markup=main_menu_keyboard(),
        )
        await cb.answer()
        return

    index = 0
    while index in known:
        index += 1

    await state.set_state(CardStateGroup.index)
    await state.update_data(index=index)

    card = CARDS[index]
    await cb.message.edit_text(
        f"🃏 Карточка {index + 1}/{len(CARDS)}:\n\n<b>{card['front']}</b>",
        parse_mode="HTML",
        reply_markup=cards_keyboard(index, len(CARDS)),
    )
    await cb.answer()


@router.callback_query(CardStateGroup.index, F.data.startswith("card_flip:"))
async def card_flip(cb: CallbackQuery) -> None:
    index = int(cb.data.split(":", 1)[1])
    card = CARDS[index]
    await cb.message.edit_text(
        f"🃏 Карточка {index + 1}/{len(CARDS)}:\n\n"
        f"<b>{card['front']}</b>\n\n"
        f"💡 Ответ: <b>{card['back']}</b>",
        parse_mode="HTML",
        reply_markup=card_answer_keyboard(index, len(CARDS)),
    )
    await cb.answer()


async def _set_known(cb: CallbackQuery, state: FSMContext, known: bool) -> None:
    index = int(cb.data.split(":", 1)[1])

    await set_card_known(cb.from_user.id, index, known)
    known_set = await get_known_cards(cb.from_user.id)

    next_index = _next_unknown(known_set, index)
    if next_index is None:
        await state.clear()
        await cb.message.edit_text(
            "🎉 Поздравляю! Все карточки выучены!\n\n"
            "Возвращайся позже, чтобы повторить.",
            reply_markup=main_menu_keyboard(),
        )
        await cb.answer()
        return

    await state.update_data(index=next_index)
    card = CARDS[next_index]
    await cb.message.edit_text(
        f"🃏 Карточка {next_index + 1}/{len(CARDS)}:\n\n<b>{card['front']}</b>",
        parse_mode="HTML",
        reply_markup=cards_keyboard(next_index, len(CARDS)),
    )
    await cb.answer()


@router.callback_query(CardStateGroup.index, F.data.startswith("card_known:"))
async def card_known(cb: CallbackQuery, state: FSMContext) -> None:
    await _set_known(cb, state, True)


@router.callback_query(CardStateGroup.index, F.data.startswith("card_unknown:"))
async def card_unknown(cb: CallbackQuery, state: FSMContext) -> None:
    await _set_known(cb, state, False)
