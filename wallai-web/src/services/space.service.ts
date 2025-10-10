/**
 * Space Service
 *
 * API client for space management endpoints
 */

import axios from 'axios';
import { supabase } from '@/lib/supabase';
import type {
  Space,
  CreateSpaceRequest,
  CreateSpaceResponse,
  ListSpacesResponse,
  GetSpaceResponse,
  UpdateSpaceRequest,
  UpdateSpaceResponse,
  JoinSpaceRequest,
  JoinSpaceResponse,
  LeaveSpaceResponse,
  SpaceFilterOptions,
} from '@/types/Space.types';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor to include JWT token
apiClient.interceptors.request.use(
  async (config) => {
    // Get current session from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Space Service
 */
export const spaceService = {
  /**
   * List all spaces for current user
   *
   * @param filters - Optional filters
   * @returns List of spaces with user's role
   */
  async listSpaces(filters?: SpaceFilterOptions): Promise<Space[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.type) {
        params.append('type', filters.type);
      }

      if (filters?.is_active !== undefined) {
        params.append('is_active', filters.is_active.toString());
      }

      if (filters?.role) {
        params.append('role', filters.role);
      }

      const response = await apiClient.get<ListSpacesResponse>(
        `/api/spaces${params.toString() ? `?${params.toString()}` : ''}`
      );

      return response.data.data.spaces;
    } catch (error) {
      console.error('Failed to list spaces:', error);
      throw new Error('Could not load your spaces');
    }
  },

  /**
   * Get all spaces for current user (alias for listSpaces)
   */
  async getUserSpaces(filters?: SpaceFilterOptions): Promise<ListSpacesResponse> {
    try {
      const params = new URLSearchParams();

      if (filters?.type) {
        params.append('type', filters.type);
      }

      if (filters?.is_active !== undefined) {
        params.append('is_active', filters.is_active.toString());
      }

      if (filters?.role) {
        params.append('role', filters.role);
      }

      const response = await apiClient.get<ListSpacesResponse>(
        `/api/spaces${params.toString() ? `?${params.toString()}` : ''}`
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get user spaces:', error);
      throw new Error('Could not load your spaces');
    }
  },

  /**
   * Get single space by ID
   *
   * @param spaceId - Space UUID
   * @returns Space details with members
   */
  async getSpace(spaceId: string): Promise<Space> {
    try {
      const response = await apiClient.get<GetSpaceResponse>(`/api/spaces/${spaceId}`);

      return response.data.data.space;
    } catch (error: any) {
      console.error('Failed to get space:', error);

      if (error.response?.status === 404) {
        throw new Error('Space not found');
      }

      if (error.response?.status === 403) {
        throw new Error('You do not have access to this space');
      }

      throw new Error('Could not load space details');
    }
  },

  /**
   * Create new space
   *
   * @param data - Space creation data
   * @returns Created space and membership
   */
  async createSpace(data: CreateSpaceRequest): Promise<CreateSpaceResponse> {
    try {
      const response = await apiClient.post<CreateSpaceResponse>('/api/spaces', data);

      return response.data;
    } catch (error: any) {
      console.error('Failed to create space:', error);

      // Extract error message from API response
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }

      throw new Error('Could not create space. Please try again.');
    }
  },

  /**
   * Update space
   *
   * @param spaceId - Space UUID
   * @param data - Updated space data
   * @returns Updated space
   */
  async updateSpace(spaceId: string, data: UpdateSpaceRequest): Promise<Space> {
    try {
      const response = await apiClient.patch<UpdateSpaceResponse>(
        `/api/spaces/${spaceId}`,
        data
      );

      return response.data.data.space;
    } catch (error: any) {
      console.error('Failed to update space:', error);

      if (error.response?.status === 403) {
        throw new Error('You do not have permission to update this space');
      }

      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }

      throw new Error('Could not update space');
    }
  },

  /**
   * Delete space
   *
   * @param spaceId - Space UUID
   */
  async deleteSpace(spaceId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/spaces/${spaceId}`);
    } catch (error: any) {
      console.error('Failed to delete space:', error);

      if (error.response?.status === 403) {
        throw new Error('Only the owner can delete this space');
      }

      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }

      throw new Error('Could not delete space');
    }
  },

  /**
   * Join space with invite code
   *
   * @param inviteCode - 6-character invite code
   * @returns Space and membership
   */
  async joinSpace(inviteCode: string): Promise<JoinSpaceResponse> {
    try {
      const response = await apiClient.post<JoinSpaceResponse>('/api/spaces/join', {
        invite_code: inviteCode.toUpperCase().trim(),
      });

      return response.data;
    } catch (error: any) {
      console.error('Failed to join space:', error);

      if (error.response?.status === 404) {
        throw new Error('Invalid invite code');
      }

      if (error.response?.status === 400) {
        if (error.response.data?.error?.message) {
          throw new Error(error.response.data.error.message);
        }
      }

      throw new Error('Could not join space');
    }
  },

  /**
   * Leave space
   *
   * @param spaceId - Space UUID
   */
  async leaveSpace(spaceId: string): Promise<void> {
    try {
      await apiClient.post<LeaveSpaceResponse>(`/api/spaces/${spaceId}/leave`);
    } catch (error: any) {
      console.error('Failed to leave space:', error);

      if (error.response?.status === 400) {
        throw new Error('Cannot leave space: You are the owner');
      }

      throw new Error('Could not leave space');
    }
  },

  /**
   * Regenerate invite code
   *
   * @param spaceId - Space UUID
   * @returns Updated space with new code
   */
  async regenerateInviteCode(spaceId: string): Promise<Space> {
    try {
      const response = await apiClient.post<UpdateSpaceResponse>(
        `/api/spaces/${spaceId}/regenerate-code`
      );

      return response.data.data.space;
    } catch (error: any) {
      console.error('Failed to regenerate invite code:', error);

      if (error.response?.status === 403) {
        throw new Error('Only admins can regenerate the invite code');
      }

      throw new Error('Could not regenerate invite code');
    }
  },

  /**
   * Get space members
   *
   * @param spaceId - Space UUID
   * @returns List of space members
   */
  async getSpaceMembers(spaceId: string) {
    try {
      const response = await apiClient.get(`/api/spaces/${spaceId}/members`);

      return response.data.data.members;
    } catch (error) {
      console.error('Failed to get space members:', error);
      throw new Error('Could not load space members');
    }
  },

  /**
   * Update member role
   *
   * @param spaceId - Space UUID
   * @param userId - User UUID
   * @param role - New role
   */
  async updateMemberRole(spaceId: string, userId: string, role: string) {
    try {
      await apiClient.patch(`/api/spaces/${spaceId}/members/${userId}`, { role });
    } catch (error: any) {
      console.error('Failed to update member role:', error);

      if (error.response?.status === 403) {
        throw new Error('You do not have permission to update member roles');
      }

      throw new Error('Could not update member role');
    }
  },

  /**
   * Remove member from space
   *
   * @param spaceId - Space UUID
   * @param userId - User UUID
   */
  async removeMember(spaceId: string, userId: string) {
    try {
      await apiClient.delete(`/api/spaces/${spaceId}/members/${userId}`);
    } catch (error: any) {
      console.error('Failed to remove member:', error);

      if (error.response?.status === 403) {
        throw new Error('You do not have permission to remove members');
      }

      throw new Error('Could not remove member');
    }
  },
};

export default spaceService;
