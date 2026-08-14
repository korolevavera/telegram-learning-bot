import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    def __init__(self) -> None:
        self.bot_token: str = os.getenv("BOT_TOKEN", "").strip()
        self.database_url: str = os.getenv("DATABASE_URL", "").strip()
        self.webapp_url: str = os.getenv("WEBAPP_URL", "").strip()
        self.port: int = int(os.getenv("PORT", "8080"))


def load_config() -> Config:
    return Config()
