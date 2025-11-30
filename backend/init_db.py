from src.db.base import Base
from src.db.connection import engine
from src.models.user import User
from src.models.document import Document

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    init_db()
