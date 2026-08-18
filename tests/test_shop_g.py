import asyncio

from aiohttp.test_utils import TestClient
from bot.shop import SHOP_ITEMS, RARITY
from tests.conftest import make_init_data


async def _give_coins(user_id: int, amount: int):
    from bot.db import SessionLocal
    from bot.gamification import _get_or_create
    from sqlalchemy import select
    from bot.models import UserProfile

    async with SessionLocal() as session:
        profile = await _get_or_create(session, user_id)
        profile.coins += amount
        await session.commit()


async def test_catalog_has_rarity_and_types(client: TestClient):
    resp = await client.get("/api/shop")
    data = await resp.json()
    types = {item["type"] for item in data["catalog"].values()}
    assert {"title", "frame", "avatar", "badge"} <= types
    for item in data["catalog"].values():
        assert item["rarity"]["color"]  # каждый товар с rarity-метой
        assert "rarity" in item


async def test_limited_stock_tracked(client: TestClient):
    flame = SHOP_ITEMS["avatar_flame"]
    for i in range(flame["limited"]):
        uid = 9500 + i
        init = make_init_data(user_id=uid)
        await _give_coins(uid, 100000)
        resp = await client.post("/api/shop/buy", json={"item_id": "avatar_flame"}, headers={"x-init-data": init})
        assert (await resp.json())["ok"] is True, i
    # последний покупатель видит stock 0
    init2 = make_init_data(user_id=9600)
    await _give_coins(9600, 100000)
    resp = await client.get("/api/shop", headers={"x-init-data": init2})
    data = await resp.json()
    flame_item = data["catalog"]["avatar_flame"]
    assert flame_item["stock_left"] == 0
    resp = await client.post("/api/shop/buy", json={"item_id": "avatar_flame"}, headers={"x-init-data": init2})
    data = await resp.json()
    assert data["ok"] is False  # sold out


async def test_buy_and_equip_avatar_badge(client: TestClient):
    init = make_init_data(user_id=9403)
    await _give_coins(9403, 10000)
    for item_id in ("avatar_rifler", "badge_clutch"):
        resp = await client.post("/api/shop/buy", json={"item_id": item_id}, headers={"x-init-data": init})
        assert (await resp.json())["ok"] is True
        resp = await client.post("/api/shop/equip", json={"item_id": item_id}, headers={"x-init-data": init})
        data = await resp.json()
        assert data["ok"] is True
    resp = await client.get("/api/shop", headers={"x-init-data": init})
    data = await resp.json()
    assert data["inventory"]["equipped"]["avatar"] == "avatar_rifler"
    assert data["inventory"]["equipped"]["badge"] == "badge_clutch"
    resp = await client.get("/api/profile", headers={"x-init-data": init})
    prof = (await resp.json())["profile"]
    assert prof["equipped_avatar"] == "avatar_rifler"
    assert prof["equipped_badge"] == "badge_clutch"


async def test_equip_not_owned_rejected(client: TestClient):
    init = make_init_data(user_id=9404)
    resp = await client.post("/api/shop/equip", json={"item_id": "avatar_eagle"}, headers={"x-init-data": init})
    assert (await resp.json())["ok"] is False