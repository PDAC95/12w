"""
Space Service

Business logic for space management
"""

import logging
from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime

logger = logging.getLogger(__name__)


class SpaceService:
    """Service for managing spaces and memberships"""

    def __init__(self, supabase_client):
        """Initialize space service

        Args:
            supabase_client: Supabase client instance
        """
        self.supabase = supabase_client

    async def list_user_spaces(
        self,
        user_id: str,
        space_type: Optional[str] = None,
        is_active: Optional[bool] = None,
        role: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """List all spaces for a user

        Args:
            user_id: User UUID
            space_type: Filter by space type (personal, shared, project)
            is_active: Filter by active status
            role: Filter by user role

        Returns:
            List of spaces with user's role and member count
        """
        try:
            # Query space_members joined with spaces
            query = self.supabase.table("space_members") \
                .select("*, spaces!inner(*)")  \
                .eq("user_id", user_id) \
                .eq("is_active", True)

            # Apply filters
            if space_type:
                query = query.eq("spaces.space_type", space_type)

            if is_active is not None:
                query = query.eq("spaces.is_active", is_active)

            if role:
                query = query.eq("role", role)

            # Execute query
            response = query.execute()

            if not response.data:
                return []

            # Transform data
            spaces = []
            for membership in response.data:
                space_data = membership["spaces"]

                # Get member count
                member_count_response = self.supabase.table("space_members") \
                    .select("id", count="exact") \
                    .eq("space_id", space_data["id"]) \
                    .eq("is_active", True) \
                    .execute()

                space_data["user_role"] = membership["role"]
                space_data["member_count"] = member_count_response.count or 0

                spaces.append(space_data)

            logger.info(f"Listed {len(spaces)} spaces for user {user_id}")
            return spaces

        except Exception as e:
            logger.error(f"Error listing spaces for user {user_id}: {str(e)}")
            raise

    async def get_space(self, space_id: str, user_id: str) -> Dict[str, Any]:
        """Get space details

        Args:
            space_id: Space UUID
            user_id: User UUID (for permission check)

        Returns:
            Space with members and user role

        Raises:
            ValueError: If space not found or user not member
        """
        try:
            # Check if user is member
            membership_response = self.supabase.table("space_members") \
                .select("role, is_active") \
                .eq("space_id", space_id) \
                .eq("user_id", user_id) \
                .eq("is_active", True) \
                .execute()

            if not membership_response.data:
                raise ValueError("You are not a member of this space")

            user_role = membership_response.data[0]["role"]

            # Get space data
            space_response = self.supabase.table("spaces") \
                .select("*") \
                .eq("id", space_id) \
                .execute()

            if not space_response.data:
                raise ValueError("Space not found")

            space = space_response.data[0]

            # Get members with user info
            members_response = self.supabase.table("space_members") \
                .select("*, users(username, full_name, avatar_url)") \
                .eq("space_id", space_id) \
                .eq("is_active", True) \
                .execute()

            space["members"] = members_response.data if members_response.data else []
            space["member_count"] = len(space["members"])
            space["user_role"] = user_role

            logger.info(f"Retrieved space {space_id} for user {user_id}")
            return space

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Error getting space {space_id}: {str(e)}")
            raise

    async def create_space(
        self,
        user_id: str,
        name: str,
        space_type: str,
        currency: str = "USD",
        description: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create new space

        Args:
            user_id: Owner user UUID
            name: Space name
            space_type: Type (personal, shared, project)
            currency: Currency code
            description: Optional description

        Returns:
            Created space and membership

        Raises:
            ValueError: If validation fails
        """
        try:
            # Validate space type
            if space_type not in ["personal", "shared", "project"]:
                raise ValueError("Invalid space type")

            # Create space
            space_data = {
                "name": name.strip(),
                "description": description.strip() if description else None,
                "space_type": space_type,
                "currency": currency,
                "created_by": user_id,
                "is_active": True
            }

            space_response = self.supabase.table("spaces") \
                .insert(space_data) \
                .execute()

            if not space_response.data:
                raise ValueError("Failed to create space")

            space = space_response.data[0]

            # Create membership with owner role
            member_data = {
                "space_id": space["id"],
                "user_id": user_id,
                "role": "owner",
                "is_active": True
            }

            member_response = self.supabase.table("space_members") \
                .insert(member_data) \
                .execute()

            if not member_response.data:
                # Rollback: delete space
                self.supabase.table("spaces").delete().eq("id", space["id"]).execute()
                raise ValueError("Failed to create membership")

            member = member_response.data[0]

            logger.info(f"Created space {space['id']} for user {user_id}")

            return {
                "space": space,
                "member": member
            }

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Error creating space: {str(e)}")
            raise

    async def update_space(
        self,
        space_id: str,
        user_id: str,
        updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update space

        Args:
            space_id: Space UUID
            user_id: User UUID (for permission check)
            updates: Fields to update

        Returns:
            Updated space

        Raises:
            ValueError: If permission denied or validation fails
        """
        try:
            # Check if user is owner or admin
            membership_response = self.supabase.table("space_members") \
                .select("role") \
                .eq("space_id", space_id) \
                .eq("user_id", user_id) \
                .eq("is_active", True) \
                .execute()

            if not membership_response.data:
                raise ValueError("You are not a member of this space")

            user_role = membership_response.data[0]["role"]

            if user_role not in ["owner", "admin"]:
                raise ValueError("Only owners and admins can update the space")

            # Update space
            update_data = {}

            if "name" in updates and updates["name"]:
                update_data["name"] = updates["name"].strip()

            if "description" in updates:
                update_data["description"] = updates["description"].strip() if updates["description"] else None

            if "currency" in updates:
                update_data["currency"] = updates["currency"]

            if "timezone" in updates:
                update_data["timezone"] = updates["timezone"]

            if "settings" in updates:
                update_data["settings"] = updates["settings"]

            if not update_data:
                raise ValueError("No valid fields to update")

            # Execute update
            response = self.supabase.table("spaces") \
                .update(update_data) \
                .eq("id", space_id) \
                .execute()

            if not response.data:
                raise ValueError("Failed to update space")

            logger.info(f"Updated space {space_id} by user {user_id}")
            return response.data[0]

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Error updating space {space_id}: {str(e)}")
            raise

    async def delete_space(self, space_id: str, user_id: str) -> None:
        """Delete space

        Args:
            space_id: Space UUID
            user_id: User UUID (must be owner)

        Raises:
            ValueError: If not owner or deletion fails
        """
        try:
            # Check if user is owner
            membership_response = self.supabase.table("space_members") \
                .select("role") \
                .eq("space_id", space_id) \
                .eq("user_id", user_id) \
                .eq("is_active", True) \
                .execute()

            if not membership_response.data:
                raise ValueError("You are not a member of this space")

            if membership_response.data[0]["role"] != "owner":
                raise ValueError("Only the owner can delete the space")

            # Soft delete: set is_active = false
            response = self.supabase.table("spaces") \
                .update({"is_active": False}) \
                .eq("id", space_id) \
                .execute()

            if not response.data:
                raise ValueError("Failed to delete space")

            # Deactivate all memberships
            self.supabase.table("space_members") \
                .update({"is_active": False}) \
                .eq("space_id", space_id) \
                .execute()

            logger.info(f"Deleted space {space_id} by user {user_id}")

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Error deleting space {space_id}: {str(e)}")
            raise

    async def join_space(
        self,
        user_id: str,
        invite_code: str
    ) -> Dict[str, Any]:
        """Join space with invite code

        Args:
            user_id: User UUID
            invite_code: 6-character code

        Returns:
            Space and membership

        Raises:
            ValueError: If code invalid or already member
        """
        try:
            # Find space by invite code
            space_response = self.supabase.table("spaces") \
                .select("*") \
                .eq("invite_code", invite_code.upper()) \
                .eq("is_active", True) \
                .execute()

            if not space_response.data:
                raise ValueError("Invalid invite code")

            space = space_response.data[0]

            # Check if already member
            existing_response = self.supabase.table("space_members") \
                .select("id, is_active") \
                .eq("space_id", space["id"]) \
                .eq("user_id", user_id) \
                .execute()

            if existing_response.data:
                if existing_response.data[0]["is_active"]:
                    raise ValueError("You are already a member of this space")
                else:
                    # Reactivate membership
                    member_response = self.supabase.table("space_members") \
                        .update({"is_active": True, "left_at": None}) \
                        .eq("id", existing_response.data[0]["id"]) \
                        .execute()
                    member = member_response.data[0]
            else:
                # Create new membership
                member_data = {
                    "space_id": space["id"],
                    "user_id": user_id,
                    "role": "member",
                    "is_active": True
                }

                member_response = self.supabase.table("space_members") \
                    .insert(member_data) \
                    .execute()

                if not member_response.data:
                    raise ValueError("Failed to join space")

                member = member_response.data[0]

            logger.info(f"User {user_id} joined space {space['id']} with code {invite_code}")

            return {
                "space": space,
                "member": member
            }

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Error joining space with code {invite_code}: {str(e)}")
            raise

    async def leave_space(self, space_id: str, user_id: str) -> None:
        """Leave space

        Args:
            space_id: Space UUID
            user_id: User UUID

        Raises:
            ValueError: If owner or not member
        """
        try:
            # Check membership and role
            membership_response = self.supabase.table("space_members") \
                .select("role") \
                .eq("space_id", space_id) \
                .eq("user_id", user_id) \
                .eq("is_active", True) \
                .execute()

            if not membership_response.data:
                raise ValueError("You are not a member of this space")

            if membership_response.data[0]["role"] == "owner":
                raise ValueError("Owner cannot leave the space. Transfer ownership or delete the space.")

            # Deactivate membership
            response = self.supabase.table("space_members") \
                .update({"is_active": False, "left_at": datetime.utcnow().isoformat()}) \
                .eq("space_id", space_id) \
                .eq("user_id", user_id) \
                .execute()

            if not response.data:
                raise ValueError("Failed to leave space")

            logger.info(f"User {user_id} left space {space_id}")

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Error leaving space {space_id}: {str(e)}")
            raise

    async def regenerate_invite_code(
        self,
        space_id: str,
        user_id: str
    ) -> Dict[str, Any]:
        """Regenerate invite code

        Args:
            space_id: Space UUID
            user_id: User UUID (must be owner or admin)

        Returns:
            Updated space with new code

        Raises:
            ValueError: If permission denied
        """
        try:
            # Check if user is owner or admin
            membership_response = self.supabase.table("space_members") \
                .select("role") \
                .eq("space_id", space_id) \
                .eq("user_id", user_id) \
                .eq("is_active", True) \
                .execute()

            if not membership_response.data:
                raise ValueError("You are not a member of this space")

            user_role = membership_response.data[0]["role"]

            if user_role not in ["owner", "admin"]:
                raise ValueError("Only owners and admins can regenerate the invite code")

            # Call PostgreSQL function to generate new code
            # Note: Using raw SQL via RPC
            response = self.supabase.rpc(
                "generate_invite_code"
            ).execute()

            new_code = response.data if response.data else None

            if not new_code:
                raise ValueError("Failed to generate new invite code")

            # Update space with new code
            update_response = self.supabase.table("spaces") \
                .update({"invite_code": new_code}) \
                .eq("id", space_id) \
                .execute()

            if not update_response.data:
                raise ValueError("Failed to update space with new code")

            logger.info(f"Regenerated invite code for space {space_id}")
            return update_response.data[0]

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Error regenerating invite code for space {space_id}: {str(e)}")
            raise
