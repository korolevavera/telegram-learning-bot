import asyncio
import logging

from aiogram import Bot, Dispatcher

from .config_loader import CONFIG
from .db import init_db
from .handlers import cards, guides, lessons, progress, quizzes, start
from .web_server import start_web_server

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")


async def main() -> None:
    if not CONFIG.bot_token:
        raise SystemExit(
            "BOT_TOKEN не задан. Скопируй .env.example в .env и впиши токен от @BotFather."
        )

    await init_db()
    await start_web_server()

    bot = Bot(token=CONFIG.bot_token)
    dp = Dispatcher()

    dp.include_router(start.router)
    dp.include_router(lessons.router)
    dp.include_router(cards.router)
    dp.include_router(quizzes.router)
    dp.include_router(guides.router)
    dp.include_router(progress.router)

    logging.info("Bot started")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
