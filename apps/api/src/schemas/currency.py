"""
Currency Schemas

Pydantic models for currency-related requests and responses.
"""

from pydantic import BaseModel, Field
from datetime import datetime


class CurrencyBase(BaseModel):
    """Base currency schema"""
    code: str = Field(..., min_length=3, max_length=3, description="ISO 4217 currency code")
    name: str = Field(..., min_length=1, max_length=100, description="Full currency name")
    symbol: str = Field(..., min_length=1, max_length=10, description="Currency symbol")
    flag_emoji: str = Field(..., min_length=1, max_length=10, description="Country flag emoji")


class CurrencyResponse(CurrencyBase):
    """Currency response schema"""
    is_active: bool = Field(..., description="Whether currency is available for selection")
    display_order: int = Field(..., description="Order for displaying currencies")
    created_at: datetime = Field(..., description="When the currency was created")
    updated_at: datetime = Field(..., description="When the currency was last updated")

    class Config:
        from_attributes = True


class CurrencyListResponse(BaseModel):
    """Response schema for listing currencies"""
    currencies: list[CurrencyResponse] = Field(..., description="List of currencies")
    total: int = Field(..., description="Total number of currencies")


class CurrencyCreate(CurrencyBase):
    """Schema for creating a new currency"""
    is_active: bool = Field(default=True, description="Whether currency is available")
    display_order: int = Field(default=0, description="Display order")


class CurrencyUpdate(BaseModel):
    """Schema for updating a currency"""
    name: str | None = Field(None, min_length=1, max_length=100)
    symbol: str | None = Field(None, min_length=1, max_length=10)
    flag_emoji: str | None = Field(None, min_length=1, max_length=10)
    is_active: bool | None = None
    display_order: int | None = None
