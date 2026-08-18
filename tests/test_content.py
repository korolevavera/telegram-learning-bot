from bot.content import (
    CARDS,
    LESSONS,
    LINEUPS,
    LINEUP_TYPES,
    MAPS,
    MAP_SPOTS,
    POSITIONS,
    QUIZZES,
    ROLES,
    TACTICS,
    TERMS,
    DIFFICULTY,
    flatten_tactics,
)

VALID_ROUNDS = {"pistol", "eco", "force", "full"}
VALID_SIDES = {"t", "ct"}
VALID_UTIL = {"smoke", "flash", "molotov", "grenade"}


def _tactic_ids():
    ids = []
    for map_data in TACTICS.values():
        for side in VALID_SIDES:
            rounds = map_data.get(side, {}) if isinstance(map_data, dict) else {}
            if isinstance(rounds, dict):
                for round_key in VALID_ROUNDS:
                    for tactic in rounds.get(round_key, []):
                        ids.append(tactic["id"])
            else:
                for tactic in rounds:
                    ids.append(tactic["id"])
    return ids


def test_lessons_have_required_fields():
    for lesson in LESSONS:
        assert lesson["id"]
        assert lesson["title"]
        assert lesson["sections"]
        assert lesson["questions"]


def test_cards_have_front_and_back():
    for card in CARDS:
        assert card["front"]
        assert card["back"]


def test_quizzes_have_valid_questions():
    for quiz in QUIZZES:
        assert quiz["id"]
        assert quiz["title"]
        assert quiz["questions"]
        for question in quiz["questions"]:
            assert question["q"]
            assert len(question["options"]) >= 2
            assert 0 <= question["answer"] < len(question["options"])


def test_maps_unique_ids():
    ids = [m["id"] for m in MAPS]
    assert len(ids) == len(set(ids))


def test_maps_have_required_fields():
    for m in MAPS:
        assert m["id"]
        assert m["name"]
        assert m["image"]
        assert m["radar"]


def test_lineup_types_and_roles():
    for type_id in LINEUP_TYPES:
        assert LINEUP_TYPES[type_id]["label"]
        assert LINEUP_TYPES[type_id]["emoji"]
    for role_id in ROLES:
        assert ROLES[role_id]["ru"]
        assert ROLES[role_id]["emoji"]


def test_lineups_well_formed():
    for map_id, lineups in LINEUPS.items():
        assert map_id in {m["id"] for m in MAPS}
        for lineup in lineups:
            assert lineup["id"]
            assert lineup["title"]
            assert lineup.get("type") in VALID_UTIL or lineup.get("type") == "default"
            assert lineup["steps"]


def test_tactics_structure():
    for map_id, map_data in TACTICS.items():
        assert map_id in {m["id"] for m in MAPS}
        assert isinstance(map_data, dict)
        for side in VALID_SIDES:
            rounds = map_data.get(side, {})
            assert isinstance(rounds, dict)
            for round_key in VALID_ROUNDS:
                for tactic in rounds.get(round_key, []):
                    assert tactic["id"]
                    assert tactic["title"]
                    assert tactic.get("icon")
                    assert tactic.get("buy")
                    assert tactic.get("goal")
                    assert tactic.get("steps") or tactic.get("phases")


def test_tactic_ids_unique():
    ids = _tactic_ids()
    assert len(ids) == len(set(ids)), "дублирующиеся id тактик"


def test_flatten_tactics_counts():
    for map_id in TACTICS:
        flat = flatten_tactics(map_id)
        assert isinstance(flat, list)
        assert len(flat) == len(_tactic_ids_for(map_id))


def _tactic_ids_for(map_id):
    data = TACTICS.get(map_id)
    out = []
    if isinstance(data, dict):
        for side in VALID_SIDES:
            for round_key in VALID_ROUNDS:
                out.extend(t["id"] for t in data.get(side, {}).get(round_key, []))
    else:
        out.extend(t["id"] for t in data)
    return out


def test_positions_well_formed():
    for map_id, positions in POSITIONS.items():
        for name, pos in positions.items():
            assert len(pos) == 2, f"{map_id}:{name}"
            assert all(isinstance(v, (int, float)) for v in pos)


def test_map_spots_well_formed():
    for map_id, spots in MAP_SPOTS.items():
        for spot in spots:
            assert spot["id"]
            assert spot["name"]
            assert 0 <= spot["x"] <= 100
            assert 0 <= spot["y"] <= 100


def test_terms_well_formed():
    for map_id, terms in TERMS.items():
        for name, term in terms.items():
            assert term["name"]
            assert term["desc"]
            assert "pos" in term


def test_difficulty_levels():
    assert set(DIFFICULTY.keys()) == {1, 2, 3}
    for level in DIFFICULTY.values():
        assert level["ru"]
        assert level["en"]
