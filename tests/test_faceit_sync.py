from aiohttp.test_utils import TestClient
from tests.conftest import make_init_data


async def test_faceit_sync_requires_auth(client: TestClient):
    resp = await client.post("/api/faceit/sync", json={})
    assert resp.status == 401


async def test_faceit_sync_not_linked(client: TestClient):
    init = make_init_data(user_id=9701)
    resp = await client.post("/api/faceit/sync", json={}, headers={"x-init-data": init})
    assert resp.status == 400


async def test_profile_has_faceit_elo_field(client: TestClient):
    init = make_init_data(user_id=9702)
    resp = await client.get("/api/profile", headers={"x-init-data": init})
    prof = (await resp.json())["profile"]
    assert "faceit_elo" in prof
    assert "faceit_level" in prof
    assert prof["faceit_elo"] == 0


async def test_faceit_link_rejects_empty(client: TestClient):
    init = make_init_data(user_id=9703)
    resp = await client.post("/api/faceit/link", json={"faceit_name": ""}, headers={"x-init-data": init})
    assert resp.status == 400