from aiohttp.test_utils import TestClient
from tests.conftest import make_init_data


async def test_plan_requires_auth(client: TestClient):
    resp = await client.get("/api/training/plan")
    assert resp.status == 401


async def test_plan_generated(client: TestClient):
    init = make_init_data(user_id=9001)
    resp = await client.get("/api/training/plan", headers={"x-init-data": init})
    assert resp.status == 200
    data = await resp.json()
    assert data["ok"] is True
    assert len(data["plan"]) == 4  # default 30 min
    assert data["weakest"]["skill_id"] == "aim"  # no skills yet
    assert "skills" in data
    assert all(t["duration_min"] > 0 for t in data["plan"])


async def test_onboarding_saves_prefs(client: TestClient):
    init = make_init_data(user_id=9002)
    resp = await client.post(
        "/api/onboarding",
        json={"training_minutes": 45, "goal": "utility", "role": "igl"},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["ok"] is True
    assert data["prefs"]["training_minutes"] == 45
    assert data["prefs"]["goal"] == "utility"
    resp = await client.get("/api/training/plan", headers={"x-init-data": init})
    data = await resp.json()
    assert len(data["plan"]) == 5  # 45 min -> 5 tasks
    assert data["prefs"]["goal"] == "utility"


async def test_onboarding_rejects_bad_minutes(client: TestClient):
    init = make_init_data(user_id=9003)
    resp = await client.post(
        "/api/onboarding",
        json={"training_minutes": 999, "goal": "aim"},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["prefs"]["training_minutes"] == 30


async def test_complete_task_rewards_once(client: TestClient):
    init = make_init_data(user_id=9004)
    resp = await client.get("/api/training/plan", headers={"x-init-data": init})
    plan = (await resp.json())["plan"]
    task = plan[0]
    resp = await client.post(
        "/api/training/complete",
        json={"task_id": task["task_id"], "skill_id": task["skill_id"]},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["ok"] is True
    assert data["rewarded"] is True
    assert data["profile"]["xp"] > 0
    assert data["skill_level"] >= 5
    xp1 = data["profile"]["xp"]
    resp = await client.post(
        "/api/training/complete",
        json={"task_id": task["task_id"], "skill_id": task["skill_id"]},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["rewarded"] is False
    assert data["profile"]["xp"] == xp1
    resp = await client.get("/api/training/plan", headers={"x-init-data": init})
    data = await resp.json()
    assert data["completed_count"] == 1


async def test_complete_unknown_task_rejected(client: TestClient):
    init = make_init_data(user_id=9005)
    resp = await client.post(
        "/api/training/complete",
        json={"task_id": "hacker-task-2026-01-01-0", "skill_id": "aim"},
        headers={"x-init-data": init},
    )
    assert resp.status == 400


async def test_complete_bad_skill_rejected(client: TestClient):
    init = make_init_data(user_id=9006)
    resp = await client.post(
        "/api/training/complete",
        json={"task_id": "x", "skill_id": "nope"},
        headers={"x-init-data": init},
    )
    assert resp.status == 400


async def test_weakest_skill_recommendation(client: TestClient):
    init = make_init_data(user_id=9007)
    plan_resp = await client.get("/api/training/plan", headers={"x-init-data": init})
    plan = (await plan_resp.json())["plan"]
    for i, task in enumerate(plan[:2]):
        await client.post(
            "/api/training/complete",
            json={"task_id": task["task_id"], "skill_id": task["skill_id"]},
            headers={"x-init-data": init},
        )
    resp = await client.get("/api/training/plan", headers={"x-init-data": init})
    data = await resp.json()
    assert data["skills"]["aim"]["level"] >= 5
    assert data["weakest"]["skill_id"] in data["skills"]