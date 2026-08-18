# PROJECT AUDIT — CS2 Coach Platform

> Дата обновления: 2026-08-18
> Статус: аудит актуализирован по текущему состоянию кода.
> Правило из спеки: ничего не переписываем с нуля, существующий функционал не ломаем.

---

## 1. Архитектура (текущая)

Монолит в одном процессе, запускается `python -m bot.main` (railway.json / railway.toml, Nixpacks):

```
main.py
 ├── run_migrations()        # Alembic, безопасный stamp для старых БД
 ├── start_web_server()      # aiohttp: Mini App (static) + REST API
 └── dp.start_polling()      # aiogram 3: Telegram-бот
```

- **Telegram-бот**: инлайн-клавиатуры + FSM (уроки, карточки, тесты, гайды, прогресс). Роутеры в `bot/handlers/`.
- **Mini App**: 7 вкладок (home, learn, train, games, stats, guides, settings) + онбординг, общий switchTab-фреймворк.
- **Контент**: data-driven — JSON в `bot/data/` с фолбэком на Python-константы в `content.py` (`content_loader.py`).
- **Геймификация**: XP/уровни/монеты/стрики/достижения, мини-игры, магазин, инвентарь, лидерборд — `gamification.py`, `games.py`, `shop.py`.
- **Статистика**: FACEIT Open API (по ключу) + неофициальный bo3.gg, TTL-кэш в памяти (`stats.py`).

## 2. Технологический стек

| Слой | Технология |
|---|---|
| Backend | Python 3, aiogram>=3.15, SQLAlchemy>=2.0.36 (async), asyncpg / aiosqlite |
| Веб-сервер | aiohttp>=3.9 (в том же процессе) |
| Миграции | Alembic (`alembic/versions/`, 6 миграций) + безопасный stamp |
| Frontend | Vanilla JS (IIFE, без сборки, ~4000 строк app.js), HTML5, кастомный CSS, Telegram WebApp SDK, Google Fonts |
| Хостинг | Railway (Nixpacks), startCommand `python -m bot.main`, `healthz` эндпоинт |
| Данные | SQLite локально / PostgreSQL на Railway (`DATABASE_URL` плагином) |
| Тесты | pytest + pytest-asyncio, 47 тестов (API/контент/auth), `pytest.ini` |

## 3. База данных

Alembic-миграции (идемпотентный запуск через `bot/migrations.py`):
- `a1b2c3d4e5f6` baseline: users, lesson_progress, quiz_results, card_states
- `b2c3d4e5f6a7` practice_log
- `c3d4e5f6a7b8` mini_game_results
- `d4e5f6a7b8c9` user_profiles
- `e5f6a7b8c9d0` inventory (в user_profiles)
- `f6a7b8c9d0e1` faceit_fields (в user_profiles)

| Таблица | Поля | Примечание |
|---|---|---|
| `users` | id, username, first_name, created_at | PK = TG user id |
| `lesson_progress` | user_id, lesson_id, completed, completed_at | uq(user_id, lesson_id) |
| `quiz_results` | user_id, quiz_id, score, total, created_at | |
| `card_states` | user_id, card_index, known, updated_at | uq(user_id, card_index) |
| `practice_log` | user_id, map_id, lineup_id, attempts, practiced_at | uq(user_id, map_id, lineup_id) |
| `mini_game_results` | user_id, game_id, score, total, duration_ms, created_at | |
| `user_profiles` | user_id PK, xp, coins, level, streak, last_active, achievements (JSON-строка), inventory (JSON-строка), equipped_title, faceit_id, faceit_name | |

Отсутствуют: транзакции монет (ledger), friendship, favorite, notifications, challenges, гранаты/гайды как сущности БД (контент в JSON).

## 4. API (aiohttp, `web_server.py`)

- `GET /` → index.html (подстановка APP_VERSION)
- `GET /healthz` → health check
- `GET /api/init` (auth) → user + profile (xp/coins/level/streak/achievements/inventory)
- `GET /api/content` → lessons, cards, quizzes
- `GET /api/guides` → maps, lineups, tactics, types, spots, positions, roles, terms, difficulty
- `GET /api/progress` (auth)
- `GET /api/training` (auth) → прогресс практики; `POST /api/training` (auth) → log practice + XP
- `GET /api/games` → каталог игр; `GET /api/games/progress` (auth); `POST /api/games/submit` (auth) → результат + XP/coins
- `GET /api/profile` (auth); `GET /api/achievements`; `GET /api/leaderboard` (auth)
- `GET /api/shop`; `POST /api/shop/buy`; `POST /api/shop/equip` (auth)
- `POST /api/faceit/link`, `POST /api/faceit/unlink` (auth, по никнейму)
- `GET /api/stats?refresh&region&period` (auth); `GET /api/team?slug`; `GET /api/player?slug&period`; `GET /api/faceit-player?id`
- `POST /api/card` · `/api/lesson` · `/api/quiz` (auth, начисляют XP/coins)
- `GET /api/admin/dashboard`, `GET /api/admin/users` (auth + ADMIN_IDS)
- `GET /static` → файлы Mini App

**Авторизация**: Telegram initData → HMAC-SHA256 (`_validate_init_data`); проверяется свежесть `auth_date` (AUTH_MAX_AGE=86400); rate-limit middleware (120 req/мин авторизованные, 60 анонимные); `_rate` очищается >10k записей.

## 5. Реализованный функционал

**Telegram-бот** (handlers):
- 📚 Уроки (секции + свободные ответы) с сохранением прогресса
- 🃏 Карточки (термин→значение), память выученных
- 🧪 Тесты (варианты, лучший счёт)
- 🧭 Гайды: карты → раскидки (текст+видео) и тактики
- 📊 Прогресс; 🎮 Кнопка WebApp (APP_VERSION="41" в `version.py`)

**Mini App** (`bot/webapp/app.js`, 7 вкладок):
- **Home**: приветствие, XP/уровень/монеты/стрик, прогресс уроков/карточек/тестов, топ-10 лидерборда с рангом пользователя, достижения (сетка), быстрые карточки перехода
- **Learn**: уроки (секции+вопросы), карточки (flip, знаю/не знаю), тесты (вопрос→варианты→результат) — прогресс через API
- **Train**: карты → раскидки с практикой (log через /api/training), счётчик попыток
- **Games**: 3 мини-игры (callouts 30 вопросов, utility 15, economy 10), результаты → API → XP/coins
- **Stats**: топ FACEIT/команд/игроков, детальные карточки, избранное (localStorage), поиск, регион/период
- **Guides**: карты → радар с точками (MAP_SPOTS) + видео; раскидки по типам; тактики (T/CT × pistol/eco/force/full); реплей/план/tldr; глоссарий; fuzzy-поиск
- **Settings**: тема (dark/light/gurren), язык ru/en, регион/период
- Онбординг (4 слайда, localStorage), i18n `t()`

**Контент** (data-driven):
- `bot/data/`: lessons.json, cards.json, quizzes.json, maps.json (10 карт), lineups.json (mirage 6, dust2 4+), tactics.json (mirage), map_spots.json, positions.json, terms.json, roles.json, lineup_types.json, difficulty.json
- `lineups_loader.py` мержит внешний `lineups.json` в контент
- `content.py` — Python-фолбэк и хелперы (flatten_tactics, tactic_steps)

**Геймификация** (server-side):
- XP за урок/тест/карточку/игру/практику; уровни (level*100 XP); монеты; стрики; 15 достижений (first_lesson, streak_3/7/30, level_5/10/25, xp_1000 и др.)
- Магазин: 8 предметов (6 титулов, 3 рамки), покупка/экипировка на сервере, проверка баланса
- Лидерборд по XP с рангом пользователя

**Админка**: `/api/admin/dashboard` (счётчики) и `/api/admin/users` (список пользователей с XP/coins/level/faceit) — только ADMIN_IDS.

## 6. Переиспользуемые компоненты

- `web_server._auth` / `_validate_init_data` + rate-limit middleware — готовая авторизация для новых эндпоинтов
- `services.py` — единый слой БД (бот + веб)
- `gamification.award_*` / `get_profile` — серверное начисление XP/coins/достижений
- `content_loader.apply_overrides` — паттерн «JSON поверх Python» (12 секций)
- `lineups_loader.merge_lineups` — паттерн внешнего JSON-оверрайда
- `stats.py` — FACEIT/bo3-клиенты, TTL-кэш, `clear_cache`, `close`
- `games.py` — структура GAMES (id/title/desc/icon/questions) для добавления новых игр
- Frontend: `api.get`, `el`, `iconEl`, `switchTab`, `t()` (i18n), `renderList/renderSection`, `sectionTitle`, `progressStat`, `pickCard`, TAB_DEFS, онбординг, renderPattern для деталей
- `version.py` — единый APP_VERSION для кэш-бастера

## 7. Проблемы и риски

1. **Транзакционная целостность XP/coins**: `award_xp` не имеет отдельного ledger; повторная отправка `/api/quiz` или `/api/lesson` начисляет XP каждый раз (нет защиты от дублей/farming). Риск abuse.
2. **Мини-игры**: `score`/`duration_ms` приходят с клиента и принимаются как есть — нет anti-cheat (невозможные значения, rate на сабмит).
3. **FACEIT**: только связка по никнейму через поиск по ключу — нет официального OAuth2/FACEIT Connect.
4. **Контент всё ещё частично в Python**: `content.py` (103 KB) остаётся фолбэком и источником для `tools/export_content.py`; JSON — источник истины, но дублирование создаёт риск рассинхрона.
5. **Нет друзей/соцсетей, уведомлений, челленджей (daily/weekly)**, нет транзакций монет, нет избранного на сервере (только localStorage).
6. **Нет глобального поиска** по контенту в Mini App; поиск только в Stats и Guides.
7. **Онбординг** — статичные слайды, не собирает данные (nickname/цель/роль/время) и не создаёт персональный план.
8. **Рекомендательная система** отсутствует (слабый навык не определяется, нет рекомендаций).
9. **Лидерборд** — только топ-20 по XP, нет weekly/monthly/friends/mini-game типов.
10. **Гранаты не полноценная сущность**: в lineups нет полей side/site/complexity/связанные тактики/избранное/статус изучения.
11. **Perf**: `/api/guides` и `/api/content` отдают всё сразу (lineups.json 17 KB, tactics 51 KB) — при росте контента нужна пагинация.
12. Внешние API (bo3.gg неофициальный) — ошибки → 502; кэш 15 мин.
13. `equip_item` поддерживает только `title` (рамки нельзя экипировать); `award_practice` начисляет COIN_LESSON (вероятно, ошибка константы).

## 8. Отсутствующий функционал (vs MASTER SPEC)

- **Фаза 2 (Learning)**: гранаты как отдельная база (без поиска Map→Side→Site→Type), нет Favorites на сервере, нет «TRAIN THIS».
- **Фаза 3 (Training)**: нет персональных планов, навыков (skills), тренировочных сессий по времени, рекомендаций.
- **Фаза 4 (Mini Games)**: есть 3 игры (callouts/utility/economy); нет reaction/aim/who-said-it/guess-map/guess-grenade/guess-position, нет daily challenge, нет лидербордов по играм.
- **Фаза 5 (Gamification)**: XP/уровни/монеты/стрики/достижения есть; нет daily/weekly challenges, защиты от дублей, транзакционного ledger.
- **Фаза 6 (Social)**: нет профилей друзей, friend requests, сравнения.
- **Фаза 7 (Shop)**: есть базовый магазин; нет аватаров/баннеров/бейджей/эффектов, нет limited/rarity.
- **Фаза 8 (FACEIT)**: нет OAuth, нет матчей/рейтинга/синхронизации пользователя.
- **Фаза 9 (Admin)**: только 2 read-эндпоинта; нет CRUD контента (maps/grenades/training/games/shop).
- **Фаза 10 (Polish)**: онбординг-слайды есть; нет skeleton/пустых состояний везде, метрик.

## 9. Рекомендуемая архитектура (целевая)

**Расширяя существующее, ничего не переписывая:**

1. **Anti-abuse** (P0): ledger транзакций (CurrencyTransaction), идемпотентность наград (одна награда за урок/тест — только первый раз или раз в N), server-side валидация score/duration в мини-играх.
2. **Гранаты → сущность контента**: расширить lineups.json полями (side, site, grenade_type, position, difficulty, tags) без смены формата frontend.
3. **Training**: персональный план (генерация из UserProfile + ответов онбординга), навыки через таблицу `user_skills`.
4. **Mini-games**: расширить `games.py` по готовому шаблону (GAMES + questions) — reaction, aim, who-said-it, guess-*; daily challenge через существующий `MiniGameResult`.
5. **FACEIT OAuth**: server-side token store, кнопка CONNECT, отображение level/elo/матчей из официального API.
6. **Frontend**: остаётся switchTab-фреймворк; новые экраны — по паттерну renderGames/renderShop; глобальный поиск — один компонент.
7. **Данные**: продолжать вытеснять контент из content.py в JSON (уже 12 секций).
8. **Один процесс, одна Railway-служба** (пока объём позволяет).

## 10. Безопасный план миграции

Принцип: аддитивные изменения, обратная совместимость API, после каждого этапа — тесты (47 шт.) и проверка бота.

- **Фаза 0 — Audit** ✅ (этот документ актуализирован).
- **Фаза 1 — Foundation** 🔶 частично: Alembic ✅, data-driven ✅, auth_date ✅, rate-limit ✅, healthz ✅, graceful shutdown ✅, тесты ✅. Осталось: ledger транзакций, идемпотентность наград, anti-cheat score.
- **Фаза 2 — Learning**: база гранат (side/site/type/difficulty), поиск Map→Side→Site→Type, «TRAIN THIS» + избранное на сервере.
- **Фаза 3 — Training**: персональный план, навыки, сессии, рекомендации по слабейшему навыку.
- **Фаза 4 — Mini Games**: reaction/aim/who-said-it/guess-*, daily challenge, лидерборды по играм.
- **Фаза 5 — Gamification**: daily/weekly challenges, защита от фарма, транзакционный журнал монет.
- **Фаза 6 — Social**: профили, друзья, friend requests, дружеский лидерборд.
- **Фаза 7 — Shop**: расширение каталога (аватары/баннеры/бейджи), rarity/limited.
- **Фаза 8 — FACEIT**: OAuth2 Connect, привязка, матчи/рейтинг/синхронизация.
- **Фаза 9 — Admin**: CRUD контента (maps/grenades/training/games/shop) под ADMIN_IDS.
- **Фаза 10 — Polish**: онбординг-опрос → персональный план, skeleton/empty states, метрики.

---

*Аудит выполнен на основе чтения кода и прогона тестов (47 passed). Новая функциональность не добавлялась. Ожидается утверждение плана и выбор фазы для реализации.*
