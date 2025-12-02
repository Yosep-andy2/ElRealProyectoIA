import chromadb
from chromadb.config import Settings
from typing import List
import os
from .ai_service import AIService
import uuid

class VectorStore:
    """
    Vector store implementation using ChromaDB.
    """
    def __init__(self):
        # Initialize persistent ChromaDB client
        persist_directory = os.path.join(os.getcwd(), "storage", "chromadb")
        os.makedirs(persist_directory, exist_ok=True)
        
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(name="documents")

    async def add_document(self, document_id: int, text: str):
        """
        Splits text into chunks, generates embeddings, and indexes them in ChromaDB.
        """
        # 1. Split text into chunks (simple splitting for now)
        chunk_size = 1000
        overlap = 100
        chunks = []
        
        # Simple character-based splitting
        for i in range(0, len(text), chunk_size - overlap):
            chunk = text[i:i + chunk_size]
            if len(chunk) > 50:  # Ignore very small chunks
                chunks.append(chunk)
        
        if not chunks:
            return

        # 2. Generate embeddings for all chunks
        # Note: In production, we should batch this if there are many chunks
        embeddings = []
        ids = []
        metadatas = []
        
        for i, chunk in enumerate(chunks):
            embedding = await AIService.get_embeddings(chunk)
            embeddings.append(embedding)
            ids.append(f"doc_{document_id}_chunk_{i}")
            metadatas.append({
                "document_id": document_id,
                "chunk_index": i,
                "text": chunk
            })

        # 3. Add to ChromaDB
        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=chunks
        )
        print(f"Indexed {len(chunks)} chunks for document {document_id}")

    async def search(self, document_id: int, query: str, limit: int = 3) -> List[str]:
        """
        Performs semantic search for a specific document.
        """
        # 1. Generate embedding for query
        query_embedding = await AIService.get_embeddings(query)
        
        # 2. Query ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=limit,
            where={"document_id": document_id}  # Filter by document_id
        )
        
        # 3. Extract text results
        if results and results['documents']:
            return results['documents'][0]
        
        return []

# Global instance
vector_store = VectorStore()
