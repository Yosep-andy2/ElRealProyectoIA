import logging
from typing import List, Optional
from openai import AsyncOpenAI
from ..config import settings

logger = logging.getLogger(__name__)

class AIService:
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    @classmethod
    async def generate_summary(cls, text: str) -> str:
        """
        Generates a summary of the given text using OpenAI GPT model.
        """
        try:
            # Truncate text if too long to avoid token limits (simple truncation for MVP)
            # In a real app, we'd use a tokenizer to count tokens or Map-Reduce for long docs.
            truncated_text = text[:12000] 

            response = await cls.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Eres un asistente académico experto. Tu objetivo es resumir textos complejos de manera clara y concisa, destacando los puntos clave, la metodología y las conclusiones."},
                    {"role": "user", "content": f"Por favor, resume el siguiente texto académico:\n\n{truncated_text}"}
                ],
                temperature=0.5,
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error generating summary: {str(e)}")
            return "Error al generar el resumen con IA."

    @classmethod
    async def get_embeddings(cls, text: str) -> List[float]:
        """
        Generates embeddings for a given text using OpenAI.
        """
        try:
            text = text.replace("\n", " ")
            response = await cls.client.embeddings.create(
                input=[text],
                model="text-embedding-3-small"
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            raise e

    @classmethod
    async def generate_chat_response(cls, context: str, question: str) -> str:
        """
        Generates a response to a user question based on the provided context.
        """
        try:
            response = await cls.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Eres un asistente útil y preciso. Responde a la pregunta del usuario basándote ÚNICAMENTE en el contexto proporcionado. Si la respuesta no está en el contexto, indica que no tienes esa información."},
                    {"role": "user", "content": f"Contexto:\n{context}\n\nPregunta: {question}"}
                ],
                temperature=0.3, # Lower temperature for more factual responses
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error generating chat response: {str(e)}")
            return "Lo siento, hubo un error al procesar tu pregunta."
