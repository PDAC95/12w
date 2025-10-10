"""
Currency Routes

API endpoints for currency management.
"""

from fastapi import APIRouter, Depends, Query
from supabase import Client
from typing import Annotated

from ...core.supabase import get_supabase_client
from ...services.currency_service import CurrencyService
from ...schemas.currency import (
    CurrencyResponse,
    CurrencyListResponse,
    CurrencyCreate,
    CurrencyUpdate
)

router = APIRouter(prefix="/api/currencies", tags=["currencies"])


def get_currency_service(
    supabase: Annotated[Client, Depends(get_supabase_client)]
) -> CurrencyService:
    """Dependency to get currency service"""
    return CurrencyService(supabase)


@router.get("", response_model=CurrencyListResponse)
async def get_currencies(
    include_inactive: bool = Query(False, description="Include inactive currencies"),
    service: CurrencyService = Depends(get_currency_service),
):
    """
    Get all available currencies

    Returns list of currencies ordered by display_order.
    By default, only returns active currencies.
    """
    currencies = await service.get_all_currencies(include_inactive=include_inactive)

    return CurrencyListResponse(
        currencies=currencies,
        total=len(currencies)
    )


@router.get("/{code}", response_model=CurrencyResponse)
async def get_currency(
    code: str,
    service: CurrencyService = Depends(get_currency_service),
):
    """
    Get a specific currency by code

    Args:
        code: ISO 4217 currency code (e.g., 'USD')
    """
    return await service.get_currency_by_code(code)


@router.post("", response_model=CurrencyResponse, status_code=201)
async def create_currency(
    currency_data: CurrencyCreate,
    service: CurrencyService = Depends(get_currency_service),
):
    """
    Create a new currency

    Requires admin privileges (to be implemented with auth).
    """
    return await service.create_currency(currency_data)


@router.patch("/{code}", response_model=CurrencyResponse)
async def update_currency(
    code: str,
    currency_data: CurrencyUpdate,
    service: CurrencyService = Depends(get_currency_service),
):
    """
    Update a currency

    Requires admin privileges (to be implemented with auth).
    """
    return await service.update_currency(code, currency_data)


@router.delete("/{code}", status_code=204)
async def delete_currency(
    code: str,
    service: CurrencyService = Depends(get_currency_service),
):
    """
    Delete (deactivate) a currency

    Soft deletes by setting is_active to False.
    Requires admin privileges (to be implemented with auth).
    """
    await service.delete_currency(code)
    return None
