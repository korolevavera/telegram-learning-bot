import time

from aiohttp.test_utils import TestClient
from bot.games import GAMES, daily_game
from tests.conftest import make_init_data

TODAY_YD = time.localtime().tm_yday


async def test_games_list_has_new_games(client: TestClient):
    resp = await client.get("/api/games")
    data = await resp.json()
    for gid in ("reaction", "aim", "whosaid", "guessmap"):
        assert gid in data["games"]
        kind = data["games"][gid]["kind"]
        assert kind in ("quiz", "reaction", "aim")
        if kind == "quiz":
            assert len(data["games"][gid]["questions"]) >= 5


async def test_daily_requires_auth(client: TestClient):
    resp = await client.get("/api/games/daily")
    assert resp.status == 401


async def test_daily_returns_game(client: TestClient):
    init = make_init_data(user_id=9101)
    resp = await client.get("/api/games/daily", headers={"x-init-data": init})
    data = await resp.json()
    assert data["ok"] is True
    assert data["game"]["id"] == daily_game(TODAY_YD)
    assert data["completed"] is False
    assert data["date"]


async def test_daily_completed_flag_and_bonus(client: TestClient):
    init = make_init_data(user_id=9102)
    gid = daily_game(TODAY_YD)
    game = GAMES[gid]
    rule = {
        "callouts": (20, 30), "utility": (10, 15), "economy": (5, 10),
        "reaction": (5, 5), "aim": (15, 15), "whosaid": (10, 12), "guessmap": (8, 10),
    }[gid]
    score, total = rule
    duration = (total * 2000) if game["kind"] == "quiz" else (total * 600)
    resp = await client.post(
        "/api/games/submit",
        json={"game_id": gid, "score": score, "total": total, "duration_ms": duration},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["ok"] is True
    assert data["daily_bonus"] is True
    assert data["rewarded"] is True
    xp1 = data["profile"]["xp"]
    resp = await client.get("/api/games/daily", headers={"x-init-data": init})
    assert (await resp.json())["completed"] is True
    resp = await client.post(
        "/api/games/submit",
        json={"game_id": gid, "score": score, "total": total, "duration_ms": duration + 1},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["daily_bonus"] is False
    assert data["rewarded"] is True  # кап 3 награды в день ещё не исчерпан
    assert data["profile"]["xp"] == xp1 + 10  # обычная награда, но не daily-бонус


async def test_reaction_game_anticheat(client: TestClient):
    init = make_init_data(user_id=9103)
    resp = await client.post(
        "/api/games/submit",
        json={"game_id": "reaction", "score": 5, "total": 5, "duration_ms": 100},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["ok"] is False


async def test_aim_game_anticheat_too_fast(client: TestClient):
    init = make_init_data(user_id=9104)
    resp = await client.post(
        "/api/games/submit",
        json={"game_id": "aim", "score": 15, "total": 15, "duration_ms": 500},
        headers={"x-init-data": init},
    )
    data = await resp.json()
    assert data["ok"] is False


async def test_whosaid_and_guessmap_valid(client: TestClient):
    init = make_init_data(user_id=9105)
    for gid, score, total, duration in (
        ("whosaid", 9, 12, 30_000),
        ("guessmap", 7, 10, 25_000),
    ):
        resp = await client.post(
            "/api/games/submit",
            json={"game_id": gid, "score": score, "total": total, "duration_ms": duration},
            headers={"x-init-data": init},
        )
        data = await resp.json()
        assert data["ok"] is True
        assert data["rewarded"] is True