from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Any
from datetime import datetime, timedelta
from ...db.connection import get_db
from ...models.document import Document, DocumentStatus
from ...api import deps
from ...models.user import User

router = APIRouter()

@router.get("/stats")
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Get statistics for the current user.
    """
    # 1. Basic Counts
    total_documents = db.query(Document).filter(Document.user_id == current_user.id).count()
    
    processed_documents = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.status == DocumentStatus.COMPLETED
    ).count()
    
    # 2. Total Pages (sum)
    total_pages = db.query(func.sum(Document.page_count)).filter(
        Document.user_id == current_user.id
    ).scalar() or 0
    
    # 3. Activity History (Last 7 days)
    # Group by date. SQLite specific date function might be needed, 
    # but let's try a generic approach or fetch and process in python for simplicity/compatibility
    
    # Calculate date 7 days ago
    seven_days_ago = datetime.now() - timedelta(days=6)
    
    recent_docs = db.query(Document.created_at).filter(
        Document.user_id == current_user.id,
        Document.created_at >= seven_days_ago
    ).all()
    
    # Process in Python to ensure all last 7 days are present even if count is 0
    activity_map = {}
    for i in range(7):
        date = (seven_days_ago + timedelta(days=i)).strftime("%Y-%m-%d")
        activity_map[date] = 0
        
    for doc in recent_docs:
        if doc.created_at:
            date_str = doc.created_at.strftime("%Y-%m-%d")
            if date_str in activity_map:
                activity_map[date_str] += 1
                
    activity_history = [
        {"date": date, "count": count} 
        for date, count in activity_map.items()
    ]
    
    # 4. Storage Used (Mock for now, or sum file sizes if we had that column)
    # We don't have file_size column, so we'll estimate or leave as 0
    # Let's estimate 1 page ~= 50KB
    storage_used_mb = round((total_pages * 50) / 1024, 2)

    return {
        "total_documents": total_documents,
        "processed_documents": processed_documents,
        "total_pages": total_pages,
        "storage_used_mb": storage_used_mb,
        "activity_history": activity_history
    }
