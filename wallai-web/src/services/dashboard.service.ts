/**
 * Dashboard Service
 * API calls for dashboard data
 */
import axios from 'axios';
import type { DashboardSummaryResponse } from '@/types/Dashboard.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const dashboardService = {
  /**
   * Get comprehensive dashboard summary
   * Returns monthly balance, savings, expenses, challenges, etc.
   */
  async getSummary(token: string): Promise<DashboardSummaryResponse> {
    try {
      const response = await axios.get<DashboardSummaryResponse>(
        `${API_URL}/api/dashboard/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },
};
