# 🤖 Telegram Learning Bot

Бот для изучения английского языка: уроки, карточки (как Anki), тесты и статистика прогресса.

## Функции

- 📚 **Уроки** — пошаговый текст + вопросы в конце. Бот помнит, где ты остановился.
- 🃏 **Карточки** — слово → ответ. Выученные карточки больше не показываются.
- 🧪 **Тесты** — викторины со счётом, лучший результат сохраняется.
- 📊 **Прогресс** — сколько уроков/карточек/тестов пройдено.

## Как добавить свой контент

Всё содержимое лежит в одном файле — `bot/content.py`. Там три списка:

- `LESSONS` — уроки (текст + вопросы в конце)
- `CARDS` — карточки: `front` (слово) → `back` (ответ)
- `QUIZZES` — тесты: вопрос + варианты + номер правильного (счёт с нуля!)

Программирование знать не нужно: просто дописывай словари по образцу. Каждое изменение попадёт в бота после перезапуска/деплоя.

## Локальный запуск

```bash
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt   # Windows
# source .venv/bin/activate && pip install -r requirements.txt   # Linux/Mac

copy .env.example .env    # Windows
# cp .env.example .env    # Linux/Mac

# впиши BOT_TOKEN (от @BotFather). DATABASE_URL оставь пустым — будет SQLite.
.venv\Scripts\python -m bot.main
```

## Деплой на Railway

1. Запушь этот репозиторий на GitHub.
2. На [railway.app](https://railway.app) нажми **New Project → Deploy from GitHub repo**, выбери репозиторий.
3. Добавь плагин **PostgreSQL** (Project → Create → Database → PostgreSQL). Переменная `DATABASE_URL` подставится автоматически.
4. В переменных окружения (`Variables`) добавь `BOT_TOKEN` со значением от @BotFather.
5. Railway сам соберёт проект (конфиг в `railway.json`). Готово — бот работает.

Конфиг сборки и запуска — в `railway.json` (Nixpacks, старт через `python -m bot.main`).

## Структура проекта

```
telegram-learning-bot/
├── bot/
│   ├── main.py            # точка входа
│   ├── config.py          # чтение .env
│   ├── db.py              # подключение к БД (SQLite локально / PostgreSQL на Railway)
│   ├── models.py          # таблицы: users, lesson_progress, quiz_results, card_states
│   ├── content.py         # ⭐ ТВОЙ КОНТЕНТ: уроки, карточки, тесты
│   ├── keyboards.py       # кнопки
│   ├── states.py          # состояния диалогов
│   └── handlers/          # логика меню, уроков, карточек, тестов, прогресса
├── requirements.txt
├── railway.json
└── .env.example
```
