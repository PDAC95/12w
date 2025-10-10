"""
Currency Service

Business logic for currency management operations.
"""

from typing import Optional
from supabase import Client
from ..schemas.currency import CurrencyResponse, CurrencyCreate, CurrencyUpdate
from ..core.exceptions import ValidationError, NotFoundError


class CurrencyService:
    """Service for managing currencies"""

    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client

    async def get_all_currencies(
        self,
        include_inactive: bool = False
    ) -> list[CurrencyResponse]:
        """
        Get all currencies

        Args:
            include_inactive: Whether to include inactive currencies

        Returns:
            List of currencies ordered by display_order
        """
        try:
            query = self.supabase.table("currencies").select("*")

            if not include_inactive:
                query = query.eq("is_active", True)

            query = query.order("display_order", desc=False).order("code", desc=False)

            response = query.execute()

            return [CurrencyResponse(**currency) for currency in response.data]

        except Exception as e:
            raise ValidationError(f"Failed to fetch currencies: {str(e)}")

    async def get_currency_by_code(self, code: str) -> CurrencyResponse:
        """
        Get a currency by its code

        Args:
            code: Currency code (e.g., 'USD')

        Returns:
            Currency details

        Raises:
            NotFoundError: If currency not found
        """
        try:
            response = self.supabase.table("currencies").select("*").eq("code", code.upper()).execute()

            if not response.data:
                raise NotFoundError(f"Currency '{code}' not found")

            return CurrencyResponse(**response.data[0])

        except NotFoundError:
            raise
        except Exception as e:
            raise ValidationError(f"Failed to fetch currency: {str(e)}")

    async def create_currency(self, currency_data: CurrencyCreate) -> CurrencyResponse:
        """
        Create a new currency

        Args:
            currency_data: Currency creation data

        Returns:
            Created currency

        Raises:
            ValidationError: If currency already exists or validation fails
        """
        try:
            # Check if currency already exists
            existing = self.supabase.table("currencies").select("code").eq("code", currency_data.code.upper()).execute()

            if existing.data:
                raise ValidationError(f"Currency '{currency_data.code}' already exists")

            # Create currency
            currency_dict = currency_data.model_dump()
            currency_dict["code"] = currency_dict["code"].upper()

            response = self.supabase.table("currencies").insert(currency_dict).execute()

            if not response.data:
                raise ValidationError("Failed to create currency")

            return CurrencyResponse(**response.data[0])

        except ValidationError:
            raise
        except Exception as e:
            raise ValidationError(f"Failed to create currency: {str(e)}")

    async def update_currency(
        self,
        code: str,
        currency_data: CurrencyUpdate
    ) -> CurrencyResponse:
        """
        Update a currency

        Args:
            code: Currency code to update
            currency_data: Updated currency data

        Returns:
            Updated currency

        Raises:
            NotFoundError: If currency not found
            ValidationError: If validation fails
        """
        try:
            # Check if currency exists
            await self.get_currency_by_code(code)

            # Update currency
            update_dict = currency_data.model_dump(exclude_unset=True)

            if not update_dict:
                raise ValidationError("No fields to update")

            response = self.supabase.table("currencies").update(update_dict).eq("code", code.upper()).execute()

            if not response.data:
                raise ValidationError("Failed to update currency")

            return CurrencyResponse(**response.data[0])

        except (NotFoundError, ValidationError):
            raise
        except Exception as e:
            raise ValidationError(f"Failed to update currency: {str(e)}")

    async def delete_currency(self, code: str) -> None:
        """
        Delete a currency (soft delete by setting is_active to False)

        Args:
            code: Currency code to delete

        Raises:
            NotFoundError: If currency not found
            ValidationError: If deletion fails
        """
        try:
            # Check if currency exists
            await self.get_currency_by_code(code)

            # Soft delete by setting is_active to False
            response = self.supabase.table("currencies").update({"is_active": False}).eq("code", code.upper()).execute()

            if not response.data:
                raise ValidationError("Failed to delete currency")

        except (NotFoundError, ValidationError):
            raise
        except Exception as e:
            raise ValidationError(f"Failed to delete currency: {str(e)}")
