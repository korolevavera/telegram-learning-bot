"""add payload column to admin_content (fix missing column)

Revision ID: o8g9b0c1d2e3
Revises: n7f8a9b0c1d2
Create Date: 2026-08-17

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "o8g9b0c1d2e3"
down_revision: Union[str, None] = "n7f8a9b0c1d2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE admin_content ADD COLUMN IF NOT EXISTS "
        "payload VARCHAR(4096) NOT NULL DEFAULT '{}'"
    )


def downgrade() -> None:
    op.drop_column("admin_content", "payload")
