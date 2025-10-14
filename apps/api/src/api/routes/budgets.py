"""
Budget API Routes
=================
REST API endpoints for budget and budget item management.
"""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query

from ...core.auth import get_current_user, get_supabase_client
from ...schemas.budget import (
    BudgetCreate,
    BudgetUpdate,
    BudgetResponse,
    BudgetListResponse,
    BudgetItemCreate,
    BudgetItemUpdate,
    BudgetItemResponse,
    BudgetItemWithChildren,
    BudgetItemChildCreate,
    ParentCategoryCreate,
    BudgetStats,
    BudgetType,
    BudgetFramework,
)
from ...services.budget_service import BudgetService, FRAMEWORK_TEMPLATES
from supabase import Client


router = APIRouter(prefix="/api/budgets", tags=["Budgets"])


# =====================================================
# DEPENDENCY INJECTION
# =====================================================

def get_budget_service(supabase: Client = Depends(get_supabase_client)) -> BudgetService:
    """Dependency to get budget service instance"""
    return BudgetService(supabase)


# =====================================================
# FRAMEWORK TEMPLATES
# =====================================================

@router.get("/frameworks", response_model=dict)
async def get_framework_templates(
    service: BudgetService = Depends(get_budget_service)
):
    """
    Get all available budget framework templates

    Returns framework templates with predefined categories for:
    - 50/30/20 Rule
    - 60/20/20 Rule
    - Zero-Based Budgeting
    - Custom
    """
    return service.get_framework_templates()


# =====================================================
# BUDGET CRUD ENDPOINTS
# =====================================================

@router.get("/space/{space_id}", response_model=BudgetListResponse)
async def list_budgets(
    space_id: UUID,
    month_period: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}$"),
    budget_type: Optional[BudgetType] = None,
    current_user: dict = Depends(get_current_user),
    service: BudgetService = Depends(get_budget_service)
):
    """
    List all budgets for a space

    **Query Parameters:**
    - month_period: Filter by month (YYYY-MM format)
    - budget_type: Filter by type (master or secondary)

    **Permissions:** Space members can view budgets
    """
    user_id = UUID(current_user["sub"])
    budgets = await service.list_budgets(
        space_id=space_id,
        month_period=month_period,
        budget_type=budget_type,
        user_id=user_id
    )

    return {
        "budgets": budgets,
        "total": len(budgets)
    }


@router.get("/{budget_id}", response_model=BudgetResponse)
async def get_budget(
    budget_id: UUID,
    current_user: dict = Depends(get_current_user),
    service: BudgetService = Depends(get_budget_service)
):
    """
    Get budget by ID with all items

    **Permissions:** Space members can view budget
    """
    user_id = UUID(current_user["sub"])
    budget = await service.get_budget(budget_id, user_id)
    return budget


@router.post("/", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
async def create_budget(
    budget_data: BudgetCreate,
    current_user: dict = Depends(get_current_user),
    service: BudgetService = Depends(get_budget_service)
):
    """
    Create a new budget with framework-based items

    **Request Body:**
    - space_id: Space UUID
    - name: Budget name
    - month_period: YYYY-MM format
    - type: master or secondary
    - framework: 50_30_20, 60_20_20, zero_based, or custom
    - total_income: Expected income for the month
    - budget_items: Optional custom items (used if framework=custom)

    **Business Rules:**
    - Only ONE master budget per space per month
    - Framework categories are auto-generated based on income
    - Custom items override framework if provided

    **Permissions:** Space members can create budgets
    """
    user_id = UUID(current_user["sub"])
    budget = await service.create_budget(budget_data, user_id)
    return budget


@router.patch("/{budget_id}", response_model=BudgetResponse)
async def update_budget(
    budget_id: UUID,
    budget_data: BudgetUpdate,
    current_user: dict = Depends(get_current_user),
    service: BudgetService = Depends(get_budget_service)
):
    """
    Update budget information

    **Permissions:** Creator, owners, and admins can update
    """
    user_id = UUID(current_user["sub"])
    budget = await service.update_budget(budget_id, budget_data, user_id)
    return budget


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget(
    budget_id: UUID,
    current_user: dict = Depends(get_current_user),
    service: BudgetService = Depends(get_budget_service)
):
    """
    Delete budget

    **Permissions:** Creator, owners, and admins can delete
    """
    user_id = UUID(current_user["sub"])
    await service.delete_budget(budget_id, user_id)
    return None


@router.get("/{budget_id}/stats", response_model=BudgetStats)
async def get_budget_stats(
    budget_id: UUID,
    current_user: dict = Depends(get_current_user),
    service: BudgetService = Depends(get_budget_service)
):
    """
    Get budget statistics and category breakdown

    **Returns:**
    - total_income
    - total_budgeted
    - total_spent
    - remaining
    - percentage_spent
    - category_breakdown (per-category stats)
    """
    user_id = UUID(current_user["sub"])
    stats = await service.get_budget_stats(budget_id, user_id)
    return stats


# =====================================================
# BUDGET ITEM ENDPOINTS
# =====================================================

@router.post("/{budget_id}/items", response_model=BudgetItemResponse, status_code=status.HTTP_201_CREATED)
async def create_budget_item(
    budget_id: UUID,
    item_data: BudgetItemCreate,
    current_user: dict = Depends(get_current_user),
    service: BudgetService = Depends(get_budget_service)
):
    """
    Create a new budget item

    **Request Body:**
    - category: Category name
    - category_type: needs, wants, savings, or income
    - budgeted_amount: Allocated amount
    - icon: Optional icon name
    - color: Hex color code

    **Auto-Actions:**
    - Recalculates budget totals after creation

    **Permissions:** Space members can create items
    """
    user_id = UUID(current_user["sub"])
    item = await service.create_budget_item(budget_id, item_data, user_id)
    return item


@router.patch("/items/{item_id}", response_model=BudgetItemResponse)
async def update_budget_item(
    item_id: UUID,
    item_data: BudgetItemUpdate,
    current_user: dict = Depends(get_current_user),
    service: BudgetService = Depends(get_budget_service)
):
    """
    Update budget item

    **Auto-Actions:**
    - Recalculates budget totals after update

    **Permissions:** Space members can update items
    """
    user_id = UUID(current_user["sub"])
    item = await service.update_budget_item(item_id, item_data, user_id)
    return item


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget_item(
    item_id: UUID,
    current_user: dict = Depends(get_current_user),
    service: BudgetService = Depends(get_budget_service)
):
    """
    Delete budget item

    **Auto-Actions:**
    - Recalculates budget totals after deletion

    **Permissions:** Space members can delete items
    """
    user_id = UUID(current_user["sub"])
    await service.delete_budget_item(item_id, user_id)
    return None


# =====================================================
# PARENT-CHILD CATEGORY MANAGEMENT
# =====================================================

@router.post("/{budget_id}/items/parent", response_model=BudgetItemWithChildren, status_code=status.HTTP_201_CREATED)
async def create_parent_category(
    budget_id: UUID,
    parent_data: ParentCategoryCreate,
    current_user: dict = Depends(get_current_user),
    service: BudgetService = Depends(get_budget_service),
):
    """
    Create a parent category with multiple child items

    This endpoint creates a parent category (e.g., "Utilities") with multiple
    child items (e.g., "Hydro", "Internet", "Gas"). The parent's total will be
    automatically calculated from the sum of its children.

    **Example Request:**
    ```json
    {
      "category": "Utilities",
      "category_type": "needs",
      "icon": "⚡",
      "color": "#10b981",
      "children": [
        {"category": "Hydro", "budgeted_amount": 80},
        {"category": "Internet", "budgeted_amount": 70},
        {"category": "Gas", "budgeted_amount": 50}
      ]
    }
    ```

    **Returns:** Parent category with nested children array and auto-calculated total
    """
    user_id = UUID(current_user["sub"])
    return await service.create_parent_category(budget_id, parent_data, user_id)


@router.post("/items/{parent_id}/children", response_model=BudgetItemResponse, status_code=status.HTTP_201_CREATED)
async def add_child_to_parent(
    parent_id: UUID,
    child_data: BudgetItemChildCreate,
    current_user: dict = Depends(get_current_user),
    service: BudgetService = Depends(get_budget_service),
):
    """
    Add a single child item to an existing parent category

    This endpoint adds a new child item to an existing parent category.
    The parent's total will be automatically updated.

    **Example Request:**
    ```json
    {
      "category": "Cable TV",
      "budgeted_amount": 60,
      "icon": "📺"
    }
    ```

    **Returns:** Created child item
    """
    user_id = UUID(current_user["sub"])
    return await service.add_child_to_parent(parent_id, child_data, user_id)


@router.get("/{budget_id}/items/hierarchy", response_model=dict)
async def get_budget_items_hierarchy(
    budget_id: UUID,
    current_user: dict = Depends(get_current_user),
    service: BudgetService = Depends(get_budget_service),
):
    """
    Get budget items organized hierarchically

    Returns all budget items organized into a hierarchy with parents and their children.

    **Response Structure:**
    ```json
    {
      "items": [
        {
          "id": "...",
          "category": "Utilities",
          "is_parent": true,
          "budgeted_amount": 200,
          "children": [
            {"id": "...", "category": "Hydro", "budgeted_amount": 80},
            {"id": "...", "category": "Internet", "budgeted_amount": 70}
          ]
        },
        {
          "id": "...",
          "category": "Housing",
          "is_parent": false,
          "budgeted_amount": 1000,
          "children": []
        }
      ]
    }
    ```
    """
    user_id = UUID(current_user["sub"])
    return await service.get_budget_items_hierarchy(budget_id, user_id)


# =====================================================
# HEALTH CHECK
# =====================================================

@router.get("/health", include_in_schema=False)
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "budgets"}
