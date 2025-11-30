import asyncio
import random

class AIService:
    @staticmethod
    async def generate_summary(text: str) -> str:
        """
        Mock summary generation.
        """
        await asyncio.sleep(2) # Simulate latency
        return (
            "Este es un resumen generado por el servicio de IA simulado (Mock). "
            "El documento parece tratar sobre temas académicos importantes. "
            "En un entorno de producción, aquí verías un resumen real generado por OpenAI."
        )

    @staticmethod
    async def get_embeddings(text: str) -> list[float]:
        """
        Mock embeddings generation.
        """
        # Return a random vector of dimension 1536 (like OpenAI)
        return [random.random() for _ in range(1536)]

    @staticmethod
    async def generate_chat_response(context: str, question: str) -> str:
        """
        Mock chat response.
        """
        await asyncio.sleep(1)
        return (
            f"Respuesta simulada para: '{question}'.\n\n"
            "Basado en el contexto (simulado), el documento menciona conceptos clave relacionados con tu pregunta. "
            "Esta respuesta es un placeholder hasta que se conecte una API real."
        )
