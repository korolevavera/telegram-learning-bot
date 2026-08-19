from aiogram import F, Router
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery

from ..content import LINEUP_TYPES, MAPS, ROLES
from ..keyboards import (
    guide_back_keyboard,
    guide_lineups_keyboard,
    guides_keyboard,
)
from ..lineups_loader import get_lineups
from ..video_player import send_lineup_video

LINEUPS = get_lineups()
router = Router()


def _get_map(map_id: str) -> dict | None:
    return next((m for m in MAPS if m["id"] == map_id), None)


def _get_lineup(map_id: str, lineup_id: str) -> dict | None:
    return next((l for l in LINEUPS.get(map_id, []) if l["id"] == lineup_id), None)


def _lineup_badge(lineup: dict) -> str:
    type_info = LINEUP_TYPES.get(lineup.get("type", ""), {})
    emoji = type_info.get("emoji", "🧨")
    label = type_info.get("label", lineup.get("type", "Раскидка"))
    return f"{emoji} {label}"


def _steps_text(steps: list) -> str:
    parts = []
    for i, step in enumerate(steps):
        if isinstance(step, dict):
            text = step.get("text", "")
            badges = []
            role = step.get("role")
            if role:
                role_info = ROLES.get(role, {})
                badges.append(f"{role_info.get('emoji', '')}{role_info.get('ru', role)}")
            for util in step.get("util", []) or []:
                u_info = LINEUP_TYPES.get(util.get("type", ""), {})
                badges.append(f"{u_info.get('emoji', '🧨')}{u_info.get('label', util.get('type', ''))}")
            time = step.get("time")
            if time is not None:
                badges.append(f"⏱️{time}с")
            prefix = f"[{' · '.join(badges)}] " if badges else ""
            parts.append(f"{i + 1}. {prefix}{text}")
        else:
            parts.append(f"{i + 1}. {step}")
    return "\n".join(parts)


@router.callback_query(F.data == "guides")
async def show_guides(cb: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await cb.message.edit_text(
        "💣 <b>Гранаты</b>\n\nВыбери карту, чтобы посмотреть раскидки:",
        parse_mode="HTML",
        reply_markup=guides_keyboard(),
    )
    await cb.answer()


@router.callback_query(F.data.startswith("guide_map:"))
async def show_map(cb: CallbackQuery) -> None:
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
        reply_markup=guide_back_keyboard(map_id),
    )
    video_url = lineup.get("video")
    if video_url:
        try:
            await send_lineup_video(cb.bot, cb.message.chat.id, video_url, caption=text)
        except Exception:
            pass
    await cb.answer()
