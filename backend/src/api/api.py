from fastapi import APIRouter
from .routes import documents, chat

api_router = APIRouter()

api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(chat.router, prefix="/documents", tags=["chat"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])
