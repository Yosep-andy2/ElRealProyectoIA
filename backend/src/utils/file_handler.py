import os
import shutil
import uuid
from fastapi import UploadFile, HTTPException
from pathlib import Path

UPLOAD_DIR = Path("storage/documents")

# Ensure upload directory exists
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".epub"}

class FileHandler:
    @staticmethod
    async def save_file(file: UploadFile) -> dict:
        """
        Saves an uploaded file to the storage directory.
        Returns a dictionary with file details.
        """
        file_ext = Path(file.filename).suffix.lower()
        
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            )
            
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        try:
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                
            return {
                "filename": file.filename,
                "saved_filename": unique_filename,
                "file_path": str(file_path),
                "file_type": file.content_type,
                "file_size": os.path.getsize(file_path)
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
