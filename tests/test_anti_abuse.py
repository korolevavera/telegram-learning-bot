from aiohttp.test_utils import TestClient
import pytest

from bot.web_server import GAME_DAILY_REWARD_CAP
from tests.conftest import make_init_data


async def test_lesson_xp_awarded_once(client: TestClient):
    init = make_init_data(user_id=7001)
    resp = await client.post("/api/lesson", json={"lesson_id": "once-1"}, headers={"x-init-data": init})
    xp1 = (await resp.json())["profile"]["xp"]
    resp = await client.post("/api/lesson", json={"lesson_id": "once-1"}, headers={"x-init-data": init})
    xp2 = (await resp.json())["profile"]["xp"]
    assert xp1 > 0
    assert xp2 == xp1


async def test_quiz_xp_awarded_once(client: TestClient):
    init = make_init_data(user_id=7002)
    resp = await client.post("/api/quiz", json={"quiz_id": "once-q", "score": 4, "total": 4}, headers={"x-init-data": init})
    xp1 = (await resp.json())["profile"]["xp"]
    resp = await client.post("/api/quiz", json={"quiz_id": "once-q", "score": 3, "total": 4}, headers={"x-init-data": init})
    xp2 = (await resp.json())["profile"]["xp"]
    resp = await client.get("/api/progress", headers={"x-init-data": init})
    assert (await resp.json())["progress"]["quizzes_taken"] == 2
    assert xp1 > 0
    assert xp2 == xp1


async def test_card_xp_only_on_first_known(client: TestClient):
    init = make_init_data(user_id=7003)
    resp = await client.post("/api/card", json={"index": 0, "known": True}, headers={"x-init-data": init})
    xp1 = (await resp.json())["profile"]["xp"]
    resp = await client.post("/api/card", json={"index": 0, "known": True}, headers={"x-init-data": init})
    xp2 = (await resp.json())["profile"]["xp"]
    assert xp1 > 0
    assert xp2 == xp1


async def test_practice_xp_only_first_attempt(client: TestClient):
    init = make_init_data(user_id=7004)
    resp = await client.post("/api/training", json={"map_id": "mirage", "lineup_id": "once-p"}, headers={"x-init-data": init})
    xp1 = (await resp.json())["profile"]["xp"]
    resp = await client.post("/api/training", json={"map_id": "mirage", "lineup_id": "once-p"}, headers={"x-init-data": init})
    xp2 = (await resp.json())["profile"]["xp"]
    assert xp1 > 0
    assert xp2 == xp1


async def test_game_impossible_score_rejected(client: TestClient):
    init = make_init_data(user_id=7005)
    resp = await client.post(
        "/api/games/submit",
        json={"game_id": "callouts", "score": 31, "total": 30, "duration_ms": 60000},
        headers={"x-init-data": init},
    )
    assert resp.status == 400


async def test_game_too_fast_rejected(client: TestClient):
    init = make_init_data(user_id=7006)
    resp = await client.post(
        "/api/games/submit",
        json={"game_id": "callouts", "score": 30, "total": 30, "duration_ms": 500},
        headers={"x-init-data": init},
    )
    assert resp.status == 400


async def test_game_unknown_rejected(client: TestClient):
    init = make_init_data(user_id=7007)
    resp = await client.post(
        "/api/games/submit",
        json={"game_id": "hacker", "score": 10, "total": 10, "duration_ms": 60000},
        headers={"x-init-data": init},
    )
    assert resp.status == 400


async def test_game_duplicate_rejected(client: TestClient):
    init = make_init_data(user_id=7008)
    payload = {"game_id": "utility", "score": 14, "total": 15, "duration_ms": 20000}
    resp = await client.post("/api/games/submit", json=payload, headers={"x-init-data": init})
    assert resp.status == 200
    resp = await client.post("/api/games/submit", json=payload, headers={"x-init-data": init})
    assert resp.status == 400


async def test_game_reward_cap_per_day(client: TestClient):
    init = make_init_data(user_id=7009)
    total = 10
    duration = 15000
    first_xp = None
    rewarded_flags = []
    for i in range(GAME_DAILY_REWARD_CAP + 1):
        resp = await client.post(
            "/api/games/submit",
            json={"game_id": "economy", "score": i, "total": total, "duration_ms": duration + i},
            headers={"x-init-data": init},
        )
        assert resp.status == 200
        data = await resp.json()
        rewarded_flags.append(data["rewarded"])
        if first_xp is None:
            first_xp = data["profile"]["xp"]
    assert rewarded_flags[:GAME_DAILY_REWARD_CAP] == [True] * GAME_DAILY_REWARD_CAP
    assert rewarded_flags[GAME_DAILY_REWARD_CAP] is False


async def test_transactions_ledger(client: TestClient):
    init = make_init_data(user_id=7010)
    await client.post("/api/lesson", json={"lesson_id": "ledger-1"}, headers={"x-init-data": init})
    resp = await client.get("/api/transactions", headers={"x-init-data": init})
    data = await resp.json()
    assert data["ok"] is True
    assert len(data["transactions"]) == 1
    assert data["transactions"][0]["xp_delta"] > 0
    assert data["transactions"][0]["reason"] == "lesson"


async def test_shop_purchase_writes_ledger(client: TestClient):
    init = make_init_data(user_id=7011)
    for i in range(12):
        await client.post("/api/lesson", json={"lesson_id": f"ledger-shop-{i}"}, headers={"x-init-data": init})
    resp = await client.post("/api/shop/buy", json={"item_id": "title_trainee"}, headers={"x-init-data": init})
    assert (await resp.json())["ok"] is True
    resp = await client.get("/api/transactions", headers={"x-init-data": init})
    data = await resp.json()
    shop_tx = [t for t in data["transactions"] if t["reason"].startswith("shop:")]
    assert len(shop_tx) == 1
    assert shop_tx[0]["coin_delta"] < 0


async def test_transactions_unauthorized(client: TestClient):
    resp = await client.get("/api/transactions")
    assert resp.status == 401