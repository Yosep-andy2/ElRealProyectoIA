from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from ...db.connection import get_db
from ...models.document import Document, DocumentStatus

router = APIRouter()

@router.post("/upload", status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a new document.
    """
    # TODO: Implement actual file saving logic
    doc = Document(
        title=file.filename,
        filename=file.filename,
        file_type=file.content_type,
        status=DocumentStatus.UPLOADED
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.get("/", response_model=List[dict])
def get_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all documents.
    """
    docs = db.query(Document).offset(skip).limit(limit).all()
    return docs

@router.get("/{document_id}")
def get_document(document_id: int, db: Session = Depends(get_db)):
    """
    Get a specific document by ID.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if doc is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc
