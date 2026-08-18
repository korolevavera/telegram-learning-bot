import os

from aiohttp.test_utils import TestClient
from tests.conftest import make_init_data

os.environ.setdefault("ADMIN_IDS", "")


async def test_admin_requires_admin(client: TestClient):
    init = make_init_data(user_id=9801)
    for method, path, body in (
        ("get", "/api/admin/grenades", None),
        ("post", "/api/admin/content", {"content_type": "grenade", "content_key": "x", "payload": {}}),
    ):
        resp = await getattr(client, method)(path, json=body, headers={"x-init-data": init})
        assert resp.status == 403


async def test_admin_content_crud(client: TestClient):
    import bot.config_loader as cl

    old = cl.CONFIG.admin_ids
    cl.CONFIG.admin_ids = {999001}
    try:
        admin = make_init_data(user_id=999001)
        # создание оверрайда гранаты
        payload = {
            "map": "mirage",
            "title": "Admin Smoke Mid",
            "type": "smoke",
            "side": "T",
            "site": "Mid",
            "difficulty": 3,
            "steps": ["Stand here", "Jump throw"],
        }
        resp = await client.post(
            "/api/admin/content",
            json={"content_type": "grenade", "content_key": "mi-admin-smoke", "payload": payload},
            headers={"x-init-data": admin},
        )
        assert (await resp.json())["ok"] is True
        # граната появилась в выдаче
        resp = await client.get("/api/grenades", params={"map": "mirage"}, headers={"x-init-data": admin})
        data = await resp.json()
        found = next((g for g in data["grenades"] if g["id"] == "mi-admin-smoke"), None)
        assert found is not None
        assert found["title"] == "Admin Smoke Mid"
        assert found["steps"] == payload["steps"]
        # оверрайд цены в шопе
        resp = await client.post(
            "/api/admin/content",
            json={"content_type": "shop", "content_key": "title_trainee", "payload": {"price": 1}},
            headers={"x-init-data": admin},
        )
        assert (await resp.json())["ok"] is True
        resp = await client.get("/api/shop", headers={"x-init-data": admin})
        data = await resp.json()
        assert data["catalog"]["title_trainee"]["price"] == 1
        # оверрайд вопросов игры
        resp = await client.post(
            "/api/admin/content",
            json={
                "content_type": "game",
                "content_key": "reaction",
                "payload": {"questions": [{"q": "test", "answer": "a", "options": ["a", "b"]}]},
            },
            headers={"x-init-data": admin},
        )
        assert (await resp.json())["ok"] is True
        resp = await client.get("/api/games", headers={"x-init-data": admin})
        data = await resp.json()
        assert len(data["games"]["reaction"]["questions"]) == 1
        # список оверрайдов
        resp = await client.get("/api/admin/grenades", headers={"x-init-data": admin})
        data = await resp.json()
        assert "mi-admin-smoke" in data["overrides"]
        # удаление
        resp = await client.post(
            "/api/admin/content/delete",
            json={"content_type": "grenade", "content_key": "mi-admin-smoke"},
            headers={"x-init-data": admin},
        )
        assert (await resp.json())["ok"] is True
        resp = await client.get("/api/grenades", params={"map": "mirage"}, headers={"x-init-data": admin})
        data = await resp.json()
        assert all(g["id"] != "mi-admin-smoke" for g in data["grenades"])
    finally:
        cl.CONFIG.admin_ids = old


async def test_admin_dashboard_metrics(client: TestClient):
    import bot.config_loader as cl

    old = cl.CONFIG.admin_ids
    cl.CONFIG.admin_ids = {999001}
    try:
        admin = make_init_data(user_id=999001)
        resp = await client.get("/api/admin/dashboard", headers={"x-init-data": admin})
        data = await resp.json()
        assert data["ok"] is True
        d = data["dashboard"]
        for key in (
            "total_users", "total_profiles", "total_lessons_done", "total_quizzes_done",
            "total_practices_done", "total_games_done", "total_training_done",
            "total_challenges_claimed", "total_xp_given", "total_coins_spent",
            "total_transactions", "top_users",
        ):
            assert key in d
        assert isinstance(d["top_users"], list)
    finally:
        cl.CONFIG.admin_ids = old