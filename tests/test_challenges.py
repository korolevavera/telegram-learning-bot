import time

from aiohttp.test_utils import TestClient
from bot.challenges import CHALLENGES, current_week_key, week_challenges
from tests.conftest import make_init_data

TODAY_YD = time.localtime().tm_yday


async def test_challenges_requires_auth(client: TestClient):
    resp = await client.get("/api/challenges")
    assert resp.status == 401


async def test_challenges_list(client: TestClient):
    init = make_init_data(user_id=9201)
    resp = await client.get("/api/challenges", headers={"x-init-data": init})
    data = await resp.json()
    assert data["ok"] is True
    assert data["week_key"] == current_week_key()
    assert len(data["challenges"]) == 3
    ids = {c["id"] for c in data["challenges"]}
    assert ids == {c["id"] for c in week_challenges()}
    assert all(0 <= c["progress"] <= c["target"] for c in data["challenges"])


async def test_challenge_progress_tracks_activity(client: TestClient):
    init = make_init_data(user_id=9202)
    challenges = (await (await client.get("/api/challenges", headers={"x-init-data": init})).json())["challenges"]
    by_type = {c["type"]: c for c in challenges}
    # играем в игру, делаем тренировку, получаем XP
    await client.post(
        "/api/games/submit",
        json={"game_id": "reaction", "score": 4, "total": 5, "duration_ms": 6000},
        headers={"x-init-data": init},
    )
    plan = (await (await client.get("/api/training/plan", headers={"x-init-data": init})).json())["plan"]
    await client.post(
        "/api/training/complete",
        json={"task_id": plan[0]["task_id"], "skill_id": plan[0]["skill_id"]},
        headers={"x-init-data": init},
    )
    data = (await (await client.get("/api/challenges", headers={"x-init-data": init})).json())
    cur = {c["type"]: c["progress"] for c in data["challenges"]}
    if "games_played" in by_type:
        assert cur["games_played"] >= 1
    if "training_tasks" in by_type:
        assert cur["training_tasks"] >= 1
    if "xp_earned" in by_type:
        assert cur["xp_earned"] >= 10


async def test_claim_completed_challenge(client: TestClient):
    init = make_init_data(user_id=9203)
    challenges = (await (await client.get("/api/challenges", headers={"x-init-data": init})).json())["challenges"]
    target_ch = None
    # набираем прогресс по каждому типу, пока какой-то не выполнится
    for i in range(20):
        await client.post(
            "/api/games/submit",
            json={"game_id": "reaction", "score": 5, "total": 5, "duration_ms": 6000 + i * 100},
            headers={"x-init-data": init},
        )
    challenges = (await (await client.get("/api/challenges", headers={"x-init-data": init})).json())["challenges"]
    for ch in challenges:
        if ch["completed"] and not ch["claimed"]:
            target_ch = ch
            break
    assert target_ch is not None
    resp = await client.post(
        "/api/challenges/claim",
        json={"challenge_id": target_ch["id"]},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["ok"] is True
    assert data["reward_xp"] == CHALLENGES[target_ch["id"]]["reward_xp"]
    assert data["reward_coins"] == CHALLENGES[target_ch["id"]]["reward_coins"]
    assert data["profile"]["xp"] >= CHALLENGES[target_ch["id"]]["reward_xp"]
    resp = await client.post(
        "/api/challenges/claim",
        json={"challenge_id": target_ch["id"]},
        headers={"x-init-data": init},
    )
    assert resp.status == 400  # уже получено


async def test_claim_not_completed_rejected(client: TestClient):
    init = make_init_data(user_id=9204)
    challenges = (await (await client.get("/api/challenges", headers={"x-init-data": init})).json())["challenges"]
    resp = await client.post(
        "/api/challenges/claim",
        json={"challenge_id": challenges[0]["id"]},
        headers={"x-init-data": init},
    )
    assert resp.status == 400


async def test_claim_unknown_rejected(client: TestClient):
    init = make_init_data(user_id=9205)
    resp = await client.post(
        "/api/challenges/claim",
        json={"challenge_id": "hacker"},
        headers={"x-init-data": init},
    )
    assert resp.status == 400