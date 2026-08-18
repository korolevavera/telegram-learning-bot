"""add practice_log for training system

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-08-16

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "b2c3d4e5f6a7"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "practice_log",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.BigInteger(), nullable=False),
        sa.Column("map_id", sa.String(length=32), nullable=False),
        sa.Column("lineup_id", sa.String(length=64), nullable=False),
        sa.Column("attempts", sa.Integer(), nullable=False),
        sa.Column("practiced_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "map_id", "lineup_id", name="uq_user_practice"),
    )
    op.create_index("ix_practice_log_map_id", "practice_log", ["map_id"])
    op.create_index("ix_practice_log_user_id", "practice_log", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_practice_log_user_id", table_name="practice_log")
    op.drop_index("ix_practice_log_map_id", table_name="practice_log")
    op.drop_table("practice_log")
