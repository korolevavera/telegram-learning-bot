"""add inventory and equipped_title to user_profiles

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2026-08-17

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "e5f6a7b8c9d0"
down_revision: Union[str, None] = "d4e5f6a7b8c9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("user_profiles", sa.Column("inventory", sa.String(length=1024), nullable=False, server_default="[]"))
    op.add_column("user_profiles", sa.Column("equipped_title", sa.String(length=64), nullable=False, server_default=""))


def downgrade() -> None:
    op.drop_column("user_profiles", "equipped_title")
    op.drop_column("user_profiles", "inventory")
