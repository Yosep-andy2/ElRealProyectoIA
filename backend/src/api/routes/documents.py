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
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Retrieve all documents for the current user.
    """
    docs = db.query(Document).filter(Document.user_id == current_user.id).offset(skip).limit(limit).all()
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
