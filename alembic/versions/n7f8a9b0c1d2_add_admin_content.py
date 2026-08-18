"""add admin_content table

Revision ID: n7f8a9b0c1d2
Revises: m6f7a8b9c0d1
Create Date: 2026-08-17

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "n7f8a9b0c1d2"
down_revision: Union[str, None] = "m6f7a8b9c0d1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "admin_content",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("content_type", sa.String(length=32), nullable=False, index=True),
        sa.Column("content_key", sa.String(length=128), nullable=False),
        sa.Column("payload", sa.String(length=4096), nullable=False, server_default="{}"),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("content_type", "content_key", name="uq_admin_content"),
    )


def downgrade() -> None:
    op.drop_table("admin_content")