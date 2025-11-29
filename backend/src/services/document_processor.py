from sqlalchemy.orm import Session
from ..models.document import Document, DocumentStatus
from ..parsers.pdf_parser import PDFParser
from ..services.ai_service import AIService
from ..services.vector_store import vector_store
import logging

logger = logging.getLogger(__name__)

class DocumentProcessor:
    @staticmethod
    async def process_document(document_id: int, db: Session):
        """
        Background task to process a document: extract text and generate summary.
        """
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            logger.error(f"Document {document_id} not found for processing")
            return

        try:
            # Update status to processing
            doc.status = DocumentStatus.PROCESSING
            db.commit()

            # 1. Extract Text
            # Note: In a real app, we might want to store the extracted text separately or in a vector DB
            if doc.file_type == "application/pdf":
                parse_result = PDFParser.extract_text(doc.file_path)
                text_content = parse_result["text"]
                doc.page_count = parse_result["page_count"]
                
                # Update metadata if available
                if parse_result["metadata"] and parse_result["metadata"].author:
                    doc.author = parse_result["metadata"].author
            else:
                # Fallback for other formats or implement other parsers
                text_content = "Contenido de texto no extraíble en esta versión."

            # 2. Generate Summary
            summary = await AIService.generate_summary(text_content)
            doc.summary_short = summary
            
            # 3. Index in Vector Store
            await vector_store.add_document(document_id, text_content)
            
            # 4. Complete
            doc.status = DocumentStatus.COMPLETED
            db.commit()
            
        except Exception as e:
            logger.error(f"Error processing document {document_id}: {str(e)}")
            doc.status = DocumentStatus.ERROR
            db.commit()
