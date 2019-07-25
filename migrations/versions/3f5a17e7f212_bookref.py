"""bookref

Revision ID: 3f5a17e7f212
Revises: 7ee42a5abd85
Create Date: 2019-07-24 20:03:47.262577

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3f5a17e7f212'
down_revision = '7ee42a5abd85'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('book_ref',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('book', sa.String(length=20), nullable=False),
    sa.Column('num_chapters', sa.String(length=20), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('book'),
    sa.UniqueConstraint('num_chapters')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('book_ref')
    # ### end Alembic commands ###
