"""User Model - Extends Supabase auth.users"""
from sqlalchemy import Column, String, Text, TIMESTAMP, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from ..core.database import Base


class User(Base):
    """
    User model extending Supabase auth.users

    Links to auth.users via id (UUID foreign key)
    Stores extended profile information and preferences
    """
    __tablename__ = "users"

    # Primary Key (references auth.users.id)
    id = Column(UUID(as_uuid=True), primary_key=True)

    # Profile Information
    username = Column(String(50), unique=True, nullable=False, index=True)
    full_name = Column(Text, nullable=True)
    avatar_url = Column(Text, nullable=True)

    # Preferences
    preferred_language = Column(String(2), default="en", nullable=False)
    currency = Column(String(3), default="USD", nullable=False)
    timezone = Column(String(50), default="America/New_York", nullable=False)

    # Settings (flexible JSON)
    settings = Column(JSON, default={}, nullable=False)

    # Timestamps
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_seen_at = Column(TIMESTAMP(timezone=True), nullable=True)

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"

    def to_dict(self):
        """Convert user to dictionary"""
        return {
            "id": str(self.id),
            "username": self.username,
            "full_name": self.full_name,
            "avatar_url": self.avatar_url,
            "preferred_language": self.preferred_language,
            "currency": self.currency,
            "timezone": self.timezone,
            "settings": self.settings,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "last_seen_at": self.last_seen_at.isoformat() if self.last_seen_at else None,
        }
