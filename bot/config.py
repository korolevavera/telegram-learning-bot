import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    def __init__(self) -> None:
        self.bot_token: str = os.getenv("BOT_TOKEN", "").strip()
        self.database_url: str = os.getenv("DATABASE_URL", "").strip()
        self.webapp_url: str = os.getenv("WEBAPP_URL", "").strip()
        self.faceit_api_key: str = os.getenv("FACEIT_API_KEY", "").strip()
        self.port: int = int(os.getenv("PORT", "8080"))
    admin_str = os.getenv("ADMIN_IDS", "").strip()
    self.admin_ids: list[int] = [int(x) for x in admin_str.split(",") if x.strip().isdigit()] if admin_str else []
    self.upload_key: str = os.getenv("UPLOAD_KEY", "").strip()


def load_config() -> Config:
    return Config()
