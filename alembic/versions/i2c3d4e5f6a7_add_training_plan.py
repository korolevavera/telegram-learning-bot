"""add user_skills, training_sessions and plan prefs to user_profiles

Revision ID: i2c3d4e5f6a7
Revises: h1b2c3d4e5f6
Create Date: 2026-08-17

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "i2c3d4e5f6a7"
down_revision: Union[str, None] = "h1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_skills",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.BigInteger(), nullable=False, index=True),
        sa.Column("skill_id", sa.String(length=32), nullable=False),
        sa.Column("level", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "skill_id", name="uq_user_skill"),
    )
    op.create_table(
        "training_sessions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.BigInteger(), nullable=False, index=True),
        sa.Column("day_key", sa.String(length=16), nullable=False),
        sa.Column("task_id", sa.String(length=64), nullable=False),
        sa.Column("skill_id", sa.String(length=32), nullable=False, server_default=""),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default="0"),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.UniqueConstraint("user_id", "day_key", "task_id", name="uq_user_day_task"),
    )
    op.add_column("user_profiles", sa.Column("training_minutes", sa.Integer(), nullable=False, server_default="30"))
    op.add_column("user_profiles", sa.Column("goal", sa.String(length=32), nullable=False, server_default="aim"))
    op.add_column("user_profiles", sa.Column("role", sa.String(length=32), nullable=False, server_default="rifler"))
    op.add_column("user_profiles", sa.Column("faceit_level", sa.Integer(), nullable=False, server_default="0"))


def downgrade() -> None:
    op.drop_column("user_profiles", "faceit_level")
    op.drop_column("user_profiles", "role")
    op.drop_column("user_profiles", "goal")
    op.drop_column("user_profiles", "training_minutes")
    op.drop_table("training_sessions")
    op.drop_table("user_skills")
