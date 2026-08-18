import asyncio
import logging

from aiogram import Bot, Dispatcher

from .config_loader import CONFIG
from .db import init_db
from .migrations import run_migrations_async
from .web_server import start_web_server
from .handlers import cards, guides, lessons, progress, quizzes, start

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")


async def _preload_admin_cache() -> None:
    from .services import get_content_overrides
    try:
        await get_content_overrides("grenade")
    except Exception:
        logging.getLogger(__name__).warning("Could not preload admin content cache")


async def main() -> None:
    if not CONFIG.bot_token:
        raise SystemExit(
            "BOT_TOKEN не задан. Скопируй .env.example в .env и впиши токен от @BotFather."
        )

    await run_migrations_async()
    await init_db()
    await _preload_admin_cache()
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
