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

    @staticmethod
    async def generate_glossary(text: str) -> list[dict]:
        """
        Extract keywords and definitions using Gemini.
        """
        try:
            model = AIService._get_model()
            
            prompt = f"""Analiza el siguiente texto y extrae las 10-15 palabras clave, términos técnicos o conceptos más importantes.
Para cada término, genera una definición breve y clara basada en el contexto o en conocimiento general si es un término estándar.
Devuelve el resultado SOLO como una lista JSON válida, sin texto adicional ni bloques de código markdown.

Formato esperado:
[
    {{"term": "Palabra Clave", "definition": "Definición clara y concisa."}},
    ...
]

Texto:
{text[:6000]}
"""
            
            response = model.generate_content(prompt)
            
            # Clean response if it contains markdown code blocks
            clean_text = response.text.replace("```json", "").replace("```", "").strip()
            
            import json
            return json.loads(clean_text)
            
        except Exception as e:
            print(f"Error generating glossary with Gemini: {e}")
            return []

    @staticmethod
    async def generate_quiz(text: str) -> list[dict]:
        """
        Generate a multiple choice quiz using Gemini.
        """
        try:
            model = AIService._get_model()
            
            prompt = f"""Genera un examen tipo certificación "IBM" de 10 preguntas de opción múltiple basado en el siguiente texto.
Las preguntas deben evaluar la comprensión profunda y la aplicación de conceptos, no solo la memorización.
Formato de salida: SOLO una lista JSON válida.

Estructura de cada pregunta:
{{
    "question": "Texto de la pregunta",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correct_answer": 0, (índice de la respuesta correcta: 0, 1, 2 o 3)
    "explanation": "Breve explicación de por qué es la respuesta correcta."
}}

Texto:
{text[:8000]}
"""
            
            response = model.generate_content(prompt)
            
            # Clean response if it contains markdown code blocks
            clean_text = response.text.replace("```json", "").replace("```", "").strip()
            
            import json
            return json.loads(clean_text)
            
        except Exception as e:
            print(f"Error generating quiz with Gemini: {e}")
            return []

    @staticmethod
    async def generate_study_guide(text: str) -> str:
        """
        Generate a comprehensive study guide in Markdown format.
        """
        try:
            model = AIService._get_model()
            
            prompt = f"""Actúa como un profesor experto y crea una Guía de Estudio detallada y estructurada basada en el siguiente texto.
La guía debe estar en formato Markdown puro para ser descargada y leída fácilmente.

Estructura requerida:
# Guía de Estudio: [Título Conceptutal]

## 1. Resumen Ejecutivo
Un párrafo que sintetice la idea central del documento.

## 2. Conceptos Clave
Lista detallada de los conceptos más importantes. Usa **negritas** para los términos y explicaciones claras.

## 3. Puntos Importantes y Citas
Extractos clave o ideas fuerza que el estudiante debe recordar.

## 4. Preguntas de Reflexión
3-4 preguntas abiertas para ayudar a profundizar en el tema.

Texto base:
{text[:10000]}
"""
            
            response = model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            print(f"Error generating study guide with Gemini: {e}")
            return "# Error al generar la guía\nLo siento, ocurrió un error. Intenta de nuevo."

