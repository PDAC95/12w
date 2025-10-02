from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from .core.config import settings

# Crear instancia de FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """
    Endpoint raíz - Información básica de la API
    """
    return {
        "message": "Wallai API - Financial Management System",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint - Verifica que la aplicación está funcionando

    Returns:
        dict: Estado de salud de la aplicación
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


# Evento de startup
@app.on_event("startup")
async def startup_event():
    """
    Tareas a ejecutar al iniciar la aplicación
    """
    print(f"🚀 Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    print(f"📝 Environment: {settings.ENVIRONMENT}")
    print(f"📚 Docs available at: http://{settings.HOST}:{settings.PORT}/docs")


# Evento de shutdown
@app.on_event("shutdown")
async def shutdown_event():
    """
    Tareas a ejecutar al cerrar la aplicación
    """
    print(f"👋 Shutting down {settings.PROJECT_NAME}")
