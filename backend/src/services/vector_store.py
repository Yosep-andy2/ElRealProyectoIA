from typing import List, Dict

class VectorStore:
    """
    A simple in-memory vector store mock.
    """
    def __init__(self):
        self.store = {}  # doc_id -> list of chunks

    async def add_document(self, document_id: int, text: str):
        """
        Simulates splitting text into chunks and indexing them.
        """
        # Simple mock splitting by newlines or periods
        chunks = [c.strip() for c in text.replace('\n', '.').split('.') if len(c.strip()) > 20]
        self.store[document_id] = chunks

    async def search(self, document_id: int, query: str, limit: int = 3) -> List[str]:
        """
        Simulates a semantic search.
        """
        chunks = self.store.get(document_id, [])
        if not chunks:
            return []
        
        # Mock search: return first few chunks or those containing query words
        relevant_chunks = [c for c in chunks if any(word.lower() in c.lower() for word in query.split())]
        
        if not relevant_chunks:
            return chunks[:limit]
        
        return relevant_chunks[:limit]

# Global instance
vector_store = VectorStore()
