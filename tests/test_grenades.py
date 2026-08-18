from aiohttp.test_utils import TestClient
from tests.conftest import make_init_data


async def test_grenades_list(client: TestClient):
    resp = await client.get("/api/grenades")
    assert resp.status == 200
    data = await resp.json()
    assert data["ok"] is True
    assert data["total"] >= 40
    g = data["grenades"][0]
    assert "map" in g
    assert "side" in g
    assert "site" in g
    assert "difficulty" in g


async def test_grenades_mirage_has_metadata(client: TestClient):
    resp = await client.get("/api/grenades?map=mirage")
    data = await resp.json()
    grenades = data["grenades"]
    assert len(grenades) >= 6
    assert all(g["map"] == "mirage" for g in grenades)


async def test_grenades_filter_side_and_type(client: TestClient):
    resp = await client.get("/api/grenades?side=CT&type=smoke")
    data = await resp.json()
    assert data["total"] > 0
    assert all(g["side"] == "CT" and g["type"] == "smoke" for g in data["grenades"])


async def test_grenades_search_query(client: TestClient):
    resp = await client.get("/api/grenades?q=mid")
    data = await resp.json()
    assert data["total"] > 0


async def test_grenades_empty_result(client: TestClient):
    resp = await client.get("/api/grenades?map=mirage&side=CT&type=he")
    data = await resp.json()
    assert data["total"] == 0


async def test_grenade_detail(client: TestClient):
    resp = await client.get("/api/grenades/mi-window")
    assert resp.status == 200
    data = await resp.json()
    assert data["grenade"]["id"] == "mi-window"
    assert data["grenade"]["steps"]


async def test_grenade_detail_not_found(client: TestClient):
    resp = await client.get("/api/grenades/nope")
    assert resp.status == 404


async def test_favorites_requires_auth(client: TestClient):
    resp = await client.get("/api/favorites")
    assert resp.status == 401


async def test_favorites_add_list_remove(client: TestClient):
    init = make_init_data(user_id=8001)
    resp = await client.post("/api/favorites", json={"item_type": "grenade", "item_id": "mi-window"}, headers={"x-init-data": init})
    assert (await resp.json())["ok"] is True
    resp = await client.get("/api/favorites", headers={"x-init-data": init})
    data = await resp.json()
    assert {"item_type": "grenade", "item_id": "mi-window"} in data["favorites"]
    resp = await client.delete("/api/favorites?item_type=grenade&item_id=mi-window", headers={"x-init-data": init})
    assert (await resp.json())["ok"] is True
    resp = await client.get("/api/favorites", headers={"x-init-data": init})
    assert (await resp.json())["favorites"] == []


async def test_favorites_no_duplicates(client: TestClient):
    init = make_init_data(user_id=8002)
    for _ in range(3):
        await client.post("/api/favorites", json={"item_type": "grenade", "item_id": "mi-ct"}, headers={"x-init-data": init})
    resp = await client.get("/api/favorites", headers={"x-init-data": init})
    favs = (await resp.json())["favorites"]
    assert len(favs) == 1


async def test_favorites_invalid_item(client: TestClient):
    init = make_init_data(user_id=8003)
    resp = await client.post("/api/favorites", json={"item_type": "", "item_id": ""}, headers={"x-init-data": init})
    assert resp.status == 400
