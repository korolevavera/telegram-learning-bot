"""add faceit_elo to user_profiles

Revision ID: m6f7a8b9c0d1
Revises: l5f6a7b8c9d0
Create Date: 2026-08-17

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "m6f7a8b9c0d1"
down_revision: Union[str, None] = "l5f6a7b8c9d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("user_profiles", sa.Column("faceit_elo", sa.Integer(), nullable=False, server_default="0"))


def downgrade() -> None:
    op.drop_column("user_profiles", "faceit_elo")