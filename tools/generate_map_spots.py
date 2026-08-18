"""Сгенерировать MAP_SPOTS и POSITIONS для всех карт из координат лайнапов.

Идемпотентно: данные mirage сохраняются как есть, для остальных карт
создаются точки по уникальным координатам лайнапов.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "bot" / "data"


def load(name: str) -> dict:
    path = DATA / f"{name}.json"
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}


def save(name: str, data: dict) -> None:
    (DATA / f"{name}.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8"
    )


def main() -> None:
    lineups = load("lineups")
    spots = load("map_spots")
    positions = load("positions")
    types = load("lineup_types")

    type_name = {}
    for tid, td in types.items():
        type_name[tid] = td.get("label") or tid

    for map_id, items in lineups.items():
        if map_id in spots and spots[map_id]:
            continue
        seen = {}
        generated = []
        for l in items:
            pos = l.get("pos")
            if not pos or len(pos) != 2:
                continue
            key = (round(pos[0], 1), round(pos[1], 1))
            if key in seen:
                continue
            seen[key] = True
            generated.append(
                {
                    "id": f"sp-{len(generated) + 1}",
                    "name": f"{type_name.get(l.get('type'), '')} · {l.get('title', '')}",
                    "x": key[0],
                    "y": key[1],
                    "videos": [],
                }
            )
        if generated:
            spots[map_id] = generated
            positions[map_id] = {s["id"]: [s["x"], s["y"]] for s in generated}

    save("map_spots", spots)
    save("positions", positions)
    print("maps with spots:", {k: len(v) for k, v in spots.items()})


if __name__ == "__main__":
    main()
