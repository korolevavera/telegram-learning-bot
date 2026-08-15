import os

from aiogram import Bot
from aiogram.types import FSInputFile, Message

YOUTUBE_MARKERS = ("youtu.be", "youtube.com")


def _is_youtube(url: str) -> bool:
    return any(marker in url for marker in YOUTUBE_MARKERS)


async def send_lineup_video(
    bot: Bot,
    chat_id: int,
    video_url: str,
    caption: str = "",
) -> Message | None:
    if not video_url:
        return None

    if _is_youtube(video_url):
        text = f'🎬 <a href="{video_url}">Смотреть видео</a>'
        if caption:
            text = f"{caption}\n\n{text}"
        return await bot.send_message(chat_id, text, parse_mode="HTML")

    if video_url.startswith(("http://", "https://")):
        return await bot.send_video(
            chat_id,
            video=video_url,
            caption=caption or None,
            parse_mode="HTML",
            supports_streaming=True,
        )

    if os.path.exists(video_url):
        return await bot.send_video(
            chat_id,
            video=FSInputFile(video_url),
            caption=caption or None,
            parse_mode="HTML",
            supports_streaming=True,
        )

    return await bot.send_message(chat_id, f"🎬 {video_url}")
