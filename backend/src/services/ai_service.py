import asyncio
from typing import Optional

class AIService:
    @staticmethod
    async def generate_summary(text: str) -> str:
        """
        Generates a summary of the given text using AI.
        Currently a MOCK implementation.
        """
        # Simulate API latency
        await asyncio.sleep(2)
        
        # Mock summary generation
        word_count = len(text.split())
        return (
            f"Este es un resumen generado automáticamente por el sistema (MOCK). "
            f"El documento original contiene aproximadamente {word_count} palabras. "
            f"En una implementación real, aquí verías un análisis detallado de los puntos clave, "
            f"metodología y conclusiones del texto procesado."
        )

    @staticmethod
    async def extract_concepts(text: str) -> list:
        """
        Extracts key concepts from the text.
        """
        await asyncio.sleep(1)
        return ["Inteligencia Artificial", "Procesamiento de Texto", "Análisis de Datos", "Mock Concept"]
