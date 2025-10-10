/**
 * Currency Service
 *
 * Service for managing currency-related API calls.
 */

import axios from 'axios';
import type { CurrencyListResponse, Currency } from '@/types/Currency.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class CurrencyService {
  private readonly BASE_URL = `${API_URL}/api/currencies`;

  /**
   * Get all available currencies
   */
  async getCurrencies(includeInactive: boolean = false): Promise<CurrencyListResponse> {
    const response = await axios.get<CurrencyListResponse>(this.BASE_URL, {
      params: { include_inactive: includeInactive },
    });
    return response.data;
  }

  /**
   * Get a specific currency by code
   */
  async getCurrencyByCode(code: string): Promise<Currency> {
    const response = await axios.get<Currency>(`${this.BASE_URL}/${code}`);
    return response.data;
  }
}

export const currencyService = new CurrencyService();
