from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..models.document import DocumentStatus

class DocumentBase(BaseModel):
    title: str
    filename: str
    file_type: str
    status: DocumentStatus = DocumentStatus.UPLOADED

class DocumentCreate(DocumentBase):
    file_path: str

class DocumentResponse(DocumentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Metadata
    page_count: Optional[int] = None
    author: Optional[str] = None
    summary_short: Optional[str] = None


    class Config:
        from_attributes = True

class GlossaryItem(BaseModel):
    term: str
    definition: str

class GlossaryResponse(BaseModel):
    items: list[GlossaryItem]
