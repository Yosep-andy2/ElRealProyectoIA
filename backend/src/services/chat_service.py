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
        # Note: In a real app, we would ensure the doc is indexed first.
        # For this mock, we might need to "index" it on the fly if not present, 
        # or assume it was indexed during processing.
        # Let's mock indexing if empty for this session
        if document_id not in vector_store.store:
             # Try to get text from file or summary as fallback
             text_to_index = doc.summary_long or doc.summary_short or "Contenido no disponible."
             await vector_store.add_document(document_id, text_to_index)

        context_chunks = await vector_store.search(document_id, message)
        context_str = "\n\n".join(context_chunks)

        # 2. Construct Prompt
        system_prompt = (
            "Eres un asistente experto en análisis de textos académicos. "
            "Usa el siguiente contexto para responder la pregunta del usuario. "
            "Si la respuesta no está en el contexto, dilo honestamente.\n\n"
            f"Contexto:\n{context_str}"
        )

        # 3. Generate Response
        # We reuse the AIService mock, but ideally we'd have a specific chat method
        # For now, we'll simulate the response generation
        response = await AIService.generate_summary(f"{system_prompt}\n\nPregunta: {message}")
        
        # Customize the mock response slightly for chat
        return f"Respuesta basada en el documento (Contexto recuperado: {len(context_chunks)} fragmentos):\n{response}"
