"""add challenge_progress table

Revision ID: j3d4e5f6a7b8
Revises: i2c3d4e5f6a7
Create Date: 2026-08-17

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "j3d4e5f6a7b8"
down_revision: Union[str, None] = "i2c3d4e5f6a7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "challenge_progress",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.BigInteger(), nullable=False, index=True),
        sa.Column("week_key", sa.String(length=10), nullable=False),
        sa.Column("challenge_id", sa.String(length=32), nullable=False),
        sa.Column("claimed", sa.Boolean(), nullable=False, server_default="1"),
        sa.Column("claimed_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "week_key", "challenge_id", name="uq_user_week_challenge"),
    )


def downgrade() -> None:
    op.drop_table("challenge_progress")