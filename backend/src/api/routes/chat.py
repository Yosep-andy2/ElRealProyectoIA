from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...db.connection import get_db
from ...services.chat_service import ChatService
from ...schemas.chat import ChatRequest, ChatResponse

router = APIRouter()

@router.post("/{document_id}/chat", response_model=ChatResponse)
async def chat_with_document(
    document_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Send a message to the document chat.
    """
    response = await ChatService.chat(document_id, request.message, db)
    return ChatResponse(response=response)
