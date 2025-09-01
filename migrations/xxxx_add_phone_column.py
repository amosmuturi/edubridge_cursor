from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_phone_column'
down_revision = None  # or the previous revision ID
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('user', sa.Column('phone', sa.String(length=15), nullable=True))

def downgrade():
    op.drop_column('user', 'phone')
