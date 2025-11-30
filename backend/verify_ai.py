import asyncio
import os
import sys
from dotenv import load_dotenv

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

# Load env vars
load_dotenv()

from src.services.ai_service import AIService
from src.services.vector_store import vector_store

async def main():
    print("--- Verifying AI Integration ---")
    
    # 1. Test OpenAI Connection (Summary)
    print("\n1. Testing OpenAI Summary Generation...")
    sample_text = """
    Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. 
    AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.
    The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving".
    """
    try:
        summary = await AIService.generate_summary(sample_text)
        if "Error" in summary:
            print(f"❌ Summary Failed: {summary}")
        else:
            print(f"✅ Summary Success: {summary[:100]}...")
    except Exception as e:
        print(f"❌ Summary Failed: {e}")
        return

    # 2. Test Embeddings
    print("\n2. Testing OpenAI Embeddings...")
    try:
        embedding = await AIService.get_embeddings("Test sentence")
        print(f"✅ Embeddings Success: Length {len(embedding)}")
    except Exception as e:
        print(f"❌ Embeddings Failed: {e}")
        return

    # 3. Test Vector Store (ChromaDB)
    print("\n3. Testing ChromaDB Vector Store...")
    doc_id = 999
    try:
        # Add
        await vector_store.add_document(doc_id, sample_text)
        print("✅ Add Document Success")
        
        # Search
        results = await vector_store.search(doc_id, "machine learning")
        print(f"✅ Search Success: Found {len(results)} chunks")
        if results:
            print(f"   First match: {results[0][:50]}...")
            
    except Exception as e:
        print(f"❌ Vector Store Failed: {e}")
        return

    print("\n--- Verification Complete ---")

if __name__ == "__main__":
    asyncio.run(main())
