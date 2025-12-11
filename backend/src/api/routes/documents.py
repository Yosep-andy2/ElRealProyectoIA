from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from ...db.connection import get_db
from ...models.document import Document, DocumentStatus
from ...utils.file_handler import FileHandler
from ...schemas.document import DocumentResponse
from ...services.document_processor import DocumentProcessor

router = APIRouter()

from ...api import deps
from ...models.user import User

@router.post("/upload", status_code=201, response_model=DocumentResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Upload a new document and start processing.
    """
    # Save file physically
    file_info = await FileHandler.save_file(file)
    
    # Create DB record
    doc = Document(
        title=file_info["filename"],
        filename=file_info["saved_filename"],
        file_path=file_info["file_path"],
        file_type=file_info["file_type"],
        status=DocumentStatus.UPLOADED,
        user_id=current_user.id
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    # Trigger background processing
    background_tasks.add_task(DocumentProcessor.process_document, doc.id, db)
    
    return doc

@router.get("/", response_model=List[DocumentResponse])
def get_documents(
    skip: int = 0, 
    limit: int = 100,
    search: str = None,
    status: DocumentStatus = None,
    sort_by: str = "created_at",
    order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Retrieve documents with filtering and sorting.
    """
    from sqlalchemy import desc, asc
    
    query = db.query(Document).filter(Document.user_id == current_user.id)
    
    # Filtering
    if search:
        query = query.filter(Document.title.ilike(f"%{search}%"))
    
    if status:
        query = query.filter(Document.status == status)
        
    # Sorting
    sort_column = getattr(Document, sort_by, Document.created_at)
    if order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
        
    docs = query.offset(skip).limit(limit).all()
    return docs

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Get a specific document by ID.
    """
    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    if doc is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.delete("/{document_id}", status_code=204)
async def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Delete a document and its associated file.
    """
    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete physical file
    await FileHandler.delete_file(doc.file_path)
    
    # Delete from DB
    db.delete(doc)
    db.commit()
    
    return None

@router.get("/{document_id}/file")
async def get_document_file(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Serve the actual document file.
    """
    from fastapi.responses import FileResponse
    from pathlib import Path
    
    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    file_path = Path(doc.file_path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    return FileResponse(
        path=str(file_path),
        media_type="application/pdf",
        filename=doc.filename
    )

@router.get("/{document_id}/export-chat")
async def export_chat(
    document_id: int,
    format: str = "json",
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Export chat history for a document in specified format (json, txt, md).
    """
    from fastapi.responses import JSONResponse, Response
    from ...models.chat import ChatMessage
    import json
    from datetime import datetime

    # Verify document ownership
    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Get chat history
    messages = db.query(ChatMessage).filter(
        ChatMessage.document_id == document_id
    ).order_by(ChatMessage.created_at).all()

    if not messages:
        raise HTTPException(status_code=404, detail="No chat history found")

    # Format data
    chat_data = [
        {
            "role": msg.role.value,
            "content": msg.content,
            "timestamp": msg.created_at.isoformat()
        }
        for msg in messages
    ]

    filename = f"chat_export_{doc.title}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

    if format == "json":
        return JSONResponse(
            content={"document": doc.title, "messages": chat_data},
            headers={"Content-Disposition": f"attachment; filename={filename}.json"}
        )
    
    elif format == "txt":
        content = f"Chat History - {doc.title}\nExported: {datetime.now()}\n\n"
        for msg in chat_data:
            content += f"[{msg['timestamp']}] {msg['role'].upper()}:\n{msg['content']}\n\n{'-'*50}\n\n"
        
        return Response(
            content=content,
            media_type="text/plain",
            headers={"Content-Disposition": f"attachment; filename={filename}.txt"}
        )
    
    elif format == "md":
        content = f"# Chat History - {doc.title}\n*Exported: {datetime.now()}*\n\n"
        for msg in chat_data:
            role_icon = "👤" if msg['role'] == "user" else "🤖"
            content += f"### {role_icon} {msg['role'].title()}\n{msg['content']}\n\n---\n\n"
            
        return Response(
            content=content,
            media_type="text/markdown",
            headers={"Content-Disposition": f"attachment; filename={filename}.md"}
        )
    
    else:
        raise HTTPException(status_code=400, detail="Invalid format. Use json, txt, or md")

@router.post("/{document_id}/glossary", response_model=List[dict])
async def generate_document_glossary(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Generate a glossary of keywords and definitions for the document.
    """
    from ...services.ai_service import AIService
    from ...parsers.pdf_parser import PDFParser

    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    try:
        # 1. Extract text (using existing parser logic)
        # In a production app, we should probably cache this text or store it in DB
        text_content = ""
        if doc.file_type == "application/pdf":
            parse_result = PDFParser.extract_text(doc.file_path)
            text_content = parse_result["text"]
        else:
             raise HTTPException(status_code=400, detail="Only PDF files are supported for glossary generation currently")
             
        # 2. Generate glossary
        glossary = await AIService.generate_glossary(text_content)
        return glossary
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating glossary: {str(e)}")
