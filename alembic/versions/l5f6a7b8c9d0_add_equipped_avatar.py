"""add equipped_avatar, equipped_badge to user_profiles

Revision ID: l5f6a7b8c9d0
Revises: k4e5f6a7b8c9
Create Date: 2026-08-17

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "l5f6a7b8c9d0"
down_revision: Union[str, None] = "k4e5f6a7b8c9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("user_profiles", sa.Column("equipped_avatar", sa.String(length=64), nullable=False, server_default=""))
    op.add_column("user_profiles", sa.Column("equipped_badge", sa.String(length=64), nullable=False, server_default=""))


def downgrade() -> None:
    op.drop_column("user_profiles", "equipped_badge")
    op.drop_column("user_profiles", "equipped_avatar")