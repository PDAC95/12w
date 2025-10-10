/**
 * Space Types
 *
 * TypeScript interfaces for space management
 */

export type Currency = 'USD' | 'CAD' | 'MXN';

export type SpaceType = 'personal' | 'shared' | 'project';

export type SpaceRole = 'owner' | 'admin' | 'member' | 'viewer';

/**
 * Space Member
 */
export interface SpaceMember {
  id: string;
  user_id: string;
  space_id: string;
  role: SpaceRole;
  is_active: boolean;
  joined_at: string;
  left_at?: string;

  // User info (from join)
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

/**
 * Space
 */
export interface Space {
  id: string;
  name: string;
  description?: string;

  // Type
  space_type: SpaceType;

  // Invitation
  invite_code: string;

  // Settings
  currency: Currency;
  timezone: string;
  settings: Record<string, any>;

  // Status
  is_active: boolean;

  // Ownership
  created_by: string;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Relationships (optional, from joins)
  members?: SpaceMember[];
  member_count?: number;
  user_role?: SpaceRole;
}

/**
 * Create Space Request
 */
export interface CreateSpaceRequest {
  name: string;
  description?: string;
  space_type: SpaceType;
  currency: Currency;
}

/**
 * Create Space Response
 */
export interface CreateSpaceResponse {
  success: boolean;
  data: {
    space: Space;
    member: SpaceMember;
  };
}

/**
 * List Spaces Response
 */
export interface ListSpacesResponse {
  success: boolean;
  data: {
    spaces: Space[];
    total: number;
  };
}

/**
 * Get Space Response
 */
export interface GetSpaceResponse {
  success: boolean;
  data: {
    space: Space;
  };
}

/**
 * Update Space Request
 */
export interface UpdateSpaceRequest {
  name?: string;
  description?: string;
  currency?: Currency;
  timezone?: string;
  settings?: Record<string, any>;
}

/**
 * Update Space Response
 */
export interface UpdateSpaceResponse {
  success: boolean;
  data: {
    space: Space;
  };
}

/**
 * Join Space Request
 */
export interface JoinSpaceRequest {
  invite_code: string;
}

/**
 * Join Space Response
 */
export interface JoinSpaceResponse {
  success: boolean;
  data: {
    space: Space;
    member: SpaceMember;
  };
}

/**
 * Leave Space Response
 */
export interface LeaveSpaceResponse {
  success: boolean;
  data: {
    message: string;
  };
}

/**
 * Space Statistics
 */
export interface SpaceStats {
  space_id: string;
  member_count: number;
  budget_count: number;
  expense_count: number;
  total_spent: number;
  currency: Currency;
}

/**
 * Space Filter Options
 */
export interface SpaceFilterOptions {
  type?: SpaceType;
  is_active?: boolean;
  role?: SpaceRole;
}
