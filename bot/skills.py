"""Training skills, personal plan generation and recommendations.

План генерируется детерминированно на сервере из профиля пользователя:
слабость навыков, цель, доступное время. Хранение плана не требуется —
он пересчитывается при каждом запросе, статусы заданий — в training_sessions.
"""
from datetime import date

# Каталог навыков
SKILLS: dict[str, dict] = {
    "aim": {
        "icon": "🎯",
        "name": "Aim",
        "name_ru": "Прицеливание",
        "category": "aim",
        "desc_ru": "Флик, трекинг, реакция",
    },
    "spray": {
        "icon": "🔫",
        "name": "Spray Control",
        "name_ru": "Спрей",
        "category": "shooting",
        "desc_ru": "Контроль отдачи AK/M4",
    },
    "movement": {
        "icon": "🏃",
        "name": "Movement",
        "name_ru": "Движение",
        "category": "movement",
        "desc_ru": "Контр-страф, бхоп, пики",
    },
    "game_sense": {
        "icon": "🧠",
        "name": "Game Sense",
        "name_ru": "Игровое чутьё",
        "category": "game_sense",
        "desc_ru": "Позиции, тайминги, торговля",
    },
    "utility": {
        "icon": "💣",
        "name": "Utility",
        "name_ru": "Утилита",
        "category": "utility",
        "desc_ru": "Дымы, флешки, моли, заходы",
    },
}

# Задания по навыкам (en, ru)
TASKS: dict[str, list[tuple[str, str]]] = {
    "aim": [
        ("Aim Botz — flick shots", "Aim Botz — фликшоты"),
        ("Reflex Map — tracking", "Reflex Map — трекинг"),
        ("Fast Aim — target switching", "Fast Aim — смена целей"),
        ("Reaction time drill", "Дрилл реакции"),
    ],
    "spray": [
        ("Recoil Master — spray control", "Recoil Master — контроль спрея"),
        ("AK-47 spray pattern practice", "Отработка спрея AK-47"),
        ("Burst & tap drills", "Дриллы burst и tap"),
    ],
    "movement": [
        ("Bhop practice", "Практика бхопа"),
        ("Counter-strafe drills", "Дриллы контр-страфа"),
        ("Peek & prefire practice", "Практика пиков и префайра"),
    ],
    "game_sense": [
        ("Watch a pro demo (Mirage)", "Просмотр демки про-игрока (Mirage)"),
        ("Timing practice on Mirage", "Практика таймингов на Mirage"),
        ("Positioning & trade review", "Разбор позиционирования и торговли"),
    ],
    "utility": [
        ("Practice Mirage smokes", "Отработка дымов Mirage"),
        ("Flash & molly lineups", "Лайнапы флешек и моли"),
        ("Utility for Mirage executes", "Утилита для заходов на Mirage"),
    ],
}

# Настройки плана: сколько заданий при каком времени
PLAN_SIZE = {15: 3, 30: 4, 45: 5, 60: 6}

# Вклад цели в распределение заданий: goal -> вес навыка
GOAL_WEIGHTS: dict[str, dict[str, int]] = {
    "aim": {"aim": 3, "spray": 2, "movement": 1, "game_sense": 1, "utility": 1},
    "utility": {"utility": 3, "aim": 1, "spray": 1, "game_sense": 2, "movement": 1},
    "game_sense": {"game_sense": 3, "utility": 1, "aim": 1, "spray": 1, "movement": 1},
    "movement": {"movement": 3, "aim": 2, "spray": 1, "game_sense": 1, "utility": 1},
    "faceit10": {"aim": 2, "utility": 2, "game_sense": 2, "spray": 1, "movement": 1},
}

DEFAULT_WEIGHTS = {"aim": 1, "spray": 1, "movement": 1, "game_sense": 1, "utility": 1}

# Длительность задания в минутах (всего сумма = training_minutes)
TASK_MINUTES = {
    3: [8, 5, 2],
    4: [10, 8, 7, 5],
    5: [10, 10, 10, 10, 5],
    6: [10, 10, 10, 10, 10, 10],
}

XP_TRAINING = 5
COIN_TRAINING = 1
SKILL_POINTS_PER_TASK = 5
SKILL_CAP = 100


def plan_tasks(training_minutes: int, goal: str, weakest: str) -> list[dict]:
    """Генерирует задания плана на день. Возвращает список task dict."""
    minutes = training_minutes if training_minutes in PLAN_SIZE else 30
    size = PLAN_SIZE[minutes]
    weights = dict(GOAL_WEIGHTS.get(goal, DEFAULT_WEIGHTS))

    # Слабейший навык — всегда первым заданием (минимум 1 вклад)
    weights[weakest] = max(weights.get(weakest, 1), 3)

    # Распределяем задания по навыкам пропорционально весам
    total_weight = sum(weights.values())
    slots: list[str] = []
    for skill, w in sorted(weights.items(), key=lambda kv: -kv[1]):
        slots.extend([skill] * round(size * w / total_weight))
    slots = (slots[:size] + list(weights.keys()))[:size]

    minutes_map = TASK_MINUTES[size]
    tasks = []
    used = {s: 0 for s in SKILLS}
    for i, skill in enumerate(slots):
        pool = TASKS.get(skill, TASKS["aim"])
        task_idx = used[skill] % len(pool)
        used[skill] += 1
        en, ru = pool[task_idx]
        tasks.append({
            "task_id": f"{skill}-{date.today().isoformat()}-{i}",
            "skill_id": skill,
            "title": en,
            "title_ru": ru,
            "duration_min": minutes_map[i] if i < len(minutes_map) else 5,
        })
    return tasks


def weakest_skill(skills: dict[str, int]) -> str:
    """Навык с минимальным уровнем (по умолчанию aim)."""
    if not skills:
        return "aim"
    return min(skills, key=lambda s: skills.get(s, 0))


def recommendation(weak: str, skills: dict[str, int]) -> dict:
    s = SKILLS.get(weak, SKILLS["aim"])
    level = skills.get(weak, 0)
    next_steps = TASKS.get(weak, TASKS["aim"])[:2]
    return {
        "skill_id": weak,
        "name": s["name"],
        "name_ru": s["name_ru"],
        "icon": s["icon"],
        "level": level,
        "text_ru": f"Тебе стоит потренировать {s['name_ru'].lower()}. Начни с: {next_steps[0][1]}, {next_steps[1][1]}.",
        "text_en": f"Time to work on {s['name']}. Start with: {next_steps[0][0]}, {next_steps[1][0]}.",
    }
