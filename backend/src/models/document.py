from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..db.base import Base

class DocumentStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    filename = Column(String)
    file_path = Column(String)
    file_type = Column(String)
    status = Column(String, default=DocumentStatus.UPLOADED)
    
    # Metadata
    page_count = Column(Integer, nullable=True)
    author = Column(String, nullable=True)
    
    # Content
    summary_short = Column(Text, nullable=True)
    summary_long = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Owner
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="documents")
    
    # Chat messages
    chat_messages = relationship("ChatMessage", back_populates="document", cascade="all, delete-orphan")
