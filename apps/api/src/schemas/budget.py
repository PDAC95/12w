"""
Budget Schemas
==============
Pydantic schemas for budget management endpoints.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List, Literal
from uuid import UUID
from pydantic import BaseModel, Field, field_validator


# =====================================================
# ENUMS AND TYPES
# =====================================================

BudgetType = Literal["master", "secondary"]
BudgetFramework = Literal["50_30_20", "60_20_20", "zero_based", "custom"]
CategoryType = Literal["needs", "wants", "savings", "income"]


# =====================================================
# BUDGET ITEM SCHEMAS
# =====================================================

class BudgetItemBase(BaseModel):
    """Base schema for budget items"""
    category: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    category_type: CategoryType = "needs"
    budgeted_amount: Decimal = Field(default=Decimal("0"), ge=0)
    spent_amount: Decimal = Field(default=Decimal("0"), ge=0)
    icon: Optional[str] = None
    color: str = "#4ADE80"
    display_order: int = 0
    parent_id: Optional[UUID] = None
    is_parent: bool = False


class BudgetItemCreate(BudgetItemBase):
    """Schema for creating a budget item"""
    pass


class BudgetItemUpdate(BaseModel):
    """Schema for updating a budget item"""
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    category_type: Optional[CategoryType] = None
    budgeted_amount: Optional[Decimal] = Field(None, ge=0)
    spent_amount: Optional[Decimal] = Field(None, ge=0)
    icon: Optional[str] = None
    color: Optional[str] = None
    display_order: Optional[int] = None
    parent_id: Optional[UUID] = None
    is_parent: Optional[bool] = None


class BudgetItemResponse(BudgetItemBase):
    """Schema for budget item response"""
    id: UUID
    budget_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BudgetItemWithChildren(BudgetItemResponse):
    """Schema for budget item with nested children"""
    children: List["BudgetItemResponse"] = Field(default_factory=list)

    class Config:
        from_attributes = True


# Schemas for creating parent categories with children
class BudgetItemChildCreate(BaseModel):
    """Schema for creating a child item under a parent"""
    category: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    budgeted_amount: Decimal = Field(..., ge=0)
    spent_amount: Decimal = Field(default=Decimal("0"), ge=0)
    icon: Optional[str] = None
    color: Optional[str] = None
    display_order: int = 0


class ParentCategoryCreate(BaseModel):
    """Schema for creating a parent category with children"""
    category: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    category_type: CategoryType = "needs"
    icon: Optional[str] = None
    color: str = "#4ADE80"
    display_order: int = 0
    children: List[BudgetItemChildCreate] = Field(default_factory=list, min_length=1)


# =====================================================
# BUDGET SCHEMAS
# =====================================================

class BudgetBase(BaseModel):
    """Base schema for budgets"""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    type: BudgetType = "master"
    month_period: str = Field(..., pattern=r"^\d{4}-\d{2}$")  # YYYY-MM format
    framework: BudgetFramework = "custom"
    total_income: Decimal = Field(default=Decimal("0"), ge=0)
    currency: str = "USD"

    @field_validator("month_period")
    @classmethod
    def validate_month_period(cls, v: str) -> str:
        """Validate month_period is in YYYY-MM format"""
        try:
            year, month = v.split("-")
            year_int = int(year)
            month_int = int(month)
            if not (1 <= month_int <= 12):
                raise ValueError("Month must be between 01 and 12")
            if not (2000 <= year_int <= 2100):
                raise ValueError("Year must be between 2000 and 2100")
        except (ValueError, AttributeError) as e:
            raise ValueError(f"month_period must be in YYYY-MM format: {e}")
        return v


class BudgetCreate(BudgetBase):
    """Schema for creating a budget"""
    space_id: UUID
    budget_items: Optional[List[BudgetItemCreate]] = Field(default_factory=list)


class BudgetUpdate(BaseModel):
    """Schema for updating a budget"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    framework: Optional[BudgetFramework] = None
    total_income: Optional[Decimal] = Field(None, ge=0)
    currency: Optional[str] = None


class BudgetResponse(BudgetBase):
    """Schema for budget response"""
    id: UUID
    space_id: UUID
    total_budgeted: Decimal
    total_spent: Decimal
    created_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    budget_items: Optional[List[BudgetItemResponse]] = None

    class Config:
        from_attributes = True


class BudgetListResponse(BaseModel):
    """Schema for list of budgets"""
    budgets: List[BudgetResponse]
    total: int


# =====================================================
# FRAMEWORK TEMPLATES
# =====================================================

class FrameworkTemplate(BaseModel):
    """Framework template definition"""
    name: str
    description: str
    categories: List[dict]


# =====================================================
# BUDGET STATISTICS
# =====================================================

class BudgetStats(BaseModel):
    """Budget statistics response"""
    total_income: Decimal
    total_budgeted: Decimal
    total_spent: Decimal
    remaining: Decimal
    percentage_spent: float
    category_breakdown: List[dict]


# =====================================================
# HELPER SCHEMAS
# =====================================================

class MonthPeriodQuery(BaseModel):
    """Query schema for filtering by month period"""
    month_period: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$")
    type: Optional[BudgetType] = None


class BudgetReplicateRequest(BaseModel):
    """Schema for replicating budget to next month"""
    target_month_period: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    copy_amounts: bool = True
    copy_items: bool = True

    @field_validator("target_month_period")
    @classmethod
    def validate_target_month(cls, v: str) -> str:
        """Validate target month is in future"""
        try:
            year, month = v.split("-")
            year_int = int(year)
            month_int = int(month)
            if not (1 <= month_int <= 12):
                raise ValueError("Month must be between 01 and 12")
            if not (2000 <= year_int <= 2100):
                raise ValueError("Year must be between 2000 and 2100")
        except (ValueError, AttributeError) as e:
            raise ValueError(f"target_month_period must be in YYYY-MM format: {e}")
        return v
