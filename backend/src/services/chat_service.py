from .vector_store import vector_store
from .ai_service import AIService
from ..models.document import Document
from ..models.chat import ChatMessage, MessageRole
from sqlalchemy.orm import Session
from fastapi import HTTPException

class ChatService:
    @staticmethod
    async def chat(document_id: int, message: str, db: Session) -> tuple[str, list]:
        """
        Process a chat message in the context of a document.
        Returns response text and list of sources.
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
        context_results = await vector_store.search(document_id, message)
        
        context_str = ""
        sources = []
        seen_pages = set()

        if not context_results:
            context_str = "No se encontró contexto relevante en el documento."
        else:
            chunks_text = []
            for result in context_results:
                text = result["text"]
                metadata = result["metadata"]
                page_num = metadata.get("page_number", 0)
                
                chunks_text.append(f"[Página {page_num}]\n{text}")
                
                if page_num > 0 and page_num not in seen_pages:
                    sources.append({"page": page_num})
                    seen_pages.add(page_num)
            
            context_str = "\n\n".join(chunks_text)

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
        
        return response, sources
