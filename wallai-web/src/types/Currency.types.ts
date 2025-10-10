/**
 * Currency Types
 *
 * TypeScript interfaces for currency-related data structures.
 */

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag_emoji: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CurrencyListResponse {
  currencies: Currency[];
  total: number;
}

export interface CurrencyCreate {
  code: string;
  name: string;
  symbol: string;
  flag_emoji: string;
  is_active?: boolean;
  display_order?: number;
}

export interface CurrencyUpdate {
  name?: string;
  symbol?: string;
  flag_emoji?: string;
  is_active?: boolean;
  display_order?: number;
}
