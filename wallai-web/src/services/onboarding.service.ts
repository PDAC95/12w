/**
 * Onboarding Service
 *
 * API client for onboarding flow endpoints
 */

import axios from 'axios';
import { supabase } from '@/lib/supabase';
import type {
  OnboardingStatus,
  CreateSpaceRequest,
  CreateSpaceResponse,
  CreateBudgetRequest,
  CreateBudgetResponse,
  CompleteOnboardingResponse,
} from '@/types/Onboarding.types';

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
    const { data: { session } } = await supabase.auth.getSession();

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
 * Onboarding Service
 */
export const onboardingService = {
  /**
   * Get user's onboarding status
   *
   * @returns Onboarding status flags
   */
  async getStatus(): Promise<OnboardingStatus> {
    try {
      const response = await apiClient.get<{ success: boolean; data: OnboardingStatus }>(
        '/api/user/onboarding-status'
      );

      return response.data.data;
    } catch (error) {
      console.error('Failed to get onboarding status:', error);
      throw new Error('Could not check onboarding status');
    }
  },

  /**
   * Create personal space
   *
   * @param data - Space creation data
   * @returns Created space data
   */
  async createSpace(data: CreateSpaceRequest): Promise<CreateSpaceResponse> {
    try {
      const response = await apiClient.post<CreateSpaceResponse>(
        '/api/onboarding/space',
        data
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to create space:', error);

      // Extract error message from API response
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }

      throw new Error('Could not create your space. Please try again.');
    }
  },

  /**
   * Create budget via onboarding
   *
   * @param data - Budget creation data
   * @returns Created budget data or skip confirmation
   */
  async createBudget(data: CreateBudgetRequest): Promise<CreateBudgetResponse> {
    try {
      const response = await apiClient.post<CreateBudgetResponse>(
        '/api/onboarding/budget',
        data
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to create budget:', error);

      // Extract error message from API response
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }

      throw new Error('Could not create your budget. Please try again.');
    }
  },

  /**
   * Complete onboarding flow
   *
   * @returns Completion confirmation
   */
  async completeOnboarding(): Promise<CompleteOnboardingResponse> {
    try {
      const response = await apiClient.put<CompleteOnboardingResponse>(
        '/api/user/complete-onboarding'
      );

      return response.data;
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      throw new Error('Could not complete onboarding. Please try again.');
    }
  },
};

export default onboardingService;
