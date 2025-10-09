"""
Onboarding Schemas

Pydantic models for onboarding request/response validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Literal
from datetime import datetime


# Currency types
Currency = Literal['USD', 'CAD', 'MXN']

# Budget framework types
BudgetFramework = Literal['50_30_20', 'zero_based', 'skip']


# ============================================
# Onboarding Status
# ============================================

class OnboardingStatusResponse(BaseModel):
    """Response for onboarding status check"""
    success: bool = True
    data: dict = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "needs_onboarding": True,
                    "has_personal_space": False,
                    "has_budget": False,
                    "user_id": "uuid"
                }
            }
        }


# ============================================
# Space Creation
# ============================================

class CreateSpaceRequest(BaseModel):
    """Request to create personal space"""
    name: str = Field(..., min_length=3, max_length=50)
    currency: Currency

    @validator('name')
    def validate_name(cls, v):
        """Validate space name"""
        if not v.strip():
            raise ValueError('Space name cannot be empty')
        return v.strip()

    class Config:
        json_schema_extra = {
            "example": {
                "name": "My Personal Space",
                "currency": "USD"
            }
        }


class SpaceData(BaseModel):
    """Space data in response"""
    id: str
    name: str
    currency: Currency
    is_personal: bool
    invite_code: str
    created_at: datetime


class CreateSpaceResponse(BaseModel):
    """Response for space creation"""
    success: bool = True
    data: dict

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "space": {
                        "id": "uuid",
                        "name": "My Personal Space",
                        "currency": "USD",
                        "is_personal": True,
                        "invite_code": "ABC123",
                        "created_at": "2025-10-08T10:00:00Z"
                    }
                }
            }
        }


# ============================================
# Budget Creation
# ============================================

class CreateBudgetRequest(BaseModel):
    """Request to create budget via onboarding"""
    space_id: str
    monthly_income: Optional[float] = Field(None, gt=0)
    framework: BudgetFramework

    @validator('monthly_income')
    def validate_income(cls, v, values):
        """Validate monthly income is required if not skipping"""
        if values.get('framework') != 'skip' and (v is None or v <= 0):
            raise ValueError('Monthly income is required and must be positive')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "space_id": "uuid",
                "monthly_income": 50000,
                "framework": "50_30_20"
            }
        }


class BudgetItemData(BaseModel):
    """Budget item data"""
    id: str
    category: str
    budgeted_amount: float
    category_type: Literal['needs', 'wants', 'savings', 'income']


class BudgetData(BaseModel):
    """Budget data in response"""
    id: str
    name: str
    type: str
    total_income: float
    framework: str
    items: list[BudgetItemData]


class CreateBudgetResponse(BaseModel):
    """Response for budget creation"""
    success: bool = True
    data: dict

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "budget": {
                        "id": "uuid",
                        "name": "October 2025",
                        "type": "master",
                        "total_income": 50000,
                        "framework": "50_30_20",
                        "items": []
                    }
                }
            }
        }


# ============================================
# Complete Onboarding
# ============================================

class CompleteOnboardingResponse(BaseModel):
    """Response for completing onboarding"""
    success: bool = True
    data: dict = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "onboarding_completed": True,
                    "redirect_to": "/dashboard"
                }
            }
        }


# ============================================
# Error Response
# ============================================

class ErrorResponse(BaseModel):
    """Standard error response"""
    success: bool = False
    error: dict

    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "error": {
                    "code": "DUPLICATE_PERSONAL_SPACE",
                    "message": "You already have a personal space",
                    "details": {}
                }
            }
        }
