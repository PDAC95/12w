"""
Spaces Routes

FastAPI endpoints for space management
"""

from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import Annotated, Optional
import logging

from ...core.supabase import get_supabase_client
from ...core.auth import get_current_user_id
from ...services.space_service import SpaceService
from ...schemas.space import (
    CreateSpaceRequest,
    CreateSpaceResponse,
    ListSpacesResponse,
    GetSpaceResponse,
    UpdateSpaceRequest,
    UpdateSpaceResponse,
    DeleteSpaceResponse,
    JoinSpaceRequest,
    JoinSpaceResponse,
    LeaveSpaceResponse,
    GetSpaceMembersResponse,
    UpdateMemberRoleRequest,
    UpdateMemberRoleResponse,
    RemoveMemberResponse,
    ErrorResponse,
)

# Configure logger
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api",
    tags=["spaces"],
    responses={
        404: {"description": "Not found"},
        403: {"description": "Forbidden"},
        500: {"description": "Internal server error"},
    },
)


# ============================================
# GET /api/spaces
# ============================================

@router.get(
    "/spaces",
    response_model=ListSpacesResponse,
    summary="List User Spaces",
    description="Get all spaces for current user with filters"
)
async def list_spaces(
    user_id: Annotated[str, Depends(get_current_user_id)],
    space_type: Optional[str] = Query(None, description="Filter by type (personal, shared, project)"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    role: Optional[str] = Query(None, description="Filter by user role")
):
    """
    List all spaces for current user

    Query Parameters:
        - type: Filter by space type
        - is_active: Filter by active status
        - role: Filter by user role

    Returns:
        List of spaces with user's role and member count
    """
    try:
        supabase = get_supabase_client()
        service = SpaceService(supabase)

        spaces = await service.list_user_spaces(
            user_id=user_id,
            space_type=space_type,
            is_active=is_active,
            role=role
        )

        return ListSpacesResponse(
            success=True,
            data={
                "spaces": spaces,
                "total": len(spaces)
            }
        )

    except Exception as e:
        logger.error(f"Error listing spaces: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "SPACE_LIST_FAILED",
                    "message": "Failed to list spaces",
                    "details": {"error": str(e)}
                }
            }
        )


# ============================================
# GET /api/spaces/{space_id}
# ============================================

@router.get(
    "/spaces/{space_id}",
    response_model=GetSpaceResponse,
    summary="Get Space Details",
    description="Get single space with members and permissions"
)
async def get_space(
    space_id: str,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Get space details

    Args:
        space_id: Space UUID

    Returns:
        Space with members and user's role
    """
    try:
        supabase = get_supabase_client()
        service = SpaceService(supabase)

        space = await service.get_space(space_id=space_id, user_id=user_id)

        return GetSpaceResponse(
            success=True,
            data={"space": space}
        )

    except ValueError as e:
        # Not found or no access
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND if "not found" in str(e).lower() else status.HTTP_403_FORBIDDEN,
            detail={
                "success": False,
                "error": {
                    "code": "SPACE_NOT_FOUND" if "not found" in str(e).lower() else "ACCESS_DENIED",
                    "message": str(e),
                    "details": {}
                }
            }
        )

    except Exception as e:
        logger.error(f"Error getting space {space_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "SPACE_GET_FAILED",
                    "message": "Failed to get space",
                    "details": {"error": str(e)}
                }
            }
        )


# ============================================
# POST /api/spaces
# ============================================

@router.post(
    "/spaces",
    response_model=CreateSpaceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Space",
    description="Create new financial space"
)
async def create_space(
    request: CreateSpaceRequest,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Create new space

    Args:
        - name: Space name (1-100 chars)
        - description: Optional description
        - space_type: Type (personal, shared, project)
        - currency: Default currency (USD, CAD, MXN)

    Returns:
        Created space and membership with owner role
    """
    try:
        logger.info(f"Creating space for user {user_id}: name={request.name}, type={request.space_type}")
        supabase = get_supabase_client()
        service = SpaceService(supabase)

        result = await service.create_space(
            user_id=user_id,
            name=request.name,
            space_type=request.space_type,
            currency=request.currency,
            description=request.description
        )

        logger.info(f"Space created successfully: {result['space'].get('id')}")
        return CreateSpaceResponse(
            success=True,
            data=result
        )

    except ValueError as e:
        # Validation error
        logger.warning(f"Space creation validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": str(e),
                    "details": {}
                }
            }
        )

    except Exception as e:
        logger.error(f"Error creating space: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "SPACE_CREATION_FAILED",
                    "message": "Failed to create space",
                    "details": {"error": str(e)}
                }
            }
        )


# ============================================
# PATCH /api/spaces/{space_id}
# ============================================

@router.patch(
    "/spaces/{space_id}",
    response_model=UpdateSpaceResponse,
    summary="Update Space",
    description="Update space details (requires admin or owner role)"
)
async def update_space(
    space_id: str,
    request: UpdateSpaceRequest,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Update space

    Args:
        space_id: Space UUID
        request: Fields to update

    Returns:
        Updated space
    """
    try:
        supabase = get_supabase_client()
        service = SpaceService(supabase)

        # Convert request to dict, exclude None values
        updates = request.dict(exclude_none=True)

        space = await service.update_space(
            space_id=space_id,
            user_id=user_id,
            updates=updates
        )

        return UpdateSpaceResponse(
            success=True,
            data={"space": space}
        )

    except ValueError as e:
        # Permission or validation error
        status_code = status.HTTP_403_FORBIDDEN if "permission" in str(e).lower() else status.HTTP_400_BAD_REQUEST
        raise HTTPException(
            status_code=status_code,
            detail={
                "success": False,
                "error": {
                    "code": "PERMISSION_DENIED" if status_code == 403 else "VALIDATION_ERROR",
                    "message": str(e),
                    "details": {}
                }
            }
        )

    except Exception as e:
        logger.error(f"Error updating space {space_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "SPACE_UPDATE_FAILED",
                    "message": "Failed to update space",
                    "details": {"error": str(e)}
                }
            }
        )


# ============================================
# DELETE /api/spaces/{space_id}
# ============================================

@router.delete(
    "/spaces/{space_id}",
    response_model=DeleteSpaceResponse,
    summary="Delete Space",
    description="Delete space (only owner, soft delete)"
)
async def delete_space(
    space_id: str,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Delete space (soft delete)

    Args:
        space_id: Space UUID

    Returns:
        Deletion confirmation
    """
    try:
        supabase = get_supabase_client()
        service = SpaceService(supabase)

        await service.delete_space(space_id=space_id, user_id=user_id)

        return DeleteSpaceResponse(
            success=True,
            data={"message": "Space deleted successfully"}
        )

    except ValueError as e:
        # Permission error
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "success": False,
                "error": {
                    "code": "PERMISSION_DENIED",
                    "message": str(e),
                    "details": {}
                }
            }
        )

    except Exception as e:
        logger.error(f"Error deleting space {space_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "SPACE_DELETE_FAILED",
                    "message": "Failed to delete space",
                    "details": {"error": str(e)}
                }
            }
        )


# ============================================
# POST /api/spaces/join
# ============================================

@router.post(
    "/spaces/join",
    response_model=JoinSpaceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Join Space",
    description="Join space with 6-character invite code"
)
async def join_space(
    request: JoinSpaceRequest,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Join space with invite code

    Args:
        invite_code: 6-character code

    Returns:
        Space and membership
    """
    try:
        supabase = get_supabase_client()
        service = SpaceService(supabase)

        result = await service.join_space(
            user_id=user_id,
            invite_code=request.invite_code
        )

        return JoinSpaceResponse(
            success=True,
            data=result
        )

    except ValueError as e:
        # Invalid code or already member
        status_code = status.HTTP_404_NOT_FOUND if "invalid" in str(e).lower() else status.HTTP_400_BAD_REQUEST
        raise HTTPException(
            status_code=status_code,
            detail={
                "success": False,
                "error": {
                    "code": "INVALID_INVITE_CODE" if status_code == 404 else "ALREADY_MEMBER",
                    "message": str(e),
                    "details": {}
                }
            }
        )

    except Exception as e:
        logger.error(f"Error joining space: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "JOIN_SPACE_FAILED",
                    "message": "Failed to join space",
                    "details": {"error": str(e)}
                }
            }
        )


# ============================================
# POST /api/spaces/{space_id}/leave
# ============================================

@router.post(
    "/spaces/{space_id}/leave",
    response_model=LeaveSpaceResponse,
    summary="Leave Space",
    description="Leave space (cannot leave if owner)"
)
async def leave_space(
    space_id: str,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Leave space

    Args:
        space_id: Space UUID

    Returns:
        Leave confirmation
    """
    try:
        supabase = get_supabase_client()
        service = SpaceService(supabase)

        await service.leave_space(space_id=space_id, user_id=user_id)

        return LeaveSpaceResponse(
            success=True,
            data={"message": "Left space successfully"}
        )

    except ValueError as e:
        # Permission error
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": {
                    "code": "CANNOT_LEAVE",
                    "message": str(e),
                    "details": {}
                }
            }
        )

    except Exception as e:
        logger.error(f"Error leaving space {space_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "LEAVE_SPACE_FAILED",
                    "message": "Failed to leave space",
                    "details": {"error": str(e)}
                }
            }
        )


# ============================================
# POST /api/spaces/{space_id}/regenerate-code
# ============================================

@router.post(
    "/spaces/{space_id}/regenerate-code",
    response_model=UpdateSpaceResponse,
    summary="Regenerate Invite Code",
    description="Generate new invite code (requires admin or owner role)"
)
async def regenerate_invite_code(
    space_id: str,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Regenerate invite code

    Args:
        space_id: Space UUID

    Returns:
        Updated space with new code
    """
    try:
        supabase = get_supabase_client()
        service = SpaceService(supabase)

        space = await service.regenerate_invite_code(
            space_id=space_id,
            user_id=user_id
        )

        return UpdateSpaceResponse(
            success=True,
            data={"space": space}
        )

    except ValueError as e:
        # Permission error
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "success": False,
                "error": {
                    "code": "PERMISSION_DENIED",
                    "message": str(e),
                    "details": {}
                }
            }
        )

    except Exception as e:
        logger.error(f"Error regenerating invite code for space {space_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "REGENERATE_CODE_FAILED",
                    "message": "Failed to regenerate invite code",
                    "details": {"error": str(e)}
                }
            }
        )


# ============================================
# GET /api/spaces/{space_id}/members
# ============================================

@router.get(
    "/spaces/{space_id}/members",
    response_model=GetSpaceMembersResponse,
    summary="Get Space Members",
    description="Get all members of a space"
)
async def get_space_members(
    space_id: str,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Get all members of a space

    Args:
        space_id: Space UUID

    Returns:
        List of space members with user info
    """
    try:
        supabase = get_supabase_client()
        service = SpaceService(supabase)

        members = await service.get_space_members(
            space_id=space_id,
            user_id=user_id
        )

        return GetSpaceMembersResponse(
            success=True,
            data={"members": members}
        )

    except ValueError as e:
        # Permission error
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "success": False,
                "error": {
                    "code": "PERMISSION_DENIED",
                    "message": str(e),
                    "details": {}
                }
            }
        )

    except Exception as e:
        logger.error(f"Error getting members for space {space_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "GET_MEMBERS_FAILED",
                    "message": "Failed to get space members",
                    "details": {"error": str(e)}
                }
            }
        )


# ============================================
# DELETE /api/spaces/{space_id}/members/{member_user_id}
# ============================================

@router.delete(
    "/spaces/{space_id}/members/{member_user_id}",
    response_model=RemoveMemberResponse,
    summary="Remove Member",
    description="Remove member from space (requires admin or owner role)"
)
async def remove_member(
    space_id: str,
    member_user_id: str,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    """
    Remove member from space

    Args:
        space_id: Space UUID
        member_user_id: User ID to remove

    Returns:
        Success response
    """
    try:
        supabase = get_supabase_client()
        service = SpaceService(supabase)

        await service.remove_member(
            space_id=space_id,
            member_user_id=member_user_id,
            requesting_user_id=user_id
        )

        return RemoveMemberResponse(
            success=True,
            data={"message": "Member removed successfully"}
        )

    except ValueError as e:
        # Permission error or validation error
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "success": False,
                "error": {
                    "code": "PERMISSION_DENIED",
                    "message": str(e),
                    "details": {}
                }
            }
        )

    except Exception as e:
        logger.error(f"Error removing member from space {space_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "REMOVE_MEMBER_FAILED",
                    "message": "Failed to remove member",
                    "details": {"error": str(e)}
                }
            }
        )
