import google.generativeai as genai
from ..config import settings

class AIService:
    @staticmethod
    def _get_model():
        """Configure and return Gemini model."""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        return genai.GenerativeModel('gemini-2.5-flash')
    
    @staticmethod
    async def generate_summary(text: str) -> str:
        """
        Generate document summary using Gemini.
        """
        try:
            model = AIService._get_model()
            
            prompt = f"""Genera un resumen conciso y claro del siguiente documento en español.
El resumen debe capturar los puntos principales y la idea general del contenido.
Máximo 3-4 oraciones.

Documento:
{text[:4000]}

Resumen:"""
            
            response = model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            print(f"Error generating summary with Gemini: {e}")
            return "Error al generar el resumen. Por favor, intenta de nuevo."

    @staticmethod
    async def get_embeddings(text: str) -> list[float]:
        """
        Generate embeddings using Gemini.
        """
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating embeddings with Gemini: {e}")
            # Return zero vector as fallback
            return [0.0] * 768

    @staticmethod
    async def generate_chat_response(context: str, question: str) -> str:
        """
        Generate chat response using Gemini with context from document.
        """
        try:
            model = AIService._get_model()
            
            prompt = f"""Eres un asistente inteligente que ayuda a responder preguntas sobre documentos.
Usa el siguiente contexto del documento para responder la pregunta del usuario de forma precisa y útil.
Si la respuesta no está en el contexto, indícalo claramente.

Contexto del documento:
{context[:3000]}

Pregunta del usuario: {question}

Respuesta (en español, clara y concisa):"""
            
            response = model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            print(f"Error generating chat response with Gemini: {e}")
            return f"Lo siento, hubo un error al procesar tu pregunta: {str(e)}"
