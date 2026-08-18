import json
import sys
from pathlib import Path

path = Path(__file__).resolve().parent.parent / "bot" / "data" / "lineups.json"
data = json.loads(path.read_text(encoding="utf-8"))

SIDE_SITE = {
    "mi-window": ("T", "Mid"),
    "mi-ct": ("T", "A"),
    "mi-jungle": ("T", "A"),
    "mi-stairs": ("T", "A"),
    "mi-oneway": ("CT", "A"),
    "mi-under": ("T", "B"),
    "d2-xbox": ("T", "Mid"),
    "d2-long": ("T", "A"),
    "d2-bwindow": ("T", "B"),
    "d2-goose": ("T", "A"),
    "d2-oneway": ("CT", "Mid"),
    "d2-ctspawn": ("T", "A"),
    "in-banana": ("T", "B"),
    "in-ct": ("T", "A"),
    "in-coffins": ("T", "B"),
    "in-topmid": ("T", "Mid"),
    "in-oneway": ("CT", "B"),
    "in-lib": ("T", "B"),
    "nu-outside": ("T", "Outside"),
    "nu-secret": ("T", "B"),
    "nu-ramp": ("T", "A"),
    "nu-oneway": ("CT", "A"),
    "an-mid": ("T", "Mid"),
    "an-a": ("T", "A"),
    "an-b": ("T", "B"),
    "an-oneway": ("CT", "B"),
    "ov-monster": ("T", "A"),
    "ov-a": ("T", "A"),
    "ov-bshort": ("T", "B"),
    "ov-oneway": ("CT", "A"),
    "anb-mid": ("T", "Mid"),
    "anb-a": ("T", "A"),
    "anb-b": ("T", "B"),
    "ve-aramp": ("T", "A"),
    "ve-b": ("T", "B"),
    "ve-a": ("T", "A"),
    "tr-ladder": ("T", "A"),
    "tr-ivy": ("T", "B"),
    "tr-amain": ("T", "A"),
    "ca-mid": ("T", "Mid"),
    "ca-a": ("T", "A"),
    "ca-b": ("T", "B"),
}

count = 0
for map_id, lineups in data.items():
    for lu in lineups:
        lid = lu.get("id", "")
        side, site = SIDE_SITE.get(lid, ("T", "A"))
        lu.setdefault("side", side)
        lu.setdefault("site", site)
        if "difficulty" not in lu:
            if "one-way" in lu.get("title", "").lower() or "oneway" in lid:
                lu["difficulty"] = 3
            elif len(lu.get("steps", [])) >= 4:
                lu["difficulty"] = 2
            else:
                lu["difficulty"] = 1
        count += 1

path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"enriched {count} grenades in {path.name}")
