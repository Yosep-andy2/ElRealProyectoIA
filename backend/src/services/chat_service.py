from .vector_store import vector_store
from .ai_service import AIService
from ..models.document import Document
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

        # 1. Retrieve relevant context
        # In this real implementation, we assume the document was indexed during processing.
        # If not (e.g. old doc), we might return a message or try to index on the fly (complex).
        # For now, we rely on the processor.
        
        context_chunks = await vector_store.search(document_id, message)
        
        if not context_chunks:
            context_str = "No se encontró contexto relevante en el documento."
        else:
            context_str = "\n\n".join(context_chunks)

        # 2. Generate Response using Real AI
        response = await AIService.generate_chat_response(context_str, message)
        
        return response
