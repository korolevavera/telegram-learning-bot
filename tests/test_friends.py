from aiohttp.test_utils import TestClient
from tests.conftest import make_init_data


async def test_friends_requires_auth(client: TestClient):
    resp = await client.get("/api/friends")
    assert resp.status == 401


async def test_friend_flow(client: TestClient):
    a = make_init_data(user_id=9301, first_name="Alice")
    b = make_init_data(user_id=9302, first_name="Bob")
    # запрос от A к B
    resp = await client.post("/api/friends/request", json={"user_id": 9302}, headers={"x-init-data": a})
    assert (await resp.json())["ok"] is True
    # дубль запроса
    resp = await client.post("/api/friends/request", json={"user_id": 9302}, headers={"x-init-data": a})
    assert resp.status == 400
    # у B входящий запрос
    resp = await client.get("/api/friends", headers={"x-init-data": b})
    data = await resp.json()
    assert len(data["requests"]) == 1
    assert data["requests"][0]["user_id"] == 9301
    assert data["friends"] == []
    # B принимает
    resp = await client.post("/api/friends/accept", json={"user_id": 9301}, headers={"x-init-data": b})
    assert (await resp.json())["ok"] is True
    resp = await client.get("/api/friends", headers={"x-init-data": a})
    data = await resp.json()
    assert len(data["friends"]) == 1
    assert data["friends"][0]["user_id"] == 9302
    assert data["requests"] == []
    # повторный accept невозможен
    resp = await client.post("/api/friends/accept", json={"user_id": 9301}, headers={"x-init-data": b})
    assert resp.status == 400
    # лидерборд друзей
    resp = await client.get("/api/friends/leaderboard", headers={"x-init-data": a})
    data = await resp.json()
    assert len(data["leaders"]) == 1
    assert data["leaders"][0]["user_id"] == 9302
    # удаление
    resp = await client.post("/api/friends/remove", json={"user_id": 9302}, headers={"x-init-data": a})
    assert (await resp.json())["ok"] is True
    resp = await client.get("/api/friends", headers={"x-init-data": a})
    assert (await resp.json())["friends"] == []


async def test_self_request_rejected(client: TestClient):
    init = make_init_data(user_id=9303)
    resp = await client.post("/api/friends/request", json={"user_id": 9303}, headers={"x-init-data": init})
    assert resp.status == 400


async def test_bad_user_id_rejected(client: TestClient):
    init = make_init_data(user_id=9304)
    resp = await client.post("/api/friends/request", json={"user_id": "abc"}, headers={"x-init-data": init})
    assert resp.status == 400


async def test_accept_no_request_rejected(client: TestClient):
    init = make_init_data(user_id=9305)
    resp = await client.post("/api/friends/accept", json={"user_id": 99999}, headers={"x-init-data": init})
    assert resp.status == 400