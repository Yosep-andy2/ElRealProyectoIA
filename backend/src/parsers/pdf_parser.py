import pypdf
from fastapi import HTTPException

class PDFParser:
    @staticmethod
    def extract_text(file_path: str) -> dict:
        """
        Extracts text and metadata from a PDF file.
        """
        try:
            reader = pypdf.PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            
            return {
                "text": text,
                "page_count": len(reader.pages),
                "metadata": reader.metadata
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error parsing PDF: {str(e)}")
