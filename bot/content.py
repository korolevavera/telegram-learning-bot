"""Контент бота: уроки, карточки, тесты.

Этот файл можно редактировать без знания программирования.
Всё содержимое задаётся обычными списками и словарями.
"""

# ============================================================
# УРОКИ
# ============================================================
# Каждый урок — словарь с полями:
#   "id"        — уникальный короткий идентификатор (латиницей)
#   "title"     — название урока
#   "sections"  — список текстовых разделов (строк), каждый показывается отдельным сообщением
#   "questions" — список вопросов в конце урока.
#                 Вопрос: {"q": "текст вопроса", "a": "правильный ответ"}
#
# Бот запоминает, на каком уроке остановился пользователь, и умеет
# возвращаться к последнему непройденному разделу.

LESSONS = [
    {
        "id": "lesson_1",
        "title": "Урок 1. Основы игры в CS2",
        "sections": [
            "🎯 Добро пожаловать в обучение Counter-Strike 2!\n\n"
            "В чём суть игры:\n"
            "- Матч идёт до 13 побед (MR12).\n"
            "- Две команды: спецназ (CT) и террористы (T).\n"
            "- На точках (site) террористы закладывают бомбу, спецназ её обезвреживает.",
            "Раунды:\n"
            "- T побеждают, если заложили бомбу и она взорвалась, ИЛИ если выбили всех CT.\n"
            "- CT побеждают, если обезвредили бомбу, ИЛИ если выбили всех T до закладки.\n"
            "- Победа = убрали всех противников или выполнили свою задачу.",
            "Важное правило: если умер — смотришь за тиммейтами (spectator) и передаёшь инфу по микрофону. "
            "Инфа решает исходы раундов!",
        ],
        "questions": [
            {"q": "До скольких побед идёт матч?", "a": "13"},
            {"q": "Кто закладывает бомбу?", "a": "террористы"},
            {"q": "Что нужно сделать CT, если бомба уже заложена?", "a": "обезвредить"},
        ],
    },
    {
        "id": "lesson_2",
        "title": "Урок 2. Экономика",
        "sections": [
            "💰 Деньги решают!\n\n"
            "- За победу дают $3250, за проигрыш — $1400 (и больше, если у вас серия поражений).\n"
            "- За выбитый хедшот — доплата $100.\n"
            "- Деньги копятся между раундами.",
            "Виды раундов по экономике:\n"
            "- Eco — почти ничего не покупаем, копим на следующий раунд.\n"
            "- Force buy (форс) — тратим всё, даже когда денег мало.\n"
            "- Half buy — покупаем частично (пистолет-пулемёт или дым + флешки).\n"
            "- Full buy — полная закупка на $4700+.",
            "Правило тиммейтов: вся команда ходит в одну экономику вместе. "
            "Если один купил AWP, а остальные — eco, это проигрышный раунд. "
            "Покупаем вместе!",
        ],
        "questions": [
            {"q": "Сколько дают за победу в раунде?", "a": "3250"},
            {"q": "Что такое eco?", "a": "раунд без покупок"},
            {"q": "Сколько нужно денег на full buy?", "a": "4700"},
        ],
    },
    {
        "id": "lesson_3",
        "title": "Урок 3. Оружие",
        "sections": [
            "🔫 Базовое оружие и когда его брать:\n\n"
            "- USP-S / Glock — стартовые пистолеты, точны на ближней дистанции.\n"
            "- MP9 / MP7 — дешёвые пистолеты-пулемёты, хороши на форсе.\n"
            "- AK-47 ($2700) — главная винтовка T, убивает с 1 выстрела в голову.\n"
            "- M4A4/M4A1-S ($3100/$2900) — винтовки CT, точные, но урон ниже AK.\n"
            "- AWP ($4750) — снайперка, убивает с одного выстрела в тело.",
            "Советы по покупке:\n"
            "- AK/M4 — база любого фулл-бая.\n"
            "- AWP — только если уверенно играешь и есть $4750.\n"
            "- Броня + шлем обязательны в фулл-бае, без них тебя перестреляют.",
            "Про оружие из гранат:\n"
            "- Дым (Smoke) — закрывает обзор, обязателен для захода на сайт.\n"
            "- Флешка (Flash) — ослепляет врагов. Бросай её, заходя в угол!\n"
            "- Молотов (Molotov) — выживает противников с позиции.",
        ],
        "questions": [
            {"q": "Сколько стоит AK-47?", "a": "2700"},
            {"q": "Какая винтовка убивает с одного выстрела в голову?", "a": "ak-47"},
            {"q": "Сколько стоит AWP?", "a": "4750"},
        ],
    },
    {
        "id": "lesson_4",
        "title": "Урок 4. Тактика и движение",
        "sections": [
            "🧠 Базовые понятия:\n\n"
            "- Site — точка закладки бомбы (A или B).\n"
            "- Entry — первый игрок захода, идёт первым и держит фокус врагов.\n"
            "- Trade — напарник заходит за тобой и добивает того, кто тебя убил.\n"
            "- Utility — гранаты, их нужно тратить до захода, а не в руках.",
            "Как заходить на сайт:\n"
            "1. Брось дым, чтобы закрыть главный угол.\n"
            "2. Кидай флешку перед заходом.\n"
            "3. Entry заходит первым, за ним — трейдеры.\n"
            "4. Закладывай бомбу и занимай позицию для удержания.",
            "Движение:\n"
            "- Не бегай с AK — точность стрельбы на ходу почти нулевая.\n"
            "- Остановись (или crouch) в момент выстрела.\n"
            "- Peek — коротко выгляни из-за угла, выстрели, вернись. Не выбегай в открытую.",
        ],
        "questions": [
            {"q": "Что такое site?", "a": "точка закладки бомбы"},
            {"q": "Что такое trade?", "a": "добить убийцу напарника"},
            {"q": "Кто такой entry?", "a": "первый игрок захода"},
        ],
    },
]

# ============================================================
# КАРТОЧКИ (термин → значение)
# ============================================================
# Просто список пар "front" (что показываем) → "back" (ответ).
# Бот показывает карточку, пользователь сам мысленно отвечает
# и жмёт «Показать ответ», затем «Знаю» / «Не знаю».
# Карточки, помеченные «Знаю», больше не показываются.

CARDS = [
    {"front": "Eco", "back": "Раунд без покупок — копим деньги"},
    {"front": "Force buy", "back": "Тратим все деньги, даже если их мало"},
    {"front": "Full buy", "back": "Полная закупка от $4700"},
    {"front": "Half buy", "back": "Частичная закупка (пп + дым/флешки)"},
    {"front": "Site", "back": "Точка закладки бомбы (A или B)"},
    {"front": "Entry", "back": "Первый игрок захода, идёт первым"},
    {"front": "Trade", "back": "Напарник добивает убийцу entry"},
    {"front": "Clutch", "back": "Ситуация 1 против нескольких противников"},
    {"front": "Peek", "back": "Короткий выход из-за угла для выстрела"},
    {"front": "Spray", "back": "Стрельба очередью на средней дистанции"},
    {"front": "Wallbang", "back": "Стрельба сквозь стену по известной позиции"},
    {"front": "Flash", "back": "Светошумовая граната — ослепляет врагов"},
    {"front": "Smoke", "back": "Дымовая граната — закрывает обзор"},
    {"front": "Molotov", "back": "Зажигательная — выжигает позиции"},
    {"front": "Utility", "back": "Гранаты: флешки, дымы, молотовы, гейзы"},
    {"front": "MR12", "back": "Матч до 12 побед одной команды"},
]

# ============================================================
# ТЕСТЫ (викторины со счётом)
# ============================================================
# Каждый тест — словарь:
#   "id"    — уникальный идентификатор
#   "title" — название теста
#   "questions" — список вопросов:
#       {"q": "текст", "options": ["вариант 1", "вариант 2", ...], "answer": 0}
#       answer — индекс правильного варианта (считается с нуля!).

QUIZZES = [
    {
        "id": "quiz_1",
        "title": "Тест: Экономика",
        "questions": [
            {
                "q": "Что такое eco?",
                "options": ["Раунд без покупок", "Полная закупка", "Покупка AWP"],
                "answer": 0,
            },
            {
                "q": "Сколько нужно денег на full buy?",
                "options": ["$2700", "$4700", "$1400"],
                "answer": 1,
            },
            {
                "q": "За победу дают...",
                "options": ["$1400", "$3250", "$4750"],
                "answer": 1,
            },
            {
                "q": "Когда идём в force buy?",
                "options": ["Когда у всей команды много денег", "Когда денег мало, но нужен этот раунд", "Только после клатча"],
                "answer": 1,
            },
        ],
    },
    {
        "id": "quiz_2",
        "title": "Тест: Оружие",
        "questions": [
            {
                "q": "Какая винтовка убивает с одного выстрела в голову?",
                "options": ["M4A4", "AK-47", "MP9"],
                "answer": 1,
            },
            {
                "q": "Сколько стоит AWP?",
                "options": ["$2700", "$4750", "$3100"],
                "answer": 1,
            },
            {
                "q": "Что лучше купить на форсе?",
                "options": ["AK-47", "Пистолет-пулемёт", "Гранату"],
                "answer": 1,
            },
            {
                "q": "Что обязательно в полной закупке?",
                "options": ["AWP", "Броня + шлем", "Два дыма"],
                "answer": 1,
            },
        ],
    },
    {
        "id": "quiz_3",
        "title": "Тест: Тактика",
        "questions": [
            {
                "q": "Кто такой entry?",
                "options": ["Игрок с AWP", "Первый игрок захода", "Игрок, который держит тыл"],
                "answer": 1,
            },
            {
                "q": "Что такое trade kill?",
                "options": ["Убийство в спину", "Добивание убийцы напарника", "Убийство с одного патрона"],
                "answer": 1,
            },
            {
                "q": "Что делает дым при заходе на сайт?",
                "options": ["Ослепляет врагов", "Закрывает обзор позиций", "Наносит урон"],
                "answer": 1,
            },
            {
                "q": "Что такое clutch?",
                "options": ["Раунд без покупок", "Ситуация 1 против нескольких", "Матч до 12 побед"],
                "answer": 1,
            },
        ],
    },
]

# ============================================================
# ГАЙДЫ: карты и раскидки (как в CSMentor)
# ============================================================
# MAPS — список карт:
#   "id"    — короткий идентификатор (латиницей)
#   "name"  — название карты
#   "image" — файл картинки карты из bot/webapp/maps/ (для Mini App)
#   "emoji" — эмодзи карты (для кнопок в боте)
#
# LINEUPS — раскидки по картам. Ключ = id карты, значение — список раскидок:
#   "id"    — уникальный идентификатор раскидки
#   "title" — название (что бросаем и куда)
#   "type"  — тип: smoke / flash / molotov / grenade (см. LINEUP_TYPES)
#   "steps" — пошаговая инструкция (каждый шаг — строка)

MAPS = [
    {"id": "dust2", "name": "Dust II", "image": "dust2.jpg", "radar": "dust2.png", "emoji": "🏜️"},
    {"id": "mirage", "name": "Mirage", "image": "mirage.jpg", "radar": "mirage.png", "emoji": "🕌"},
    {"id": "inferno", "name": "Inferno", "image": "inferno.jpg", "radar": "inferno.png", "emoji": "🔥"},
    {"id": "nuke", "name": "Nuke", "image": "nuke.jpg", "radar": "nuke.png", "emoji": "☢️"},
    {"id": "ancient", "name": "Ancient", "image": "ancient.jpg", "radar": "ancient.png", "emoji": "🏛️"},
    {"id": "overpass", "name": "Overpass", "image": "overpass.jpg", "radar": "overpass.png", "emoji": "🌉"},
    {"id": "anubis", "name": "Anubis", "image": "anubis.jpg", "radar": "anubis.png", "emoji": "🐫"},
    {"id": "vertigo", "name": "Vertigo", "image": "vertigo.jpg", "radar": "vertigo.png", "emoji": "🏢"},
    {"id": "train", "name": "Train", "image": "train.jpg", "radar": "train.png", "emoji": "🚂"},
    {"id": "cache", "name": "Cache", "image": "cache.jpg", "radar": "cache.png", "emoji": "📦"},
]

LINEUP_TYPES = {
    "smoke": {"label": "Смок", "emoji": "💨"},
    "flash": {"label": "Флешка", "emoji": "✨"},
    "molotov": {"label": "Молотов", "emoji": "🔥"},
    "grenade": {"label": "Граната", "emoji": "💣"},
}

LINEUPS = {
    "mirage": [
        {
            "id": "mi-window",
            "pos": [24, 30],
            "type": "smoke",
            "title": "Дым на окно mid",
            "steps": [
                "Встаньте в T ramp вплотную к левой стене.",
                "Прицельтесь в правый край окна и зажмите ЛКМ.",
                "Прыгните и бросьте (jump-throw).",
                "Дым встаёт на окне — AWP в mid больше не видит вас.",
            ],
        },
        {
            "id": "mi-ct",
            "pos": [16, 14],
            "type": "smoke",
            "title": "Дым на CT для захода A",
            "steps": [
                "Встаньте у правой стены T spawn.",
                "Направьте прицел в верхнюю часть дальних строений.",
                "Бросок с прыжком (jump-throw) левой кнопкой.",
                "Дым закрывает CT — безопасный выход на A site.",
            ],
        },
        {
            "id": "mi-jungle",
            "pos": [14, 18],
            "type": "smoke",
            "title": "Дым на Jungle",
            "steps": [
                "Встаньте слева в T spawn.",
                "Прицельтесь в верхушку пальмы и бросьте влево одним нажатием.",
                "Дым встаёт на Jungle, перекрывая ретекейт с CT.",
            ],
        },
        {
            "id": "mi-stairs",
            "pos": [26, 34],
            "type": "molotov",
            "title": "Молотов на лестницу A",
            "steps": [
                "Подойдите к левой стене T ramp.",
                "Зажмите ЛКМ, прицелившись в угол крыши.",
                "Молотов выжигает игрока на лестнице A site.",
            ],
        },
        {
            "id": "mi-oneway",
            "pos": [60, 62],
            "type": "smoke",
            "title": "One-way на A (лестница)",
            "steps": [
                "Встаньте в Jungle.",
                "Киньте дым в угол у лестницы A.",
                "Встаньте за дымом со стороны сайта — видите всех, кто идёт через stairs.",
            ],
        },
        {
            "id": "mi-under",
            "pos": [34, 66],
            "type": "smoke",
            "title": "Дым на underpass B",
            "steps": [
                "Встаньте у входа в апартаменты.",
                "Прицельтесь в край окна на втором этаже.",
                "Бросок с шагом вперёд (one-step throw).",
                "Дым перекрывает underpass — атака B безопаснее.",
            ],
        },
    ],
    "dust2": [
        {
            "id": "d2-xbox",
            "pos": [18, 18],
            "type": "smoke",
            "title": "Дым на Xbox (mid)",
            "steps": [
                "Встаньте у правой стены T spawn.",
                "Прицельтесь в вершину башни mid.",
                "Прыжок-бросок левой кнопкой.",
                "Дым встаёт на Xbox, перекрывая AWP на mid.",
            ],
        },
        {
            "id": "d2-long",
            "pos": [20, 64],
            "type": "smoke",
            "title": "Дым на Long",
            "steps": [
                "Встаньте у правого угла Long doors.",
                "Прицельтесь в лист/метку на стене.",
                "Бросок с прыжком.",
                "Дым закрывает Long — безопасный переход через двери.",
            ],
        },
        {
            "id": "d2-bwindow",
            "pos": [46, 40],
            "type": "smoke",
            "title": "Дым на окно B",
            "steps": [
                "Встаньте у стены в B tunnels.",
                "Прицельтесь в левый верхний угол проёма.",
                "Одиночный бросок ЛКМ.",
                "Дым перекрывает окно — B site можно брать без пик-атаки.",
            ],
        },
        {
            "id": "d2-goose",
            "pos": [24, 70],
            "type": "molotov",
            "title": "Молотов на Goose (A)",
            "steps": [
                "Встаньте у Long doors.",
                "Прицельтесь в правую часть сайта A.",
                "Молотов выжигает позицию Goose.",
            ],
        },
        {
            "id": "d2-oneway",
            "pos": [40, 30],
            "type": "smoke",
            "title": "One-way на mid",
            "steps": [
                "Встаньте в Catwalk (Short).",
                "Киньте дым в угол у mid doors со стороны CT.",
                "Встаньте за дымом — видите противника, пока он вас нет.",
            ],
        },
        {
            "id": "d2-ctspawn",
            "pos": [14, 12],
            "type": "smoke",
            "title": "Дым на CT spawn (A take)",
            "steps": [
                "Встаньте у T spawn, левый угол.",
                "Прицельтесь в верхнюю часть крыши.",
                "Jump-throw.",
                "Дым закрывает CT — быстрый заход на A.",
            ],
        },
    ],
    "inferno": [
        {
            "id": "in-banana",
            "pos": [50, 64],
            "type": "smoke",
            "title": "Дым на Banana",
            "steps": [
                "Встаньте у угла на Banana за первым ящиком.",
                "Прицельтесь в край стены наверху.",
                "Одиночный бросок ЛКМ.",
                "Дым перекрывает Banana — контроль коридора.",
            ],
        },
        {
            "id": "in-ct",
            "pos": [28, 46],
            "type": "smoke",
            "title": "Дым на CT (A take)",
            "steps": [
                "Встаньте под аркой (Arch).",
                "Прицельтесь в верхний край стены CT.",
                "Бросок с шагом вперёд.",
                "Дым закрывает CT — заход на A site.",
            ],
        },
        {
            "id": "in-coffins",
            "pos": [46, 68],
            "type": "molotov",
            "title": "Молотов на Coffins",
            "steps": [
                "Встаньте на Banana, за углом.",
                "Зажмите ЛКМ и прицельтесь в верхний край стены над B.",
                "Молотов выжигает позицию Coffins.",
            ],
        },
        {
            "id": "in-topmid",
            "pos": [36, 34],
            "type": "smoke",
            "title": "Дым на Top Mid",
            "steps": [
                "Встаньте у входа в mid.",
                "Прицельтесь в верхнюю часть центра.",
                "Jump-throw.",
                "Дым перекрывает Top Mid для быстрого контроля.",
            ],
        },
        {
            "id": "in-oneway",
            "pos": [44, 60],
            "type": "smoke",
            "title": "One-way на Banana",
            "steps": [
                "Встаньте за углом Banana.",
                "Киньте дым под стены в начале Banana.",
                "Встаньте за дымом — противник на Banana не видит вас, вы видите его.",
            ],
        },
        {
            "id": "in-lib",
            "pos": [58, 50],
            "type": "molotov",
            "title": "Молотов на Library (B)",
            "steps": [
                "Встаньте у входа в апартаменты.",
                "Зажмите ЛКМ, прицельтесь в край крыши.",
                "Молотов выжигает Library — чистая B site.",
            ],
        },
    ],
    "nuke": [
        {
            "id": "nu-outside",
            "pos": [18, 56],
            "type": "smoke",
            "title": "Дым на outside",
            "steps": [
                "Встаньте у outside doors.",
                "Прицельтесь в верхний край здания напротив.",
                "Jump-throw.",
                "Дым перекрывает outside — выход из дверей.",
            ],
        },
        {
            "id": "nu-secret",
            "pos": [46, 44],
            "type": "molotov",
            "title": "Молотов на Secret",
            "steps": [
                "Встаньте на рампе к B.",
                "Прицельтесь в дальнюю стену secret.",
                "Зажим ЛКМ + бросок.",
                "Молотов выжигает позицию Secret.",
            ],
        },
        {
            "id": "nu-ramp",
            "pos": [42, 36],
            "type": "molotov",
            "title": "Молотов на A ramp",
            "steps": [
                "Встаньте наверху рампы.",
                "Прицельтесь в угол возле сайта A.",
                "Молотов очищает ramp для захода.",
            ],
        },
        {
            "id": "nu-oneway",
            "pos": [36, 30],
            "type": "smoke",
            "title": "One-way на A (hut)",
            "steps": [
                "Встаньте в hut.",
                "Киньте дым в проём на A site.",
                "Стойте за дымом — видите ramp, вас — нет.",
            ],
        },
    ],
    "ancient": [
        {
            "id": "an-mid",
            "pos": [32, 36],
            "type": "smoke",
            "title": "Дым на mid",
            "steps": [
                "Встаньте у левой стены T mid.",
                "Прицельтесь в верхнюю часть стены.",
                "Jump-throw.",
                "Дым перекрывает mid window.",
            ],
        },
        {
            "id": "an-a",
            "pos": [62, 60],
            "type": "molotov",
            "title": "Молотов на A site",
            "steps": [
                "Встаньте на A main.",
                "Зажмите ЛКМ и прицельтесь в дальний угол сайта.",
                "Молотов выжигает default-позицию.",
            ],
        },
        {
            "id": "an-b",
            "pos": [38, 70],
            "type": "smoke",
            "title": "Дым на B (cave)",
            "steps": [
                "Встаньте у B main.",
                "Прицельтесь в верхнюю часть входа.",
                "Бросок ЛКМ.",
                "Дым закрывает cave и ретекейт с mid.",
            ],
        },
        {
            "id": "an-oneway",
            "pos": [42, 66],
            "type": "smoke",
            "title": "One-way на B",
            "steps": [
                "Встаньте у входа в B.",
                "Киньте дым в угол у сайта.",
                "Встаньте за ним — контролируете B main.",
            ],
        },
    ],
    "overpass": [
        {
            "id": "ov-monster",
            "pos": [32, 34],
            "type": "smoke",
            "title": "Дым на Monster",
            "steps": [
                "Встаньте в T mid.",
                "Прицельтесь в край балкона.",
                "Jump-throw.",
                "Дым закрывает Monster для A split.",
            ],
        },
        {
            "id": "ov-a",
            "pos": [46, 52],
            "type": "molotov",
            "title": "Молотов на A site",
            "steps": [
                "Встаньте в connector.",
                "Зажмите ЛКМ, прицельтесь в дальний угол сайта.",
                "Молотов выжигает default за A.",
            ],
        },
        {
            "id": "ov-bshort",
            "pos": [56, 62],
            "type": "smoke",
            "title": "Дым на B short",
            "steps": [
                "Встаньте у B main.",
                "Прицельтесь в верхнюю часть стены.",
                "Бросок ЛКМ.",
                "Дым перекрывает B short.",
            ],
        },
        {
            "id": "ov-oneway",
            "pos": [52, 58],
            "type": "smoke",
            "title": "One-way на A (construction)",
            "steps": [
                "Встаньте в construction.",
                "Киньте дым в угол у A site.",
                "Встаньте за дымом — контролируете заход.",
            ],
        },
    ],
    "anubis": [
        {
            "id": "anb-mid",
            "pos": [36, 36],
            "type": "smoke",
            "title": "Дым на mid",
            "steps": [
                "Встаньте в T mid.",
                "Прицельтесь в верхнюю часть центральной стены.",
                "Jump-throw.",
                "Дым перекрывает mid для контроля.",
            ],
        },
        {
            "id": "anb-a",
            "pos": [62, 64],
            "type": "molotov",
            "title": "Молотов на A site",
            "steps": [
                "Встаньте на A main.",
                "Зажмите ЛКМ, прицельтесь в угол сайта.",
                "Молотов выжигает default-позицию.",
            ],
        },
        {
            "id": "anb-b",
            "pos": [40, 68],
            "type": "smoke",
            "title": "Дым на B",
            "steps": [
                "Встаньте у B main.",
                "Прицельтесь в верхнюю часть проёма.",
                "Бросок ЛКМ.",
                "Дым закрывает ретекейт с mid на B.",
            ],
        },
    ],
    "vertigo": [
        {
            "id": "ve-aramp",
            "pos": [52, 40],
            "type": "smoke",
            "title": "Дым на A ramp",
            "steps": [
                "Встаньте у входа на рампу A.",
                "Прицельтесь в верхний край стены.",
                "Jump-throw.",
                "Дым перекрывает ramp для захода.",
            ],
        },
        {
            "id": "ve-b",
            "pos": [34, 58],
            "type": "smoke",
            "title": "Дым на B site",
            "steps": [
                "Встаньте у B main.",
                "Прицельтесь в дальний угол сайта.",
                "Бросок ЛКМ.",
                "Дым перекрывает B.",
            ],
        },
        {
            "id": "ve-a",
            "pos": [60, 52],
            "type": "molotov",
            "title": "Молотов на A site",
            "steps": [
                "Встаньте у входа на сайт A.",
                "Зажмите ЛКМ, прицельтесь в угол.",
                "Молотов выжигает за точкой.",
            ],
        },
    ],
    "train": [
        {
            "id": "tr-ladder",
            "pos": [30, 62],
            "type": "smoke",
            "title": "Дым на ladder (A)",
            "steps": [
                "Встаньте на A main.",
                "Прицельтесь в верхнюю часть здания.",
                "Jump-throw.",
                "Дым закрывает ladder — безопасный заход на A.",
            ],
        },
        {
            "id": "tr-ivy",
            "pos": [58, 36],
            "type": "molotov",
            "title": "Молотов на Ivy (B)",
            "steps": [
                "Встаньте у B main.",
                "Зажмите ЛКМ, прицельтесь в угол.",
                "Молотов выжигает Ivy.",
            ],
        },
        {
            "id": "tr-amain",
            "pos": [28, 60],
            "type": "smoke",
            "title": "Дым на A main",
            "steps": [
                "Встаньте у A main.",
                "Прицельтесь в верхний край стены.",
                "Бросок ЛКМ.",
                "Дым перекрывает A main.",
            ],
        },
    ],
    "cache": [
        {
            "id": "ca-mid",
            "pos": [38, 34],
            "type": "smoke",
            "title": "Дым на mid (Z)",
            "steps": [
                "Встаньте у левой стены T mid.",
                "Прицельтесь в верхнюю часть.",
                "Jump-throw.",
                "Дым закрывает Z для контроля mid.",
            ],
        },
        {
            "id": "ca-a",
            "pos": [62, 58],
            "type": "smoke",
            "title": "Дым на A site",
            "steps": [
                "Встаньте на highway.",
                "Прицельтесь в дальний угол сайта.",
                "Бросок ЛКМ.",
                "Дым перекрывает default A.",
            ],
        },
        {
            "id": "ca-b",
            "pos": [34, 62],
            "type": "molotov",
            "title": "Молотов на B site",
            "steps": [
                "Встаньте у B main.",
                "Зажмите ЛКМ, прицельтесь в угол.",
                "Молотов выжигает default B.",
            ],
        },
    ],
}

# ============================================================
# ТАКТИКИ (командные схемы захода по картам)
# ============================================================
# Ключ = id карты, значение — список тактик:
#   "id"    — уникальный идентификатор
#   "title" — название тактики
#   "steps" — пошаговое описание (кто и что делает)

TACTICS = {
    "mirage": [
        {
            "id": "mi-a-exec",
            "title": "Быстрый заход на A",
            "steps": [
                "Трое идут через ramp с дымами Window и CT.",
                "Один ставит дым Jungle.",
                "Выглядывайте сайт, первым заходит подмога из short.",
                "Разместите бомбу за двойным ящиком.",
            ],
        }
    ],
    "dust2": [
        {
            "id": "d2-a-long",
            "title": "Быстрый A через Long",
            "steps": [
                "Первый бежит на Long с флешем.",
                "Второй ставит дым Long для контроля.",
                "Третий держит mid, чтобы никто не зашёл сзади.",
                "Тайминг: дым падает ровно к выходу на сайт.",
            ],
        }
    ],
    "inferno": [
        {
            "id": "in-b-banana",
            "title": "Заход на B через Banana",
            "steps": [
                "Один контролирует Banana молотовом.",
                "Второй ставит дым Banana.",
                "Третий заходит через апартаменты во второй тайминг.",
                "Пост-плант на Coffins.",
            ],
        }
    ],
}

# VIDEOS — видео-гайды по раскидкам гранат для каждой карты (ссылки на YouTube).
#   "id"    — уникальный идентификатор видео
#   "title" — название (показывается в приложении и участвует в поиске)
#   "types" — типы гранат, показанные в видео: smoke / flash / molotov / grenade
#   "url"   — ссылка на YouTube
#   "tags"  — ключевые слова для поиска (локации карты и типы гранат)
VIDEOS = {
    "mirage": [
        {
            "id": "v-mi-window",
            "types": ["smoke"],
            "title": "Дым на окно mid — Mirage window smoke от T spawn",
            "url": "https://www.youtube.com/watch?v=4Ra31L4WPvI",
            "tags": ["mirage", "мираж", "window", "окно", "мид", "смок", "дым", "раскидка", "спавн", "a"],
        },
        {
            "id": "v-mi-ct",
            "types": ["smoke"],
            "title": "Дым на CT для захода A — Mirage CT smoke",
            "url": "https://www.youtube.com/watch?v=CosEhBxaKYQ",
            "tags": ["mirage", "мираж", "ct", "кт", "смок", "дым", "раскидка", "a"],
        },
        {
            "id": "v-mi-jungle",
            "types": ["smoke"],
            "title": "Дым на Jungle — Mirage jungle smoke",
            "url": "https://www.youtube.com/watch?v=0elD4j3CFm0",
            "tags": ["mirage", "мираж", "jungle", "джангл", "пальма", "смок", "дым", "a"],
        },
        {
            "id": "v-mi-stairs",
            "types": ["molotov"],
            "title": "Молотов на лестницу A — Mirage stairs molotov",
            "url": "https://www.youtube.com/watch?v=5FE3x5kVQFA",
            "tags": ["mirage", "мираж", "stairs", "лестница", "молотов", "a"],
        },
        {
            "id": "v-mi-oneway",
            "types": ["smoke"],
            "title": "One-way на A (лестница) — Mirage one way smoke",
            "url": "https://www.youtube.com/watch?v=7RxcuulTxLA",
            "tags": ["mirage", "мираж", "oneway", "ванвей", "window", "окно", "смок", "дым", "a"],
        },
        {
            "id": "v-mi-under",
            "types": ["smoke"],
            "title": "Дым на underpass B — Mirage underpass smoke",
            "url": "https://www.youtube.com/watch?v=FOCZ3Xbh1fE",
            "tags": ["mirage", "мираж", "underpass", "андерпас", "апартаменты", "апсы", "смок", "дым", "b"],
        },
    ],
    "dust2": [
        {
            "id": "v-d2-xbox",
            "types": ["smoke"],
            "title": "Дым на Xbox (mid) — Dust II xbox smoke",
            "url": "https://www.youtube.com/watch?v=nQhH_lyWS8M",
            "tags": ["dust", "даст", "пыль", "xbox", "бокс", "ящик", "mid", "мид", "смок", "дым", "a", "b"],
        },
        {
            "id": "v-d2-long",
            "types": ["smoke"],
            "title": "Дым на Long — Dust II long smoke",
            "url": "https://www.youtube.com/watch?v=wnxAbLFUIeo",
            "tags": ["dust", "даст", "пыль", "long", "лонг", "длинная", "смок", "дым", "a"],
        },
        {
            "id": "v-d2-bwindow",
            "types": ["smoke"],
            "title": "Дым на окно B — Dust II b window smoke",
            "url": "https://www.youtube.com/watch?v=xhVLWnuHb5A",
            "tags": ["dust", "даст", "пыль", "window", "окно", "туннели", "смок", "дым", "b"],
        },
        {
            "id": "v-d2-goose",
            "types": ["molotov"],
            "title": "Молотов на Goose (A) — Dust II goose molotov",
            "url": "https://www.youtube.com/watch?v=2fzrxtK525Y",
            "tags": ["dust", "даст", "пыль", "goose", "гусь", "гоуз", "молотов", "a"],
        },
        {
            "id": "v-d2-oneway",
            "types": ["smoke"],
            "title": "One-way на mid — Dust II one way mid doors smoke",
            "url": "https://www.youtube.com/watch?v=LDfmQzrPddU",
            "tags": ["dust", "даст", "пыль", "oneway", "ванвей", "mid", "мид", "doors", "двери", "смок", "дым", "a", "b"],
        },
        {
            "id": "v-d2-ctspawn",
            "types": ["smoke"],
            "title": "Дым на CT spawn (A take) — Dust II CT smoke",
            "url": "https://www.youtube.com/watch?v=6D0yBLbkgbM",
            "tags": ["dust", "даст", "пыль", "ct", "кт", "смок", "дым", "спавн", "a"],
        },
    ],
    "inferno": [
        {
            "id": "v-in-banana",
            "types": ["smoke"],
            "title": "Дым на Banana — Inferno banana smoke",
            "url": "https://www.youtube.com/watch?v=30RHngpfOrY",
            "tags": ["inferno", "инферно", "banana", "банан", "смок", "дым", "b"],
        },
        {
            "id": "v-in-ct",
            "types": ["smoke"],
            "title": "Дым на CT (A take) — Inferno A site smokes для T",
            "url": "https://www.youtube.com/watch?v=lfSYkg0SubM",
            "tags": ["inferno", "инферно", "ct", "кт", "arch", "арка", "смок", "дым", "a"],
        },
        {
            "id": "v-in-coffins",
            "types": ["molotov"],
            "title": "Молотов на Coffins — Inferno B site molotovs",
            "url": "https://www.youtube.com/watch?v=nsrxjiIAICE",
            "tags": ["inferno", "инферно", "coffins", "коффинс", "гробы", "banana", "банан", "молотов", "b"],
        },
        {
            "id": "v-in-topmid",
            "types": ["smoke"],
            "title": "Дым на Top Mid — Inferno top mid smoke (T stairs)",
            "url": "https://www.youtube.com/watch?v=oTVcXVRZ34Q",
            "tags": ["inferno", "инферно", "mid", "мид", "stairs", "лестница", "смок", "дым"],
        },
        {
            "id": "v-in-oneway",
            "types": ["smoke"],
            "title": "One-way на Banana — Inferno banana one way smoke",
            "url": "https://www.youtube.com/watch?v=DSK8sZqEHYk",
            "tags": ["inferno", "инферно", "oneway", "ванвей", "banana", "банан", "смок", "дым", "b"],
        },
        {
            "id": "v-in-lib",
            "types": ["smoke"],
            "title": "Смоук на Library (B) — Inferno library smoke",
            "url": "https://www.youtube.com/watch?v=WXZdP-WZEFM",
            "tags": ["inferno", "инферно", "library", "библиотека", "лайбрари", "смок", "дым", "b"],
        },
    ],
    "nuke": [
        {
            "id": "v-nu-outside",
            "types": ["smoke"],
            "title": "Дым на outside — Nuke outside smoke",
            "url": "https://www.youtube.com/watch?v=4Iuk3BEInPk",
            "tags": ["nuke", "нук", "outside", "аутсайд", "аут", "смок", "дым"],
        },
        {
            "id": "v-nu-secret",
            "types": ["molotov"],
            "title": "Молотов на Secret — Nuke secret molotov",
            "url": "https://www.youtube.com/watch?v=CYGLV2JmVig",
            "tags": ["nuke", "нук", "secret", "секрет", "молотов", "b"],
        },
        {
            "id": "v-nu-oneway",
            "types": ["smoke"],
            "title": "One-way на A (hut) — Nuke hut smoke",
            "url": "https://www.youtube.com/watch?v=Gwpi3JpuO_w",
            "tags": ["nuke", "нук", "oneway", "ванвей", "hut", "хат", "ramp", "рамп", "смок", "дым", "a"],
        },
    ],
    "ancient": [
        {
            "id": "v-an-mid",
            "types": ["smoke"],
            "title": "Дым на mid — Ancient window smokes",
            "url": "https://www.youtube.com/watch?v=VPbEbpAg4iU",
            "tags": ["ancient", "эйншент", "mid", "мид", "window", "окно", "смок", "дым"],
        },
        {
            "id": "v-an-a",
            "types": ["molotov"],
            "title": "Молотов на A site — Ancient A default molotov",
            "url": "https://www.youtube.com/watch?v=wUX0qZwKL2U",
            "tags": ["ancient", "эйншент", "main", "мейн", "default", "дефолт", "молотов", "a"],
        },
        {
            "id": "v-an-b",
            "types": ["smoke"],
            "title": "Дым на B (cave) — Ancient cave smoke",
            "url": "https://www.youtube.com/watch?v=G-qbo3N48vc",
            "tags": ["ancient", "эйншент", "cave", "кейв", "пещера", "main", "мейн", "смок", "дым", "b"],
        },
    ],
    "overpass": [
        {
            "id": "v-ov-monster",
            "types": ["smoke"],
            "title": "Дым на Monster — Overpass monster smoke",
            "url": "https://www.youtube.com/watch?v=uqJbBmWfCHs",
            "tags": ["overpass", "оверпас", "monster", "монстр", "смок", "дым", "a"],
        },
        {
            "id": "v-ov-a",
            "types": ["molotov"],
            "title": "Молотов на A site — Overpass default molotov",
            "url": "https://www.youtube.com/watch?v=YCNUxNvii8c",
            "tags": ["overpass", "оверпас", "connector", "коннектор", "default", "дефолт", "молотов", "a"],
        },
        {
            "id": "v-ov-bshort",
            "types": ["smoke"],
            "title": "Дым на B short — Overpass B short smoke",
            "url": "https://www.youtube.com/watch?v=3EYI6OTHTkw",
            "tags": ["overpass", "оверпас", "short", "шорт", "смок", "дым", "b"],
        },
    ],
    "anubis": [
        {
            "id": "v-anb-mid",
            "types": ["smoke"],
            "title": "Дым на mid — Anubis mid smoke",
            "url": "https://www.youtube.com/watch?v=zxl51JJI1vA",
            "tags": ["anubis", "анубис", "mid", "мид", "смок", "дым", "a", "b"],
        },
        {
            "id": "v-anb-a",
            "types": ["molotov"],
            "title": "Молотов на A site — Anubis A molotov",
            "url": "https://www.youtube.com/watch?v=Lmi67ICOgOs",
            "tags": ["anubis", "анубис", "main", "мейн", "молотов", "a"],
        },
        {
            "id": "v-anb-b",
            "types": ["smoke"],
            "title": "Дым на B — Anubis B main smoke",
            "url": "https://www.youtube.com/watch?v=jfgkteEJKk8",
            "tags": ["anubis", "анубис", "main", "мейн", "смок", "дым", "b"],
        },
    ],
    "vertigo": [
        {
            "id": "v-ve-aramp",
            "types": ["smoke"],
            "title": "Дым на A ramp — Vertigo ramp smoke",
            "url": "https://www.youtube.com/watch?v=VxefMwqmdk4",
            "tags": ["vertigo", "вертиго", "ramp", "рамп", "смок", "дым", "a"],
        },
        {
            "id": "v-ve-b",
            "types": ["smoke"],
            "title": "Дым на B site — Vertigo B smoke",
            "url": "https://www.youtube.com/watch?v=mvJ7N56H6as",
            "tags": ["vertigo", "вертиго", "смок", "дым", "b"],
        },
        {
            "id": "v-ve-a",
            "types": ["molotov"],
            "title": "Молотов на A site — Vertigo A molotov",
            "url": "https://www.youtube.com/watch?v=UAN-_qZdFeY",
            "tags": ["vertigo", "вертиго", "молотов", "a"],
        },
    ],
    "train": [
        {
            "id": "v-tr-amain",
            "types": ["smoke"],
            "title": "Дым на A main — Train A main smoke",
            "url": "https://www.youtube.com/watch?v=g6_K5U_5Gz8",
            "tags": ["train", "трейн", "main", "мейн", "смок", "дым", "a"],
        },
    ],
    "cache": [
        {
            "id": "v-ca-mid",
            "types": ["smoke"],
            "title": "Дым на mid (Z) — Cache mid smoke",
            "url": "https://www.youtube.com/watch?v=OuNfBV9lpP4",
            "tags": ["cache", "кэш", "mid", "мид", "смок", "дым", "a", "b"],
        },
        {
            "id": "v-ca-a",
            "types": ["smoke"],
            "title": "Дым на A site — Cache A smoke",
            "url": "https://www.youtube.com/watch?v=XIkbzSgJmgo",
            "tags": ["cache", "кэш", "highway", "хайвей", "смок", "дым", "a"],
        },
        {
            "id": "v-ca-b",
            "types": ["molotov"],
            "title": "Молотов на B site — Cache B molotov",
            "url": "https://www.youtube.com/watch?v=8uciU2Amncs",
            "tags": ["cache", "кэш", "main", "мейн", "молотов", "b"],
        },
    ],
}
