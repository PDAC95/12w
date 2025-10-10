"""
Space Schemas

Pydantic models for space management
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Literal, Dict, Any
from datetime import datetime
from uuid import UUID


# ============================================
# Enums
# ============================================

SpaceType = Literal["personal", "shared", "project"]
Currency = Literal["USD", "CAD", "MXN"]
SpaceRole = Literal["owner", "admin", "member", "viewer"]


# ============================================
# Request Schemas
# ============================================

class CreateSpaceRequest(BaseModel):
    """Request to create a new space"""

    name: str = Field(..., min_length=1, max_length=100, description="Space name")
    description: Optional[str] = Field(None, max_length=500, description="Space description")
    space_type: SpaceType = Field(..., description="Type of space: personal, shared, or project")
    currency: Currency = Field("USD", description="Default currency for the space")

    @validator("name")
    def validate_name(cls, v):
        """Validate space name"""
        if not v or not v.strip():
            raise ValueError("Space name cannot be empty")
        return v.strip()

    class Config:
        schema_extra = {
            "example": {
                "name": "Family Budget",
                "description": "Shared budget for household expenses",
                "space_type": "shared",
                "currency": "USD"
            }
        }


class UpdateSpaceRequest(BaseModel):
    """Request to update space"""

    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    currency: Optional[Currency] = None
    timezone: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

    @validator("name")
    def validate_name(cls, v):
        """Validate space name"""
        if v is not None:
            if not v.strip():
                raise ValueError("Space name cannot be empty")
            return v.strip()
        return v


class JoinSpaceRequest(BaseModel):
    """Request to join space with invite code"""

    invite_code: str = Field(..., min_length=6, max_length=6, description="6-character invite code")

    @validator("invite_code")
    def validate_invite_code(cls, v):
        """Validate and normalize invite code"""
        code = v.strip().upper()
        if len(code) != 6:
            raise ValueError("Invite code must be exactly 6 characters")
        return code

    class Config:
        schema_extra = {
            "example": {
                "invite_code": "ABC123"
            }
        }


class UpdateMemberRoleRequest(BaseModel):
    """Request to update member role"""

    role: SpaceRole = Field(..., description="New role for member")


# ============================================
# Response Schemas
# ============================================

class SpaceMemberResponse(BaseModel):
    """Space member data"""

    id: UUID
    space_id: UUID
    user_id: UUID
    role: SpaceRole
    is_active: bool
    joined_at: datetime
    left_at: Optional[datetime] = None

    # User info (optional, from joins)
    username: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "space_id": "223e4567-e89b-12d3-a456-426614174000",
                "user_id": "323e4567-e89b-12d3-a456-426614174000",
                "role": "owner",
                "is_active": True,
                "joined_at": "2025-10-10T10:00:00Z",
                "username": "john_doe",
                "full_name": "John Doe"
            }
        }


class SpaceResponse(BaseModel):
    """Space data"""

    id: UUID
    name: str
    description: Optional[str] = None
    space_type: SpaceType
    invite_code: str
    currency: Currency
    timezone: str
    settings: Dict[str, Any]
    is_active: bool
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    # Optional relationships
    members: Optional[list[SpaceMemberResponse]] = None
    member_count: Optional[int] = None
    user_role: Optional[SpaceRole] = None

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "Family Budget",
                "description": "Shared household expenses",
                "space_type": "shared",
                "invite_code": "ABC123",
                "currency": "USD",
                "timezone": "America/New_York",
                "settings": {},
                "is_active": True,
                "created_by": "323e4567-e89b-12d3-a456-426614174000",
                "created_at": "2025-10-10T10:00:00Z",
                "updated_at": "2025-10-10T10:00:00Z",
                "member_count": 3,
                "user_role": "owner"
            }
        }


class CreateSpaceResponse(BaseModel):
    """Response after creating space"""

    success: bool = True
    data: dict = Field(..., description="Created space and membership")

    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "space": {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "name": "Family Budget",
                        "space_type": "shared",
                        "invite_code": "ABC123",
                        "currency": "USD",
                        "created_at": "2025-10-10T10:00:00Z"
                    },
                    "member": {
                        "id": "223e4567-e89b-12d3-a456-426614174000",
                        "role": "owner",
                        "joined_at": "2025-10-10T10:00:00Z"
                    }
                }
            }
        }


class ListSpacesResponse(BaseModel):
    """Response with list of spaces"""

    success: bool = True
    data: dict = Field(..., description="List of spaces")

    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "spaces": [
                        {
                            "id": "123e4567-e89b-12d3-a456-426614174000",
                            "name": "Personal Budget",
                            "space_type": "personal",
                            "member_count": 1,
                            "user_role": "owner"
                        }
                    ],
                    "total": 1
                }
            }
        }


class GetSpaceResponse(BaseModel):
    """Response with single space"""

    success: bool = True
    data: dict = Field(..., description="Space details")


class UpdateSpaceResponse(BaseModel):
    """Response after updating space"""

    success: bool = True
    data: dict = Field(..., description="Updated space")


class DeleteSpaceResponse(BaseModel):
    """Response after deleting space"""

    success: bool = True
    data: dict = Field(..., description="Deletion confirmation")

    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "message": "Space deleted successfully"
                }
            }
        }


class JoinSpaceResponse(BaseModel):
    """Response after joining space"""

    success: bool = True
    data: dict = Field(..., description="Space and membership")

    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "space": {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "name": "Family Budget",
                        "space_type": "shared"
                    },
                    "member": {
                        "id": "223e4567-e89b-12d3-a456-426614174000",
                        "role": "member",
                        "joined_at": "2025-10-10T10:00:00Z"
                    }
                }
            }
        }


class LeaveSpaceResponse(BaseModel):
    """Response after leaving space"""

    success: bool = True
    data: dict = Field(..., description="Leave confirmation")

    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "message": "Left space successfully"
                }
            }
        }


class GetSpaceMembersResponse(BaseModel):
    """Response with space members"""

    success: bool = True
    data: dict = Field(..., description="List of members")


class UpdateMemberRoleResponse(BaseModel):
    """Response after updating member role"""

    success: bool = True
    data: dict = Field(..., description="Updated member")


class RemoveMemberResponse(BaseModel):
    """Response after removing member"""

    success: bool = True
    data: dict = Field(..., description="Removal confirmation")


class ErrorResponse(BaseModel):
    """Error response"""

    success: bool = False
    error: dict = Field(..., description="Error details")

    class Config:
        schema_extra = {
            "example": {
                "success": False,
                "error": {
                    "code": "SPACE_NOT_FOUND",
                    "message": "Space not found",
                    "details": {}
                }
            }
        }
