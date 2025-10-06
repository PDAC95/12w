"""Database Configuration using SQLAlchemy 2.0"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Database connection string from environment
# For Supabase PostgreSQL, we'll use psycopg2
# SQLAlchemy 2.0 with psycopg2 uses postgresql:// (default) or postgresql+psycopg2://
DATABASE_URL = settings.DATABASE_URL  # psycopg2 is default driver

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",  # Log SQL in development
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600,  # Recycle connections after 1 hour
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency for FastAPI routes to get database session

    Usage in route:
    @router.get("/endpoint")
    def endpoint(db: Session = Depends(get_db)):
        ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
