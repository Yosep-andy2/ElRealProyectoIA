from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...db.connection import get_db
from ...services.chat_service import ChatService
from ...schemas.chat import ChatRequest, ChatResponse

router = APIRouter()

from ...api import deps
from ...models.user import User
from ...models.document import Document

@router.post("/{document_id}/chat", response_model=ChatResponse)
async def chat_with_document(
    document_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Send a message to the document chat.
    """
    # Verify ownership
    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    response = await ChatService.chat(document_id, request.message, db)
    return ChatResponse(response=response)
