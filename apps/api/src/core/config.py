from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Configuración global de la aplicación usando Pydantic Settings.
    Las variables se cargan desde .env
    """

    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Wallai Financial Management"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True

    # Database
    DATABASE_URL: str = "postgresql://wallai_user:wallai_pass@localhost:5432/wallai_db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
    ]

    # Security
    SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION_MIN_32_CHARACTERS_LONG"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        case_sensitive = True


# Instancia global de settings
settings = Settings()
