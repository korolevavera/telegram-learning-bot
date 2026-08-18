import asyncio
import logging

logger = logging.getLogger(__name__)

_SQL_FIXES = [
    "ALTER TABLE admin_content ADD COLUMN IF NOT EXISTS payload VARCHAR(4096) NOT NULL DEFAULT '{}'",
]


async def _apply_pending_fixes() -> None:
    from .db import engine
    from sqlalchemy import text

    async with engine.begin() as conn:
        for sql in _SQL_FIXES:
            logger.info("Running: %s", sql)
            await conn.execute(text(sql))


async def run_migrations_async() -> None:
    try:
        await _apply_pending_fixes()
        logger.info("Database migrations applied successfully")
    except Exception:
        logger.exception("Failed to apply database migrations")
