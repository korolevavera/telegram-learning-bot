from aiogram import F, Router
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery

from ..content import LINEUP_TYPES, MAPS, TACTICS
from ..keyboards import (
    guide_back_keyboard,
    guide_lineups_keyboard,
    guide_tactics_keyboard,
    guides_keyboard,
    map_actions_keyboard,
)
from ..lineups_loader import get_lineups
from ..video_player import send_lineup_video

LINEUPS = get_lineups()
router = Router()


def _get_map(map_id: str) -> dict | None:
    return next((m for m in MAPS if m["id"] == map_id), None)


def _get_lineup(map_id: str, lineup_id: str) -> dict | None:
    return next((l for l in LINEUPS.get(map_id, []) if l["id"] == lineup_id), None)


def _get_tactic(map_id: str, tactic_id: str) -> dict | None:
    return next((t for t in TACTICS.get(map_id, []) if t["id"] == tactic_id), None)


def _lineup_badge(lineup: dict) -> str:
    type_info = LINEUP_TYPES.get(lineup.get("type", ""), {})
    emoji = type_info.get("emoji", "🧨")
    label = type_info.get("label", lineup.get("type", "Раскидка"))
    return f"{emoji} {label}"


def _steps_text(steps: list[str]) -> str:
    return "\n".join(f"{i + 1}. {step}" for i, step in enumerate(steps))


@router.callback_query(F.data == "guides")
async def show_guides(cb: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await cb.message.edit_text("🧭 <b>Гайды</b>\n\nВыбери карту, чтобы посмотреть раскидки:", parse_mode="HTML", reply_markup=guides_keyboard())
    await cb.answer()


@router.callback_query(F.data.startswith("guide_map:"))
async def show_map(cb: CallbackQuery) -> None:
    map_id = cb.data.split(":", 1)[1]
    map_data = _get_map(map_id)
    if map_data is None:
        await cb.answer("Карта не найдена", show_alert=True)
        return

    lineups_count = len(LINEUPS.get(map_id, []))
    tactics_count = len(TACTICS.get(map_id, []))

    text = (
        f"🧭 <b>{map_data['emoji']} {map_data['name']}</b>\n\n"
        f"Раскидок на карте: <b>{lineups_count}</b>\n"
        f"Тактик: <b>{tactics_count}</b>\n\n"
        "Выбери категорию:"
    )
    await cb.message.edit_text(text, parse_mode="HTML", reply_markup=map_actions_keyboard(map_id))
    await cb.answer()


@router.callback_query(F.data.startswith("guide_lineups:"))
async def show_lineups(cb: CallbackQuery) -> None:
    map_id = cb.data.split(":", 1)[1]
    map_data = _get_map(map_id)
    if map_data is None:
        await cb.answer("Карта не найдена", show_alert=True)
        return

    lineups = LINEUPS.get(map_id, [])
    if not lineups:
        await cb.answer("На этой карте пока нет раскидок", show_alert=True)
        return

    await cb.message.edit_text(
        f"🧨 <b>Раскидки · {map_data['name']}</b>\n\nВыбери раскидку:",
        parse_mode="HTML",
        reply_markup=guide_lineups_keyboard(map_id),
    )
    await cb.answer()


@router.callback_query(F.data.startswith("guide_lineup:"))
async def show_lineup(cb: CallbackQuery) -> None:
    _, map_id, lineup_id = cb.data.split(":")
    map_data = _get_map(map_id)
    lineup = _get_lineup(map_id, lineup_id)
    if map_data is None or lineup is None:
        await cb.answer("Раскидка не найдена", show_alert=True)
        return

    text = (
        f"{_lineup_badge(lineup)} · <b>{lineup['title']}</b>\n\n"
        f"<b>{map_data['emoji']} {map_data['name']}</b>\n\n"
        f"<b>Выполнение:</b>\n{_steps_text(lineup['steps'])}"
    )
    await cb.message.edit_text(
        text,
        parse_mode="HTML",
        reply_markup=guide_back_keyboard(map_id, to_lineups=True),
    )
    video_url = lineup.get("video")
    if video_url:
        try:
            await send_lineup_video(cb.bot, cb.message.chat.id, video_url, caption=text)
        except Exception:
            pass
    await cb.answer()


@router.callback_query(F.data.startswith("guide_tactics:"))
async def show_tactics(cb: CallbackQuery) -> None:
    map_id = cb.data.split(":", 1)[1]
    map_data = _get_map(map_id)
    if map_data is None:
        await cb.answer("Карта не найдена", show_alert=True)
        return

    tactics = TACTICS.get(map_id, [])
    if not tactics:
        await cb.answer("На этой карте пока нет тактик", show_alert=True)
        return

    await cb.message.edit_text(
        f"🎯 <b>Тактики · {map_data['name']}</b>\n\nВыбери тактику:",
        parse_mode="HTML",
        reply_markup=guide_tactics_keyboard(map_id),
    )
    await cb.answer()


@router.callback_query(F.data.startswith("guide_tactic:"))
async def show_tactic(cb: CallbackQuery) -> None:
    _, map_id, tactic_id = cb.data.split(":")
    map_data = _get_map(map_id)
    tactic = _get_tactic(map_id, tactic_id)
    if map_data is None or tactic is None:
        await cb.answer("Тактика не найдена", show_alert=True)
        return

    text = (
        f"🎯 <b>{tactic['title']}</b>\n\n"
        f"<b>{map_data['emoji']} {map_data['name']}</b>\n\n"
        f"<b>Выполнение:</b>\n{_steps_text(tactic['steps'])}"
    )
    await cb.message.edit_text(
        text,
        parse_mode="HTML",
        reply_markup=guide_back_keyboard(map_id, to_lineups=False),
    )
    await cb.answer()
