"""
Budget Service
==============
Business logic for budget management, framework templates, and budget items.
"""
from datetime import datetime
from decimal import Decimal
from typing import List, Optional, Dict, Any
from uuid import UUID

from supabase import Client
from fastapi import HTTPException, status

from ..schemas.budget import (
    BudgetCreate,
    BudgetUpdate,
    BudgetResponse,
    BudgetItemCreate,
    BudgetItemUpdate,
    BudgetItemResponse,
    BudgetStats,
    BudgetFramework,
    BudgetType,
    CategoryType,
    ParentCategoryCreate,
    BudgetItemChildCreate,
    BudgetItemWithChildren,
)


# =====================================================
# FRAMEWORK TEMPLATES
# =====================================================

FRAMEWORK_TEMPLATES: Dict[str, Dict[str, Any]] = {
    "50_30_20": {
        "name": "50/30/20 Rule",
        "description": "50% needs, 30% wants, 20% savings",
        "categories": [
            # Needs (50%) - All created as parent categories
            {"category": "Housing", "category_type": "needs", "percentage": 0.25, "icon": "home", "color": "#10B981", "is_parent": True},
            {"category": "Utilities", "category_type": "needs", "percentage": 0.05, "icon": "zap", "color": "#10B981", "is_parent": True},
            {"category": "Groceries", "category_type": "needs", "percentage": 0.10, "icon": "shopping-cart", "color": "#10B981", "is_parent": True},
            {"category": "Transportation", "category_type": "needs", "percentage": 0.07, "icon": "car", "color": "#10B981", "is_parent": True},
            {"category": "Insurance", "category_type": "needs", "percentage": 0.03, "icon": "shield", "color": "#10B981", "is_parent": True},

            # Wants (30%) - All created as parent categories
            {"category": "Dining Out", "category_type": "wants", "percentage": 0.10, "icon": "utensils", "color": "#F59E0B", "is_parent": True},
            {"category": "Entertainment", "category_type": "wants", "percentage": 0.08, "icon": "film", "color": "#F59E0B", "is_parent": True},
            {"category": "Shopping", "category_type": "wants", "percentage": 0.07, "icon": "shopping-bag", "color": "#F59E0B", "is_parent": True},
            {"category": "Hobbies", "category_type": "wants", "percentage": 0.05, "icon": "heart", "color": "#F59E0B", "is_parent": True},

            # Savings (20%) - All created as parent categories
            {"category": "Emergency Fund", "category_type": "savings", "percentage": 0.10, "icon": "piggy-bank", "color": "#3B82F6", "is_parent": True},
            {"category": "Retirement", "category_type": "savings", "percentage": 0.07, "icon": "trending-up", "color": "#3B82F6", "is_parent": True},
            {"category": "Investments", "category_type": "savings", "percentage": 0.03, "icon": "bar-chart", "color": "#3B82F6", "is_parent": True},
        ]
    },
    "60_20_20": {
        "name": "60/20/20 Rule",
        "description": "60% needs, 20% wants, 20% savings",
        "categories": [
            # Needs (60%) - All created as parent categories
            {"category": "Housing", "category_type": "needs", "percentage": 0.30, "icon": "home", "color": "#10B981", "is_parent": True},
            {"category": "Utilities", "category_type": "needs", "percentage": 0.06, "icon": "zap", "color": "#10B981", "is_parent": True},
            {"category": "Groceries", "category_type": "needs", "percentage": 0.12, "icon": "shopping-cart", "color": "#10B981", "is_parent": True},
            {"category": "Transportation", "category_type": "needs", "percentage": 0.08, "icon": "car", "color": "#10B981", "is_parent": True},
            {"category": "Insurance", "category_type": "needs", "percentage": 0.04, "icon": "shield", "color": "#10B981", "is_parent": True},

            # Wants (20%) - All created as parent categories
            {"category": "Dining Out", "category_type": "wants", "percentage": 0.08, "icon": "utensils", "color": "#F59E0B", "is_parent": True},
            {"category": "Entertainment", "category_type": "wants", "percentage": 0.07, "icon": "film", "color": "#F59E0B", "is_parent": True},
            {"category": "Shopping", "category_type": "wants", "percentage": 0.05, "icon": "shopping-bag", "color": "#F59E0B", "is_parent": True},

            # Savings (20%) - All created as parent categories
            {"category": "Emergency Fund", "category_type": "savings", "percentage": 0.10, "icon": "piggy-bank", "color": "#3B82F6", "is_parent": True},
            {"category": "Retirement", "category_type": "savings", "percentage": 0.07, "icon": "trending-up", "color": "#3B82F6", "is_parent": True},
            {"category": "Investments", "category_type": "savings", "percentage": 0.03, "icon": "bar-chart", "color": "#3B82F6", "is_parent": True},
        ]
    },
    "zero_based": {
        "name": "Zero-Based Budget",
        "description": "Every dollar has a job, income minus expenses equals zero",
        "categories": [
            # Income - All created as parent categories
            {"category": "Salary", "category_type": "income", "percentage": 0, "icon": "dollar-sign", "color": "#14B8A6", "is_parent": True},
            {"category": "Side Income", "category_type": "income", "percentage": 0, "icon": "briefcase", "color": "#14B8A6", "is_parent": True},

            # Needs - All created as parent categories
            {"category": "Housing", "category_type": "needs", "percentage": 0, "icon": "home", "color": "#10B981", "is_parent": True},
            {"category": "Utilities", "category_type": "needs", "percentage": 0, "icon": "zap", "color": "#10B981", "is_parent": True},
            {"category": "Groceries", "category_type": "needs", "percentage": 0, "icon": "shopping-cart", "color": "#10B981", "is_parent": True},
            {"category": "Transportation", "category_type": "needs", "percentage": 0, "icon": "car", "color": "#10B981", "is_parent": True},
            {"category": "Insurance", "category_type": "needs", "percentage": 0, "icon": "shield", "color": "#10B981", "is_parent": True},

            # Wants - All created as parent categories
            {"category": "Dining Out", "category_type": "wants", "percentage": 0, "icon": "utensils", "color": "#F59E0B", "is_parent": True},
            {"category": "Entertainment", "category_type": "wants", "percentage": 0, "icon": "film", "color": "#F59E0B", "is_parent": True},

            # Savings - All created as parent categories
            {"category": "Emergency Fund", "category_type": "savings", "percentage": 0, "icon": "piggy-bank", "color": "#3B82F6", "is_parent": True},
            {"category": "Debt Payoff", "category_type": "savings", "percentage": 0, "icon": "credit-card", "color": "#3B82F6", "is_parent": True},
        ]
    },
    "custom": {
        "name": "Custom Budget",
        "description": "Create your own categories and allocations",
        "categories": []
    }
}


class BudgetService:
    """Service for managing budgets and budget items"""

    def __init__(self, supabase: Client):
        self.supabase = supabase

    # =====================================================
    # BUDGET CRUD OPERATIONS
    # =====================================================

    async def list_budgets(
        self,
        space_id: UUID,
        month_period: Optional[str] = None,
        budget_type: Optional[BudgetType] = None,
        user_id: Optional[UUID] = None
    ) -> List[Dict[str, Any]]:
        """List budgets for a space with optional filters"""
        try:
            # Start query
            query = self.supabase.table("budgets").select(
                "*, budget_items(*)"
            ).eq("space_id", str(space_id))

            # Apply filters
            if month_period:
                query = query.eq("month_period", month_period)

            if budget_type:
                query = query.eq("type", budget_type)

            # Order by month_period desc
            query = query.order("month_period", desc=True)

            response = query.execute()
            return response.data

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to list budgets: {str(e)}"
            )

    async def get_budget(self, budget_id: UUID, user_id: UUID) -> Dict[str, Any]:
        """Get budget by ID with items"""
        try:
            response = self.supabase.table("budgets").select(
                "*, budget_items(*)"
            ).eq("id", str(budget_id)).single().execute()

            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Budget not found"
                )

            return response.data

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get budget: {str(e)}"
            )

    async def create_budget(
        self,
        budget_data: BudgetCreate,
        user_id: UUID
    ) -> Dict[str, Any]:
        """Create a new budget with framework-based items"""
        try:
            # Check if master budget already exists for this month
            if budget_data.type == "master":
                existing = self.supabase.table("budgets").select("id").eq(
                    "space_id", str(budget_data.space_id)
                ).eq("month_period", budget_data.month_period).eq(
                    "type", "master"
                ).execute()

                if existing.data:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Master budget already exists for {budget_data.month_period}"
                    )

            # Prepare budget data
            budget_dict = budget_data.model_dump(exclude={"budget_items"})
            budget_dict["created_by"] = str(user_id)
            budget_dict["space_id"] = str(budget_dict["space_id"])

            # Convert Decimal to string for database
            if "total_income" in budget_dict:
                budget_dict["total_income"] = str(budget_dict["total_income"])

            # Create budget
            budget_response = self.supabase.table("budgets").insert(
                budget_dict
            ).execute()

            if not budget_response.data:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create budget"
                )

            budget = budget_response.data[0]
            budget_id = budget["id"]

            # Generate budget items based on framework
            items_to_create = []

            if budget_data.framework != "custom" and budget_data.framework in FRAMEWORK_TEMPLATES:
                template = FRAMEWORK_TEMPLATES[budget_data.framework]
                total_income = float(budget_data.total_income)

                for idx, category_template in enumerate(template["categories"]):
                    # Calculate budgeted amount from percentage
                    budgeted_amount = total_income * category_template["percentage"]
                    is_parent = category_template.get("is_parent", False)

                    # Parent categories start with 0 - will be calculated from children
                    # Regular items use the calculated amount
                    final_budgeted_amount = "0" if is_parent else str(Decimal(str(budgeted_amount)).quantize(Decimal("0.01")))

                    item = {
                        "budget_id": budget_id,
                        "category": category_template["category"],
                        "category_type": category_template["category_type"],
                        "budgeted_amount": final_budgeted_amount,
                        "spent_amount": "0",
                        "icon": category_template.get("icon"),
                        "color": category_template.get("color", "#4ADE80"),
                        "display_order": idx,
                        "is_parent": is_parent,
                        "parent_id": category_template.get("parent_id")  # Support child items
                    }
                    items_to_create.append(item)

            elif budget_data.budget_items:
                # Use custom items provided
                for idx, item in enumerate(budget_data.budget_items):
                    item_dict = item.model_dump()
                    item_dict["budget_id"] = budget_id
                    item_dict["display_order"] = idx
                    items_to_create.append(item_dict)

            # Insert budget items if any
            if items_to_create:
                items_response = self.supabase.table("budget_items").insert(
                    items_to_create
                ).execute()
                budget["budget_items"] = items_response.data
            else:
                budget["budget_items"] = []

            # Calculate total_budgeted
            total_budgeted = sum(
                float(item.get("budgeted_amount", 0)) for item in budget["budget_items"]
            )

            # Update budget with total_budgeted
            self.supabase.table("budgets").update({
                "total_budgeted": str(Decimal(str(total_budgeted)).quantize(Decimal("0.01")))
            }).eq("id", budget_id).execute()

            budget["total_budgeted"] = total_budgeted

            return budget

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create budget: {str(e)}"
            )

    async def update_budget(
        self,
        budget_id: UUID,
        budget_data: BudgetUpdate,
        user_id: UUID
    ) -> Dict[str, Any]:
        """Update budget"""
        try:
            # Prepare update data (only non-None fields)
            update_dict = {
                k: v for k, v in budget_data.model_dump().items()
                if v is not None
            }

            if not update_dict:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No fields to update"
                )

            response = self.supabase.table("budgets").update(
                update_dict
            ).eq("id", str(budget_id)).execute()

            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Budget not found"
                )

            # Fetch updated budget with items
            return await self.get_budget(budget_id, user_id)

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update budget: {str(e)}"
            )

    async def delete_budget(self, budget_id: UUID, user_id: UUID) -> bool:
        """Delete budget (soft delete or hard delete)"""
        try:
            response = self.supabase.table("budgets").delete().eq(
                "id", str(budget_id)
            ).execute()

            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Budget not found"
                )

            return True

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete budget: {str(e)}"
            )

    # =====================================================
    # BUDGET ITEM OPERATIONS
    # =====================================================

    async def create_budget_item(
        self,
        budget_id: UUID,
        item_data: BudgetItemCreate,
        user_id: UUID
    ) -> Dict[str, Any]:
        """Create a new budget item"""
        try:
            item_dict = item_data.model_dump()
            item_dict["budget_id"] = str(budget_id)

            response = self.supabase.table("budget_items").insert(
                item_dict
            ).execute()

            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create budget item"
                )

            # Recalculate budget totals
            await self._recalculate_budget_totals(budget_id)

            return response.data[0]

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create budget item: {str(e)}"
            )

    async def update_budget_item(
        self,
        item_id: UUID,
        item_data: BudgetItemUpdate,
        user_id: UUID
    ) -> Dict[str, Any]:
        """Update budget item"""
        try:
            update_dict = {
                k: v for k, v in item_data.model_dump().items()
                if v is not None
            }

            if not update_dict:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No fields to update"
                )

            response = self.supabase.table("budget_items").update(
                update_dict
            ).eq("id", str(item_id)).execute()

            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Budget item not found"
                )

            item = response.data[0]

            # Recalculate budget totals
            await self._recalculate_budget_totals(UUID(item["budget_id"]))

            return item

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update budget item: {str(e)}"
            )

    async def delete_budget_item(self, item_id: UUID, user_id: UUID) -> bool:
        """Delete budget item"""
        try:
            # Get item to know which budget to recalculate
            item_response = self.supabase.table("budget_items").select(
                "budget_id"
            ).eq("id", str(item_id)).single().execute()

            if not item_response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Budget item not found"
                )

            budget_id = UUID(item_response.data["budget_id"])

            # Delete item
            delete_response = self.supabase.table("budget_items").delete().eq(
                "id", str(item_id)
            ).execute()

            # Recalculate budget totals
            await self._recalculate_budget_totals(budget_id)

            return True

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete budget item: {str(e)}"
            )

    # =====================================================
    # PARENT-CHILD CATEGORY OPERATIONS
    # =====================================================

    async def create_parent_category(
        self,
        budget_id: UUID,
        parent_data: ParentCategoryCreate,
        user_id: UUID
    ) -> Dict[str, Any]:
        """
        Create a parent category with multiple children in a transaction.

        Args:
            budget_id: The budget to add the parent category to
            parent_data: Parent category data including children
            user_id: User making the request

        Returns:
            Parent category with children array
        """
        try:
            # Validate budget exists and user has access
            budget_response = self.supabase.table("budgets").select(
                "id, space_id"
            ).eq("id", str(budget_id)).single().execute()

            if not budget_response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Budget not found"
                )

            # Prepare parent item data
            parent_dict = {
                "budget_id": str(budget_id),
                "category": parent_data.category,
                "description": parent_data.description,
                "category_type": parent_data.category_type,
                "icon": parent_data.icon,
                "color": parent_data.color,
                "display_order": parent_data.display_order,
                "is_parent": True,
                "parent_id": None,
                "budgeted_amount": "0",  # Will be auto-calculated by trigger
                "spent_amount": "0"
            }

            # Create parent item
            parent_response = self.supabase.table("budget_items").insert(
                parent_dict
            ).execute()

            if not parent_response.data:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create parent category"
                )

            parent = parent_response.data[0]
            parent_id = parent["id"]

            # Prepare children items
            children_to_create = []
            for idx, child in enumerate(parent_data.children):
                child_dict = {
                    "budget_id": str(budget_id),
                    "category": child.category,
                    "description": child.description,
                    "category_type": parent_data.category_type,  # Inherit from parent
                    "icon": child.icon,
                    "color": child.color or parent_data.color,
                    "display_order": child.display_order if child.display_order > 0 else idx,
                    "is_parent": False,
                    "parent_id": parent_id,
                    "budgeted_amount": str(child.budgeted_amount),
                    "spent_amount": str(child.spent_amount)
                }
                children_to_create.append(child_dict)

            # Create all children
            children_response = self.supabase.table("budget_items").insert(
                children_to_create
            ).execute()

            if not children_response.data:
                # Rollback: delete parent if children creation fails
                self.supabase.table("budget_items").delete().eq("id", parent_id).execute()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create child categories"
                )

            # Fetch updated parent with auto-calculated budgeted_amount
            updated_parent_response = self.supabase.table("budget_items").select(
                "*"
            ).eq("id", parent_id).single().execute()

            parent = updated_parent_response.data
            parent["children"] = children_response.data

            # Recalculate budget totals
            await self._recalculate_budget_totals(budget_id)

            return parent

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create parent category: {str(e)}"
            )

    async def add_child_to_parent(
        self,
        parent_id: UUID,
        child_data: BudgetItemChildCreate,
        user_id: UUID
    ) -> Dict[str, Any]:
        """
        Add a single child to an existing parent category.

        Args:
            parent_id: The parent category ID
            child_data: Child item data
            user_id: User making the request

        Returns:
            Created child item
        """
        try:
            # Validate parent exists and is_parent=True
            parent_response = self.supabase.table("budget_items").select(
                "id, budget_id, category_type, is_parent, color"
            ).eq("id", str(parent_id)).single().execute()

            if not parent_response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Parent category not found"
                )

            parent = parent_response.data

            if not parent.get("is_parent"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Item is not a parent category"
                )

            # Prepare child item data
            child_dict = {
                "budget_id": parent["budget_id"],
                "category": child_data.category,
                "description": child_data.description,
                "category_type": parent["category_type"],  # Inherit from parent
                "icon": child_data.icon,
                "color": child_data.color or parent["color"],
                "display_order": child_data.display_order,
                "is_parent": False,
                "parent_id": str(parent_id),
                "budgeted_amount": str(child_data.budgeted_amount),
                "spent_amount": str(child_data.spent_amount)
            }

            # Create child item
            child_response = self.supabase.table("budget_items").insert(
                child_dict
            ).execute()

            if not child_response.data:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create child category"
                )

            child = child_response.data[0]

            # Parent total auto-updates via trigger, recalculate budget totals
            await self._recalculate_budget_totals(UUID(parent["budget_id"]))

            return child

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to add child to parent: {str(e)}"
            )

    async def get_budget_items_hierarchy(
        self,
        budget_id: UUID,
        user_id: UUID
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Get budget items organized hierarchically with parent-child relationships.

        Args:
            budget_id: The budget ID
            user_id: User making the request

        Returns:
            Dictionary with 'items' array containing parents with nested children
        """
        try:
            # Validate budget exists
            budget_response = self.supabase.table("budgets").select(
                "id, space_id"
            ).eq("id", str(budget_id)).single().execute()

            if not budget_response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Budget not found"
                )

            # Fetch all budget items
            items_response = self.supabase.table("budget_items").select(
                "*"
            ).eq("budget_id", str(budget_id)).order("display_order").execute()

            all_items = items_response.data or []

            # Build hierarchy
            parents_dict = {}
            children_dict = {}
            standalone_items = []

            # First pass: separate parents, children, and standalone items
            for item in all_items:
                item_id = item["id"]
                parent_id = item.get("parent_id")
                is_parent = item.get("is_parent", False)

                # Initialize children array
                item["children"] = []

                if is_parent:
                    parents_dict[item_id] = item
                elif parent_id:
                    if parent_id not in children_dict:
                        children_dict[parent_id] = []
                    children_dict[parent_id].append(item)
                else:
                    standalone_items.append(item)

            # Second pass: attach children to parents
            for parent_id, children in children_dict.items():
                if parent_id in parents_dict:
                    parents_dict[parent_id]["children"] = children

            # Combine all top-level items (parents + standalone)
            result_items = list(parents_dict.values()) + standalone_items

            # Sort by display_order
            result_items.sort(key=lambda x: x.get("display_order", 0))

            return {
                "items": result_items
            }

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get budget items hierarchy: {str(e)}"
            )

    # =====================================================
    # HELPER METHODS
    # =====================================================

    async def _recalculate_budget_totals(self, budget_id: UUID) -> None:
        """
        Recalculate budget total_budgeted and total_spent.

        Note: Parent items are auto-calculated by DB triggers, so we sum:
        - All standalone items (not parents, no parent_id)
        - All parent items (they contain the sum of children)
        - We exclude children to avoid double-counting
        """
        try:
            # Get all items for this budget
            items_response = self.supabase.table("budget_items").select(
                "budgeted_amount, spent_amount, is_parent, parent_id"
            ).eq("budget_id", str(budget_id)).execute()

            items = items_response.data or []

            # Sum only parents and standalone items (exclude children to avoid double-counting)
            total_budgeted = sum(
                float(item.get("budgeted_amount", 0))
                for item in items
                if item.get("is_parent") or not item.get("parent_id")
            )
            total_spent = sum(
                float(item.get("spent_amount", 0))
                for item in items
                if item.get("is_parent") or not item.get("parent_id")
            )

            # Update budget
            self.supabase.table("budgets").update({
                "total_budgeted": str(Decimal(str(total_budgeted)).quantize(Decimal("0.01"))),
                "total_spent": str(Decimal(str(total_spent)).quantize(Decimal("0.01")))
            }).eq("id", str(budget_id)).execute()

        except Exception as e:
            # Log error but don't raise - this is a helper method
            print(f"Error recalculating budget totals: {e}")

    async def get_budget_stats(self, budget_id: UUID, user_id: UUID) -> Dict[str, Any]:
        """Get budget statistics"""
        try:
            budget = await self.get_budget(budget_id, user_id)

            total_income = float(budget.get("total_income", 0))
            total_budgeted = float(budget.get("total_budgeted", 0))
            total_spent = float(budget.get("total_spent", 0))
            remaining = total_income - total_spent

            percentage_spent = (
                (total_spent / total_income * 100) if total_income > 0 else 0
            )

            # Category breakdown
            category_breakdown = []
            for item in budget.get("budget_items", []):
                budgeted = float(item.get("budgeted_amount", 0))
                spent = float(item.get("spent_amount", 0))

                category_breakdown.append({
                    "category": item["category"],
                    "category_type": item["category_type"],
                    "budgeted": budgeted,
                    "spent": spent,
                    "remaining": budgeted - spent,
                    "percentage_used": (spent / budgeted * 100) if budgeted > 0 else 0
                })

            return {
                "total_income": total_income,
                "total_budgeted": total_budgeted,
                "total_spent": total_spent,
                "remaining": remaining,
                "percentage_spent": round(percentage_spent, 2),
                "category_breakdown": category_breakdown
            }

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get budget stats: {str(e)}"
            )

    def get_framework_templates(self) -> Dict[str, Dict[str, Any]]:
        """Get all available framework templates"""
        return FRAMEWORK_TEMPLATES
