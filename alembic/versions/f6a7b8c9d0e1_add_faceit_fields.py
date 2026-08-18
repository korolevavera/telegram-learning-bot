"""add faceit_id and faceit_name to user_profiles

Revision ID: f6a7b8c9d0e1
Revises: e5f6a7b8c9d0
Create Date: 2026-08-17

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "f6a7b8c9d0e1"
down_revision: Union[str, None] = "e5f6a7b8c9d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("user_profiles", sa.Column("faceit_id", sa.String(length=64), nullable=False, server_default=""))
    op.add_column("user_profiles", sa.Column("faceit_name", sa.String(length=128), nullable=False, server_default=""))


def downgrade() -> None:
    op.drop_column("user_profiles", "faceit_name")
    op.drop_column("user_profiles", "faceit_id")
