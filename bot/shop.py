"""Shop: items (titles, frames, avatars, badges), rarity, limited, inventory."""

import json

from sqlalchemy import func, select

from .db import SessionLocal
from .models import CurrencyTransaction, UserProfile

RARITY = {
    "common": {"name": "Common", "name_ru": "Обычный", "color": "#9aa4b5"},
    "rare": {"name": "Rare", "name_ru": "Редкий", "color": "#3f9bf5"},
    "epic": {"name": "Epic", "name_ru": "Эпический", "color": "#b06cf0"},
    "legendary": {"name": "Legendary", "name_ru": "Легендарный", "color": "#f0b63f"},
}

SHOP_ITEMS = {
    # Титулы
    "title_trainee": {"id": "title_trainee", "name": "Trainee", "name_ru": "Стажёр", "type": "title", "price": 50, "icon": "🏷️", "rarity": "common"},
    "title_veteran": {"id": "title_veteran", "name": "Veteran", "name_ru": "Ветеран", "type": "title", "price": 200, "icon": "🎖️", "rarity": "rare"},
    "title_master": {"id": "title_master", "name": "Master", "name_ru": "Мастер", "type": "title", "price": 500, "icon": "🏆", "rarity": "epic"},
    "title_legend": {"id": "title_legend", "name": "Legend", "name_ru": "Легенда", "type": "title", "price": 1500, "icon": "👑", "rarity": "legendary"},
    "title_pro": {"id": "title_pro", "name": "CS2 Pro", "name_ru": "CS2 Про", "type": "title", "price": 3000, "icon": "⭐", "rarity": "legendary"},
    # Рамки
    "frame_gold": {"id": "frame_gold", "name": "Gold Frame", "name_ru": "Золотая рамка", "type": "frame", "price": 300, "icon": "🖼️", "rarity": "rare"},
    "frame_neon": {"id": "frame_neon", "name": "Neon Frame", "name_ru": "Неоновая рамка", "type": "frame", "price": 400, "icon": "💡", "rarity": "epic"},
    "frame_fire": {"id": "frame_fire", "name": "Fire Frame", "name_ru": "Огненная рамка", "type": "frame", "price": 600, "icon": "🔥", "rarity": "epic"},
    # Аватары
    "avatar_rifler": {"id": "avatar_rifler", "name": "Rifler", "name_ru": "Стрелок", "type": "avatar", "price": 100, "icon": "🔫", "rarity": "common"},
    "avatar_awper": {"id": "avatar_awper", "name": "AWPer", "name_ru": "Снайпер", "type": "avatar", "price": 150, "icon": "🎯", "rarity": "rare"},
    "avatar_grenadier": {"id": "avatar_grenadier", "name": "Grenadier", "name_ru": "Гренадёр", "type": "avatar", "price": 150, "icon": "💣", "rarity": "rare"},
    "avatar_phantom": {"id": "avatar_phantom", "name": "Phantom", "name_ru": "Фантом", "type": "avatar", "price": 400, "icon": "👽", "rarity": "epic"},
    "avatar_eagle": {"id": "avatar_eagle", "name": "Golden Eagle", "name_ru": "Золотой орёл", "type": "avatar", "price": 800, "icon": "🦅", "rarity": "epic"},
    "avatar_flame": {"id": "avatar_flame", "name": "Flame Core", "name_ru": "Пламенное ядро", "type": "avatar", "price": 1500, "icon": "🔥", "rarity": "legendary", "limited": 25},
    # Бейджи
    "badge_win10": {"id": "badge_win10", "name": "10 Wins", "name_ru": "10 побед", "type": "badge", "price": 200, "icon": "🥈", "rarity": "rare"},
    "badge_clutch": {"id": "badge_clutch", "name": "Clutch King", "name_ru": "Король клатчей", "type": "badge", "price": 500, "icon": "👑", "rarity": "epic"},
    "badge_god": {"id": "badge_god", "name": "CS2 God", "name_ru": "Бог CS2", "type": "badge", "price": 2000, "icon": "😈", "rarity": "legendary", "limited": 10},
}


async def get_shop_catalog() -> dict:
    async with SessionLocal() as session:
        sold_rows = await session.execute(
            select(
                CurrencyTransaction.reason,
                func.count(),
            )
            .where(CurrencyTransaction.reason.like("shop:%"), CurrencyTransaction.coin_delta < 0)
            .group_by(CurrencyTransaction.reason)
        )
        sold = {reason.removeprefix("shop:"): cnt for reason, cnt in sold_rows}
    from .services import get_content_overrides

    price_overrides = await get_content_overrides("shop")
    catalog = {}
    for item_id, item in SHOP_ITEMS.items():
        entry = dict(item)
        override = price_overrides.get(item_id) or {}
        if isinstance(override.get("price"), int) and override["price"] >= 0:
            entry["price"] = override["price"]
        if isinstance(override.get("limited"), int) and override["limited"] >= 0:
            entry["limited"] = override["limited"]
        entry["rarity"] = RARITY.get(item.get("rarity", "common"), RARITY["common"])
        if entry.get("limited"):
            entry["sold"] = sold.get(item_id, 0)
            entry["stock_left"] = max(0, entry["limited"] - entry["sold"])
        catalog[item_id] = entry
    return catalog


async def get_inventory(user_id: int) -> dict:
    async with SessionLocal() as session:
        profile = await session.scalar(
            select(UserProfile).where(UserProfile.user_id == user_id)
        )
        if not profile:
            return {"items": [], "equipped": {}}
        inv = json.loads(profile.inventory) if profile.inventory else []
        return {
            "items": inv,
            "equipped": {
                "title": profile.equipped_title or "",
                "avatar": profile.equipped_avatar or "",
                "badge": profile.equipped_badge or "",
            },
        }


async def buy_item(user_id: int, item_id: str) -> dict:
    item = SHOP_ITEMS.get(item_id)
    if not item:
        return {"ok": False, "error": "unknown item"}

    from .services import get_content_overrides

    override = (await get_content_overrides("shop")).get(item_id) or {}
    price = override["price"] if isinstance(override.get("price"), int) and override["price"] >= 0 else item["price"]
    limited = override["limited"] if isinstance(override.get("limited"), int) and override["limited"] >= 0 else item.get("limited")

    async with SessionLocal() as session:
        profile = await session.scalar(
            select(UserProfile).where(UserProfile.user_id == user_id)
        )
        if not profile:
            from .gamification import _get_or_create
            profile = await _get_or_create(session, user_id)

        inv = json.loads(profile.inventory) if profile.inventory else []
        if item_id in inv:
            return {"ok": False, "error": "already owned"}

        if profile.coins < price:
            return {"ok": False, "error": "not enough coins"}

        if limited:
            sold = await session.scalar(
                select(func.count()).select_from(CurrencyTransaction).where(
                    CurrencyTransaction.reason == f"shop:{item_id}",
                    CurrencyTransaction.coin_delta < 0,
                )
            )
            if (sold or 0) >= limited:
                return {"ok": False, "error": "sold out"}

        profile.coins -= price
        inv.append(item_id)
        profile.inventory = json.dumps(inv)
        session.add(
            CurrencyTransaction(
                user_id=user_id,
                xp_delta=0,
                coin_delta=-price,
                reason=f"shop:{item_id}",
            )
        )

        await session.commit()
        return {
            "ok": True,
            "coins": profile.coins,
            "inventory": inv,
        }


async def equip_item(user_id: int, item_id: str) -> dict:
    item = SHOP_ITEMS.get(item_id)
    if not item:
        return {"ok": False, "error": "unknown item"}

    async with SessionLocal() as session:
        profile = await session.scalar(
            select(UserProfile).where(UserProfile.user_id == user_id)
        )
        if not profile:
            return {"ok": False, "error": "no profile"}

        inv = json.loads(profile.inventory) if profile.inventory else []
        if item_id not in inv:
            return {"ok": False, "error": "not owned"}

        if item["type"] == "title":
            profile.equipped_title = item_id
        elif item["type"] == "avatar":
            profile.equipped_avatar = item_id
        elif item["type"] == "badge":
            profile.equipped_badge = item_id
        else:
            return {"ok": False, "error": "not equippable"}
        await session.commit()
        return {
            "ok": True,
            "equipped": {
                "title": profile.equipped_title or "",
                "avatar": profile.equipped_avatar or "",
                "badge": profile.equipped_badge or "",
            },
        }
