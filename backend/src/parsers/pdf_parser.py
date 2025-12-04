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
            pages = []
            
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text()
                text += page_text + "\n"
                pages.append({
                    "page_number": i + 1,
                    "text": page_text
                })
            
            return {
                "text": text,
                "pages": pages,
                "page_count": len(reader.pages),
                "metadata": reader.metadata
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error parsing PDF: {str(e)}")
