from sqlalchemy.orm import Session
from src.db.connection import SessionLocal
from src.models.user import User
from src.models.document import Document
from src.models.chat import ChatMessage
from src.core.security import verify_password, get_password_hash

def check_user(email, password):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"[ERROR] User {email} NOT FOUND in database.")
            return

        print(f"[OK] User {email} found.")
        print(f"   ID: {user.id}")
        print(f"   Is Active: {user.is_active}")
        
        if verify_password(password, user.hashed_password):
            print("[OK] Password verification SUCCESSFUL.")
        else:
            print("[ERROR] Password verification FAILED.")
            print(f"   Stored Hash: {user.hashed_password}")
            print(f"   New Hash of '{password}': {get_password_hash(password)}")
            
    finally:
        db.close()

if __name__ == "__main__":
    check_user("test@example.com", "password123")
