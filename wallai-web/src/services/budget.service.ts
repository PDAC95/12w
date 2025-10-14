/**
 * Budget Service
 * ==============
 * API client for budget and budget item management
 */
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { supabase } from '@/lib/supabase';
import type {
  Budget,
  BudgetCreate,
  BudgetUpdate,
  BudgetListResponse,
  BudgetItem,
  BudgetItemCreate,
  BudgetItemUpdate,
  BudgetItemChildCreate,
  ParentCategoryCreate,
  BudgetItemHierarchyResponse,
  BudgetStats,
  BudgetListParams,
  FrameworkTemplates,
  BudgetType,
} from '../types/Budget.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class BudgetService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api/budgets`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
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

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // =====================================================
  // FRAMEWORK TEMPLATES
  // =====================================================

  /**
   * Get all available framework templates
   */
  async getFrameworkTemplates(): Promise<FrameworkTemplates> {
    const response = await this.api.get<FrameworkTemplates>('/frameworks');
    return response.data;
  }

  // =====================================================
  // BUDGET CRUD OPERATIONS
  // =====================================================

  /**
   * List all budgets for a space
   */
  async listBudgets(params: BudgetListParams): Promise<BudgetListResponse> {
    const { space_id, month_period, budget_type } = params;
    const response = await this.api.get<BudgetListResponse>(`/space/${space_id}`, {
      params: {
        month_period,
        budget_type,
      },
    });
    return response.data;
  }

  /**
   * Get budget by ID with all items
   */
  async getBudget(budgetId: string): Promise<Budget> {
    const response = await this.api.get<Budget>(`/${budgetId}`);
    return response.data;
  }

  /**
   * Create a new budget with framework-based items
   */
  async createBudget(budgetData: BudgetCreate): Promise<Budget> {
    const response = await this.api.post<Budget>('/', budgetData);
    return response.data;
  }

  /**
   * Update budget information
   */
  async updateBudget(budgetId: string, budgetData: BudgetUpdate): Promise<Budget> {
    const response = await this.api.patch<Budget>(`/${budgetId}`, budgetData);
    return response.data;
  }

  /**
   * Delete budget
   */
  async deleteBudget(budgetId: string): Promise<void> {
    await this.api.delete(`/${budgetId}`);
  }

  /**
   * Get budget statistics and category breakdown
   */
  async getBudgetStats(budgetId: string): Promise<BudgetStats> {
    const response = await this.api.get<BudgetStats>(`/${budgetId}/stats`);
    return response.data;
  }

  // =====================================================
  // BUDGET ITEM OPERATIONS
  // =====================================================

  /**
   * Create a new budget item
   */
  async createBudgetItem(budgetId: string, itemData: BudgetItemCreate): Promise<BudgetItem> {
    const response = await this.api.post<BudgetItem>(`/${budgetId}/items`, itemData);
    return response.data;
  }

  /**
   * Update budget item
   */
  async updateBudgetItem(itemId: string, itemData: BudgetItemUpdate): Promise<BudgetItem> {
    const response = await this.api.patch<BudgetItem>(`/items/${itemId}`, itemData);
    return response.data;
  }

  /**
   * Delete budget item
   */
  async deleteBudgetItem(itemId: string): Promise<void> {
    await this.api.delete(`/items/${itemId}`);
  }

  // =====================================================
  // PARENT-CHILD CATEGORY OPERATIONS
  // =====================================================

  /**
   * Create a parent category with multiple children
   */
  async createParentCategory(budgetId: string, parentData: ParentCategoryCreate): Promise<BudgetItem> {
    const response = await this.api.post<BudgetItem>(`/${budgetId}/items/parent`, parentData);
    return response.data;
  }

  /**
   * Add a child item to an existing parent category
   */
  async addChildToParent(parentId: string, childData: BudgetItemChildCreate): Promise<BudgetItem> {
    const response = await this.api.post<BudgetItem>(`/items/${parentId}/children`, childData);
    return response.data;
  }

  /**
   * Get budget items organized hierarchically
   */
  async getBudgetItemsHierarchy(budgetId: string): Promise<BudgetItemHierarchyResponse> {
    const response = await this.api.get<BudgetItemHierarchyResponse>(`/${budgetId}/items/hierarchy`);
    return response.data;
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  /**
   * Get current month's master budget for a space
   */
  async getCurrentMonthBudget(spaceId: string): Promise<Budget | null> {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const response = await this.listBudgets({
      space_id: spaceId,
      month_period: currentMonth,
      budget_type: 'master' as BudgetType,
    });

    return response.budgets.length > 0 ? response.budgets[0] : null;
  }

  /**
   * Check if master budget exists for a month
   */
  async masterBudgetExists(spaceId: string, monthPeriod: string): Promise<boolean> {
    try {
      const response = await this.listBudgets({
        space_id: spaceId,
        month_period: monthPeriod,
        budget_type: 'master' as BudgetType,
      });
      return response.budgets.length > 0;
    } catch (error) {
      console.error('Error checking master budget:', error);
      return false;
    }
  }

  /**
   * Get all budgets for current year
   */
  async getYearBudgets(spaceId: string, year: number): Promise<Budget[]> {
    const response = await this.listBudgets({ space_id: spaceId });
    return response.budgets.filter((budget) => {
      const budgetYear = parseInt(budget.month_period.split('-')[0]);
      return budgetYear === year;
    });
  }
}

// Export singleton instance
export const budgetService = new BudgetService();
export default budgetService;
