import chromadb
from chromadb.config import Settings
from typing import List
import uuid
from .ai_service import AIService
from langchain.text_splitter import RecursiveCharacterTextSplitter

class VectorStore:
    """
    Real Vector Store implementation using ChromaDB.
    """
    def __init__(self):
        # Initialize ChromaDB client (persistent)
        self.client = chromadb.PersistentClient(path="./storage/chroma_db")
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"hnsw:space": "cosine"}
        )
        
        # Text splitter for chunking
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )

    async def add_document(self, document_id: int, text: str):
        """
        Splits text into chunks, generates embeddings, and indexes them in ChromaDB.
        """
        # 1. Split text
        chunks = self.text_splitter.split_text(text)
        
        if not chunks:
            return

        # 2. Generate Embeddings (Batch processing could be better, but loop for simplicity/error handling)
        ids = []
        embeddings = []
        metadatas = []
        documents = []

        for i, chunk in enumerate(chunks):
            try:
                embedding = await AIService.get_embeddings(chunk)
                
                ids.append(f"doc_{document_id}_chunk_{i}")
                embeddings.append(embedding)
                metadatas.append({"document_id": document_id, "chunk_index": i})
                documents.append(chunk)
            except Exception as e:
                print(f"Error generating embedding for chunk {i}: {e}")
                continue

        # 3. Add to ChromaDB
        if ids:
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=documents
            )

    async def search(self, document_id: int, query: str, limit: int = 3) -> List[str]:
        """
        Semantic search for relevant chunks in a specific document.
        """
        # 1. Generate query embedding
        query_embedding = await AIService.get_embeddings(query)
        
        # 2. Search in ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=limit,
            where={"document_id": document_id} # Filter by document
        )
        
        # 3. Return documents
        if results and results['documents']:
            return results['documents'][0]
        
        return []

# Global instance
vector_store = VectorStore()
