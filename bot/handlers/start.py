from aiogram import F, Router
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, Message

from ..db import SessionLocal
from ..keyboards import main_menu_keyboard
from ..models import User

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message) -> None:
    async with SessionLocal() as session:
        user = await session.get(User, message.from_user.id)
        if user is None:
            session.add(
                User(
                    id=message.from_user.id,
                    username=message.from_user.username,
                    first_name=message.from_user.first_name or "",
                )
            )
            await session.commit()

    name = message.from_user.first_name or "друг"
    await message.answer(
        f"👋 Привет, {name}!\n\n"
        "Я помогу тебе прокачаться в Counter-Strike 2. Выбирай, что хочешь делать:",
        reply_markup=main_menu_keyboard(),
    )


@router.callback_query(F.data == "menu")
async def back_to_menu(cb: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await cb.message.edit_text("🏠 Главное меню:", reply_markup=main_menu_keyboard())
    await cb.answer()
