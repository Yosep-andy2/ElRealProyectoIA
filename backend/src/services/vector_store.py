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

    async def add_document(self, document_id: int, text: str, pages: List[dict] = None):
        """
        Splits text into chunks, generates embeddings, and indexes them in ChromaDB.
        """
        chunk_size = 1000
        overlap = 100
        
        embeddings = []
        ids = []
        metadatas = []
        documents = []

        if pages:
            # Process per page
            for page in pages:
                page_text = page["text"]
                page_num = page["page_number"]
                
                # Split page text into chunks
                for i in range(0, len(page_text), chunk_size - overlap):
                    chunk = page_text[i:i + chunk_size]
                    if len(chunk) > 50:
                        embedding = await AIService.get_embeddings(chunk)
                        embeddings.append(embedding)
                        ids.append(f"doc_{document_id}_p{page_num}_c{i}")
                        metadatas.append({
                            "document_id": document_id,
                            "page_number": page_num,
                            "text": chunk
                        })
                        documents.append(chunk)
        else:
            # Fallback: simple character-based splitting
            chunks = []
            for i in range(0, len(text), chunk_size - overlap):
                chunk = text[i:i + chunk_size]
                if len(chunk) > 50:
                    chunks.append(chunk)
            
            for i, chunk in enumerate(chunks):
                embedding = await AIService.get_embeddings(chunk)
                embeddings.append(embedding)
                ids.append(f"doc_{document_id}_chunk_{i}")
                metadatas.append({
                    "document_id": document_id,
                    "page_number": 0, # Unknown page
                    "text": chunk
                })
                documents.append(chunk)

        if not documents:
            return

        # 3. Add to ChromaDB
        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=documents
        )
        print(f"Indexed {len(documents)} chunks for document {document_id}")

    async def search(self, document_id: int, query: str, limit: int = 3) -> List[dict]:
        """
        Performs semantic search for a specific document.
        Returns list of dicts with text and metadata.
        """
        # 1. Generate embedding for query
        query_embedding = await AIService.get_embeddings(query)
        
        # 2. Query ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=limit,
            where={"document_id": document_id}  # Filter by document_id
        )
        
        # 3. Extract results
        output = []
        if results and results['documents'] and results['documents'][0]:
            for i, doc_text in enumerate(results['documents'][0]):
                metadata = results['metadatas'][0][i] if results['metadatas'] else {}
                output.append({
                    "text": doc_text,
                    "metadata": metadata
                })
        
        return output

# Global instance
vector_store = VectorStore()
