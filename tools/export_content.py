"""Экспорт контента из content.py в bot/data/*.json (data-driven).

Запуск из корня проекта:
    .venv\\Scripts\\python tools\\export_content.py

После экспорта данные живут в JSON-файлах, а значения в content.py
становятся фолбэком (используются, только если JSON отсутствует/битый).
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import bot.content as content  # noqa: E402
from bot.content_loader import SECTIONS  # noqa: E402


def main() -> None:
    data_dir = ROOT / "bot" / "data"
    data_dir.mkdir(exist_ok=True)
    for name, (fname, _) in SECTIONS.items():
        value = getattr(content, name)
        path = data_dir / fname
        path.write_text(
            json.dumps(value, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"exported {fname} ({len(value)} entries)")


if __name__ == "__main__":
    main()
