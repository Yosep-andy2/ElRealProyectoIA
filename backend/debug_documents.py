from sqlalchemy.orm import Session
from src.db.connection import SessionLocal
from src.models.user import User
from src.models.document import Document

def list_user_documents(email):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"[ERROR] User {email} NOT FOUND.")
            return

        print(f"[OK] Found user {email} (ID: {user.id})")
        
        docs = db.query(Document).filter(Document.user_id == user.id).all()
        
        if not docs:
            print(f"[INFO] No documents found for user {email}.")
        else:
            print(f"[OK] Found {len(docs)} documents:")
            for doc in docs:
                print(f"   - ID: {doc.id}, Title: {doc.title}, Status: {doc.status}")
            
    finally:
        db.close()

if __name__ == "__main__":
    list_user_documents("test@example.com")
