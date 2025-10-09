"""
Onboarding Routes

FastAPI endpoints for onboarding flow
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import Annotated
import logging

from ...core.supabase import get_supabase_client
from ...core.auth import get_current_user_id
from ...services.onboarding_service import OnboardingService
from ...schemas.onboarding import (
    CreateSpaceRequest,
    CreateSpaceResponse,
    CreateBudgetRequest,
    CreateBudgetResponse,
    OnboardingStatusResponse,
    CompleteOnboardingResponse,
    ErrorResponse,
)

# Configure logger
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api",
    tags=["onboarding"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"},
    },
)


# ============================================
# GET /api/user/onboarding-status
# ============================================

@router.get(
    "/user/onboarding-status",
    response_model=OnboardingStatusResponse,
    summary="Get Onboarding Status",
    description="Check if user needs to complete onboarding"
)
async def get_onboarding_status(
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Get user's onboarding status

    Returns:
        - needs_onboarding: bool
        - has_personal_space: bool
        - has_budget: bool
        - user_id: str
    """
    try:
        supabase = get_supabase_client()
        service = OnboardingService(supabase)

        status_data = await service.get_onboarding_status(user_id)

        return OnboardingStatusResponse(
            success=True,
            data=status_data
        )

    except Exception as e:
        logger.error(f"Error getting onboarding status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "STATUS_CHECK_FAILED",
                    "message": "Failed to check onboarding status",
                    "details": {"error": str(e)}
                }
            }
        )


# ============================================
# POST /api/onboarding/space
# ============================================

@router.post(
    "/onboarding/space",
    response_model=CreateSpaceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Personal Space",
    description="Create user's personal financial space during onboarding"
)
async def create_personal_space(
    request: CreateSpaceRequest,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Create personal space

    Args:
        - name: Space name (3-50 chars)
        - currency: USD, CAD, or MXN

    Returns:
        Created space with:
        - id: UUID
        - name: Space name
        - currency: Currency code
        - is_personal: true
        - invite_code: 6-character code
        - created_at: Timestamp
    """
    try:
        logger.info(f"Creating space for user {user_id}: name={request.name}, currency={request.currency}")
        supabase = get_supabase_client()
        service = OnboardingService(supabase)

        space = await service.create_personal_space(
            user_id=user_id,
            name=request.name,
            currency=request.currency
        )

        logger.info(f"Space created successfully: {space.get('id')}")
        return CreateSpaceResponse(
            success=True,
            data={"space": space}
        )

    except ValueError as e:
        # User already has personal space
        logger.warning(f"Duplicate space attempt for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": {
                    "code": "DUPLICATE_PERSONAL_SPACE",
                    "message": str(e),
                    "details": {}
                }
            }
        )

    except Exception as e:
        logger.error(f"Error creating personal space: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "SPACE_CREATION_FAILED",
                    "message": "Failed to create personal space",
                    "details": {"error": str(e)}
                }
            }
        )


# ============================================
# POST /api/onboarding/budget
# ============================================

@router.post(
    "/onboarding/budget",
    response_model=CreateBudgetResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Budget Express",
    description="Create budget during onboarding with automatic framework"
)
async def create_onboarding_budget(
    request: CreateBudgetRequest,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Create budget via onboarding

    Args:
        - space_id: UUID of personal space
        - monthly_income: Monthly income (optional if skip)
        - framework: 50_30_20, zero_based, or skip

    Returns:
        - If framework selected: budget with auto-generated items
        - If skip: {"skipped": true}
    """
    try:
        logger.warning(f"[ROUTE] create_onboarding_budget called: user_id={user_id}, space_id={request.space_id}, framework={request.framework}")
        print(f"[ROUTE PRINT] create_onboarding_budget called")
        supabase = get_supabase_client()
        service = OnboardingService(supabase)

        logger.warning("[ROUTE] Calling service.create_budget...")
        print(f"[ROUTE PRINT] Calling service.create_budget...")
        result = await service.create_budget(
            user_id=user_id,
            space_id=request.space_id,
            monthly_income=request.monthly_income,
            framework=request.framework
        )

        logger.info(f"[ROUTE] Budget creation successful, returning response")
        return CreateBudgetResponse(
            success=True,
            data=result
        )

    except ValueError as e:
        # Space not found or not owned
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": {
                    "code": "INVALID_SPACE",
                    "message": str(e),
                    "details": {}
                }
            }
        )

    except Exception as e:
        logger.error(f"Error creating budget: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "BUDGET_CREATION_FAILED",
                    "message": "Failed to create budget",
                    "details": {"error": str(e)}
                }
            }
        )


# ============================================
# PUT /api/user/complete-onboarding
# ============================================

@router.put(
    "/user/complete-onboarding",
    response_model=CompleteOnboardingResponse,
    summary="Complete Onboarding",
    description="Mark user's onboarding as complete"
)
async def complete_onboarding(
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Complete onboarding flow

    Marks user's onboarding_completed flag as true

    Returns:
        - onboarding_completed: true
        - redirect_to: "/dashboard"
    """
    try:
        supabase = get_supabase_client()
        service = OnboardingService(supabase)

        result = await service.complete_onboarding(user_id)

        return CompleteOnboardingResponse(
            success=True,
            data=result
        )

    except Exception as e:
        logger.error(f"Error completing onboarding: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "ONBOARDING_COMPLETION_FAILED",
                    "message": "Failed to complete onboarding",
                    "details": {"error": str(e)}
                }
            }
        )
