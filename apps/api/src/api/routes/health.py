"""Health Check Route"""
from fastapi import APIRouter
from datetime import datetime
from ...core.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    """
    Health check endpoint

    Returns the health status of the API, including:
    - Status: ok
    - Environment
    - Timestamp
    - Version
    """
    return {
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.APP_VERSION,
        "app": settings.APP_NAME
    }
