from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    username: Mapped[str | None] = mapped_column(String(64), nullable=True)
    first_name: Mapped[str] = mapped_column(String(255), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    __table_args__ = (UniqueConstraint("user_id", "lesson_id", name="uq_user_lesson"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, index=True)
    lesson_id: Mapped[str] = mapped_column(String(64), index=True)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class QuizResult(Base):
    __tablename__ = "quiz_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, index=True)
    quiz_id: Mapped[str] = mapped_column(String(64), index=True)
    score: Mapped[int] = mapped_column(Integer)
    total: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class CardState(Base):
    __tablename__ = "card_states"
    __table_args__ = (UniqueConstraint("user_id", "card_index", name="uq_user_card"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, index=True)
    card_index: Mapped[int] = mapped_column(Integer)
    known: Mapped[bool] = mapped_column(Boolean, default=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )


class PracticeLog(Base):
    __tablename__ = "practice_log"
    __table_args__ = (
        UniqueConstraint("user_id", "map_id", "lineup_id", name="uq_user_practice"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, index=True)
    map_id: Mapped[str] = mapped_column(String(32), index=True)
    lineup_id: Mapped[str] = mapped_column(String(64), index=True)
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    practiced_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )


class MiniGameResult(Base):
    __tablename__ = "mini_game_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, index=True)
    game_id: Mapped[str] = mapped_column(String(32), index=True)
    score: Mapped[int] = mapped_column(Integer)
    total: Mapped[int] = mapped_column(Integer)
    duration_ms: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    xp: Mapped[int] = mapped_column(Integer, default=0)
    coins: Mapped[int] = mapped_column(Integer, default=0)
    level: Mapped[int] = mapped_column(Integer, default=1)
    streak: Mapped[int] = mapped_column(Integer, default=0)
    last_active: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    achievements: Mapped[str] = mapped_column(String(512), default="[]")
    inventory: Mapped[str] = mapped_column(String(1024), default="[]")
    equipped_title: Mapped[str] = mapped_column(String(64), default="")
    equipped_avatar: Mapped[str] = mapped_column(String(64), default="")
    equipped_badge: Mapped[str] = mapped_column(String(64), default="")
    faceit_id: Mapped[str] = mapped_column(String(64), default="")
    faceit_name: Mapped[str] = mapped_column(String(128), default="")
    training_minutes: Mapped[int] = mapped_column(Integer, default=30)
    goal: Mapped[str] = mapped_column(String(32), default="aim")
    role: Mapped[str] = mapped_column(String(32), default="rifler")
    faceit_level: Mapped[int] = mapped_column(Integer, default=0)
    faceit_elo: Mapped[int] = mapped_column(Integer, default=0)


class CurrencyTransaction(Base):
    """Ledger: каждая транзакция XP/монет пользователя (для аудита и защиты от фарма)."""

    __tablename__ = "currency_transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, index=True)
    xp_delta: Mapped[int] = mapped_column(Integer, default=0)
    coin_delta: Mapped[int] = mapped_column(Integer, default=0)
    reason: Mapped[str] = mapped_column(String(64), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Favorite(Base):
    """Избранное: гайды, гранаты, карты, игроки, команды."""

    __tablename__ = "favorites"
    __table_args__ = (
        UniqueConstraint("user_id", "item_type", "item_id", name="uq_user_favorite"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, index=True)
    item_type: Mapped[str] = mapped_column(String(32))
    item_id: Mapped[str] = mapped_column(String(128))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class UserSkill(Base):
    """Уровень навыка пользователя (0–100)."""

    __tablename__ = "user_skills"
    __table_args__ = (UniqueConstraint("user_id", "skill_id", name="uq_user_skill"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, index=True)
    skill_id: Mapped[str] = mapped_column(String(32))
    level: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )


class TrainingSession(Base):
    """Выполненное задание персонального плана (идемпотентно по user+day+task)."""

    __tablename__ = "training_sessions"
    __table_args__ = (
        UniqueConstraint("user_id", "day_key", "task_id", name="uq_user_day_task"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, index=True)
    day_key: Mapped[str] = mapped_column(String(16))
    task_id: Mapped[str] = mapped_column(String(64))
    skill_id: Mapped[str] = mapped_column(String(32), default="")
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class ChallengeProgress(Base):
    """Флаг получения награды недельного челленджа (идемпотентно по user+week+challenge)."""

    __tablename__ = "challenge_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "week_key", "challenge_id", name="uq_user_week_challenge"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, index=True)
    week_key: Mapped[str] = mapped_column(String(10))
    challenge_id: Mapped[str] = mapped_column(String(32))
    claimed: Mapped[bool] = mapped_column(Boolean, default=True)
    claimed_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class Friend(Base):
    """Дружба: пара user+friend, статус pending/accepted, инициатор запроса."""

    __tablename__ = "friends"
    __table_args__ = (UniqueConstraint("user_id", "friend_id", name="uq_user_friend"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, index=True)
    friend_id: Mapped[int] = mapped_column(BigInteger, index=True)
    status: Mapped[str] = mapped_column(String(16), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class AdminContent(Base):
    """Переопределения контента от админа (grenade/shop/game) — поверх JSON-файлов."""

    __tablename__ = "admin_content"
    __table_args__ = (
        UniqueConstraint("content_type", "content_key", name="uq_admin_content"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    content_type: Mapped[str] = mapped_column(String(32), index=True)
    content_key: Mapped[str] = mapped_column(String(128))
    payload: Mapped[str] = mapped_column(String(4096), default="{}")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )
