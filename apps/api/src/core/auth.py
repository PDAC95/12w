"""
Authentication Dependencies

JWT validation and user extraction for FastAPI endpoints
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Annotated
from jose import jwt, JWTError

from .config import settings
from .supabase import get_supabase_client

# HTTP Bearer scheme for JWT tokens
security = HTTPBearer()


async def get_current_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> str:
    """
    Extract and validate user ID from JWT token

    Args:
        credentials: Bearer token from Authorization header

    Returns:
        User UUID string

    Raises:
        HTTPException: If token is invalid or missing
    """
    token = credentials.credentials

    try:
        # Decode JWT token using Supabase JWT secret
        # Note: Supabase uses the same secret for signing JWTs
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )

        # Extract user ID from 'sub' claim
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user_id

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> dict:
    """
    Extract and validate user from JWT token
    Returns full user dict with id and email

    Args:
        credentials: Bearer token from Authorization header

    Returns:
        User dict with id, email, etc.

    Raises:
        HTTPException: If token is invalid or missing
    """
    token = credentials.credentials

    try:
        # Decode JWT token using Supabase JWT secret
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )

        # Extract user info from token
        user_id: str = payload.get("sub")
        email: str = payload.get("email")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return {
            "id": user_id,
            "email": email,
            **payload  # Include all other claims
        }

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials | None = Depends(security)
) -> str | None:
    """
    Optional authentication - returns None if no token provided

    Args:
        credentials: Optional bearer token

    Returns:
        User UUID string or None
    """
    if credentials is None:
        return None

    try:
        return await get_current_user_id(credentials)
    except HTTPException:
        return None
