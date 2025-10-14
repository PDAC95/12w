-- Migration: 006_convert_existing_items_to_parents.sql
-- Description: Convert existing template budget items to parent categories
-- Author: Claude
-- Date: 2025-10-14

-- Convert existing template items to parent categories
-- This ensures items from framework templates can have children added
UPDATE budget_items
SET is_parent = TRUE
WHERE parent_id IS NULL
  AND is_parent = FALSE
  AND category IN (
    -- 50/30/20 Framework categories
    'Housing', 'Utilities', 'Groceries', 'Transportation', 'Insurance',
    'Healthcare', 'Minimum Payments', 'Personal Care',
    'Dining Out', 'Entertainment', 'Shopping', 'Hobbies',
    'Emergency Fund', 'Retirement', 'Investments', 'Debt Payoff',
    -- Income categories
    'Salary', 'Side Income',
    -- Additional common categories from templates
    'Subscriptions', 'Savings Goals', 'Education'
  );

-- Add helpful comment
COMMENT ON TABLE budget_items IS 'Budget items with parent-child hierarchy support. Template items are created as parent categories by default.';
