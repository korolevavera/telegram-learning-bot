from aiohttp.test_utils import TestClient
import pytest

from tests.conftest import TEST_TOKEN, make_init_data


async def test_health(client: TestClient):
    resp = await client.get("/healthz")
    assert resp.status == 200
    data = await resp.json()
    assert data["ok"] is True


async def test_index_serves_html(client: TestClient):
    resp = await client.get("/")
    assert resp.status == 200
    text = await resp.text()
    assert "<html" in text
    assert "{{APP_VERSION}}" not in text


async def test_api_init_unauthorized(client: TestClient):
    resp = await client.get("/api/init")
    assert resp.status == 401


async def test_api_init_authorized(client: TestClient):
    init = make_init_data(user_id=555, first_name="Vasya")
    resp = await client.get("/api/init", headers={"x-init-data": init})
    assert resp.status == 200
    data = await resp.json()
    assert data["user"]["id"] == 555
    assert data["user"]["first_name"] == "Vasya"


async def test_api_content(client: TestClient):
    resp = await client.get("/api/content")
    assert resp.status == 200
    data = await resp.json()
    assert "lessons" in data
    assert "cards" in data
    assert "quizzes" in data


async def test_api_guides(client: TestClient):
    resp = await client.get("/api/guides")
    assert resp.status == 200
    data = await resp.json()
    assert data["ok"] is True
    assert data["maps"]
    assert data["tactics"]
    assert "spots" in data


async def test_api_progress_unauthorized(client: TestClient):
    resp = await client.get("/api/progress")
    assert resp.status == 401


async def test_api_progress_authorized(client: TestClient):
    init = make_init_data(user_id=555)
    resp = await client.get("/api/progress", headers={"x-init-data": init})
    assert resp.status == 200
    data = await resp.json()
    assert data["progress"]["lessons_total"] > 0


async def test_api_card_unauthorized(client: TestClient):
    resp = await client.post("/api/card", json={"index": 0, "known": True})
    assert resp.status == 401


async def test_api_lesson_saves_progress(client: TestClient):
    init = make_init_data(user_id=555)
    resp = await client.post(
        "/api/lesson",
        json={"lesson_id": "test-lesson"},
        headers={"x-init-data": init},
    )
    assert resp.status == 200
    resp = await client.get("/api/progress", headers={"x-init-data": init})
    data = await resp.json()
    assert data["progress"]["lessons_done"] == 1
    assert "test-lesson" in data["progress"]["lessons_done_ids"]


async def test_api_card_saves_progress(client: TestClient):
    init = make_init_data(user_id=555)
    resp = await client.post(
        "/api/card",
        json={"index": 0, "known": True},
        headers={"x-init-data": init},
    )
    assert resp.status == 200
    resp = await client.get("/api/progress", headers={"x-init-data": init})
    data = await resp.json()
    assert data["progress"]["cards_known"] == 1
    assert 0 in data["progress"]["cards_known_indexes"]


async def test_api_quiz_saves_best(client: TestClient):
    init = make_init_data(user_id=555)
    resp = await client.post(
        "/api/quiz",
        json={"quiz_id": "test-quiz", "score": 3, "total": 4},
        headers={"x-init-data": init},
    )
    assert resp.status == 200
    resp = await client.get("/api/progress", headers={"x-init-data": init})
    data = await resp.json()
    assert data["progress"]["quizzes_taken"] == 1
    assert data["progress"]["quizzes_best"]["test-quiz"] == 3


async def test_training_log_and_progress(client: TestClient):
    init = make_init_data(user_id=777)
    resp = await client.post(
        "/api/training",
        json={"map_id": "mirage", "lineup_id": "mi-window"},
        headers={"x-init-data": init},
    )
    assert resp.status == 200
    data = await resp.json()
    assert data["ok"] is True
    resp = await client.post(
        "/api/training",
        json={"map_id": "mirage", "lineup_id": "mi-window"},
        headers={"x-init-data": init},
    )
    resp = await client.get("/api/training", headers={"x-init-data": init})
    data = await resp.json()
    assert data["ok"] is True
    assert data["practice"]["mirage"]["mi-window"] == 2


async def test_training_missing_ids(client: TestClient):
    init = make_init_data(user_id=888)
    resp = await client.post(
        "/api/training",
        json={"map_id": "", "lineup_id": "test"},
        headers={"x-init-data": init},
    )
    assert resp.status == 400


async def test_api_games_returns_games(client: TestClient):
    resp = await client.get("/api/games")
    assert resp.status == 200
    data = await resp.json()
    assert data["ok"] is True
    assert "callouts" in data["games"]
    assert "utility" in data["games"]
    assert "economy" in data["games"]
    assert len(data["games"]["callouts"]["questions"]) == 30


async def test_api_games_submit_and_progress(client: TestClient):
    init = make_init_data(user_id=999)
    resp = await client.post(
        "/api/games/submit",
        json={"game_id": "callouts", "score": 8, "total": 10, "duration_ms": 15000},
        headers={"x-init-data": init},
    )
    assert resp.status == 200
    resp = await client.get("/api/games/progress", headers={"x-init-data": init})
    data = await resp.json()
    assert data["ok"] is True
    assert data["progress"]["best"]["callouts"] == 8
    assert data["progress"]["played"]["callouts"] == 1


async def test_api_init_includes_profile(client: TestClient):
    init = make_init_data(user_id=111)
    resp = await client.get("/api/init", headers={"x-init-data": init})
    data = await resp.json()
    assert data["ok"] is True
    assert "profile" in data
    assert data["profile"]["level"] == 1
    assert data["profile"]["xp"] == 0


async def test_api_lesson_awards_xp(client: TestClient):
    init = make_init_data(user_id=222)
    resp = await client.post(
        "/api/lesson",
        json={"lesson_id": "test-ach-lesson"},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["ok"] is True
    assert data["profile"]["xp"] > 0
    resp = await client.get("/api/profile", headers={"x-init-data": init})
    data = await resp.json()
    assert data["profile"]["xp"] > 0


async def test_api_achievements_catalog(client: TestClient):
    resp = await client.get("/api/achievements")
    data = await resp.json()
    assert data["ok"] is True
    assert "first_lesson" in data["achievements"]
    assert "streak_7" in data["achievements"]


async def test_api_leaderboard(client: TestClient):
    init = make_init_data(user_id=333)
    resp = await client.get("/api/leaderboard", headers={"x-init-data": init})
    data = await resp.json()
    assert data["ok"] is True
    assert "leaderboard" in data
    assert "leaders" in data["leaderboard"]
    assert "user_rank" in data["leaderboard"]


async def test_api_shop_catalog(client: TestClient):
    resp = await client.get("/api/shop")
    data = await resp.json()
    assert data["ok"] is True
    assert "catalog" in data
    assert "title_trainee" in data["catalog"]
    assert data["catalog"]["title_trainee"]["price"] == 50


async def test_api_shop_buy_and_equip(client: TestClient):
    init = make_init_data(user_id=444)
    for i in range(12):
        await client.post("/api/lesson", json={"lesson_id": f"shop-lesson-{i}"}, headers={"x-init-data": init})
    resp = await client.get("/api/profile", headers={"x-init-data": init})
    profile = (await resp.json())["profile"]
    assert profile["coins"] >= 50
    resp = await client.post(
        "/api/shop/buy",
        json={"item_id": "title_trainee"},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["ok"] is True
    assert data["coins"] < profile["coins"]
    resp = await client.post(
        "/api/shop/equip",
        json={"item_id": "title_trainee"},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["ok"] is True


async def test_api_shop_not_enough_coins(client: TestClient):
    init = make_init_data(user_id=445)
    await client.post("/api/lesson", json={"lesson_id": "shop-lesson-1"}, headers={"x-init-data": init})
    resp = await client.post(
        "/api/shop/buy",
        json={"item_id": "title_legend"},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["ok"] is False
    assert "coins" in data.get("error", "")


async def test_api_admin_forbidden_for_non_admin(client: TestClient):
    init = make_init_data(user_id=99999)
    resp = await client.get("/api/admin/dashboard", headers={"x-init-data": init})
    assert resp.status == 403
    data = await resp.json()
    assert data["ok"] is False


async def test_rate_limit_blocks_burst(client: TestClient):
    from bot.web_server import RATE_MAX_ANON, _rate

    _rate.clear()
    blocked = 0
    for _ in range(RATE_MAX_ANON + 5):
        resp = await client.get("/api/content")
        if resp.status == 429:
            blocked += 1
    assert blocked > 0
