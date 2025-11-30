from .vector_store import vector_store
from .ai_service import AIService
from ..models.document import Document
from ..models.chat import ChatMessage, MessageRole
from sqlalchemy.orm import Session
from fastapi import HTTPException

class ChatService:
    @staticmethod
    async def chat(document_id: int, message: str, db: Session) -> str:
        """
        Process a chat message in the context of a document.
        """
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")

        # 1. Save user message
        user_message = ChatMessage(
            document_id=document_id,
            role=MessageRole.USER,
            content=message
        )
        db.add(user_message)
        db.commit()

        # 2. Retrieve relevant context
        context_chunks = await vector_store.search(document_id, message)
        
        if not context_chunks:
            context_str = "No se encontró contexto relevante en el documento."
        else:
            context_str = "\n\n".join(context_chunks)

        # 3. Generate Response using AI
        response = await AIService.generate_chat_response(context_str, message)
        
        # 4. Save AI response
        ai_message = ChatMessage(
            document_id=document_id,
            role=MessageRole.AI,
            content=response
        )
        db.add(ai_message)
        db.commit()
        
        return response
