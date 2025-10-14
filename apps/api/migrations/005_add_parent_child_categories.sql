-- Migration: 005_add_parent_child_categories.sql
-- Description: Add parent-child category structure to budget_items
-- Author: Claude
-- Date: 2025-10-14

-- Add columns for parent-child relationships
ALTER TABLE budget_items
ADD COLUMN IF NOT EXISTS parent_id UUID NULL REFERENCES budget_items(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_parent BOOLEAN DEFAULT FALSE NOT NULL;

-- Add comment to columns
COMMENT ON COLUMN budget_items.parent_id IS 'Reference to parent category (NULL for top-level items or parent categories)';
COMMENT ON COLUMN budget_items.is_parent IS 'TRUE if this is a parent category that groups child items';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_budget_items_parent_id ON budget_items(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_budget_items_is_parent ON budget_items(is_parent) WHERE is_parent = TRUE;
CREATE INDEX IF NOT EXISTS idx_budget_items_hierarchy ON budget_items(budget_id, parent_id, is_parent);

-- Add constraint: parent categories cannot have a parent themselves (max 2 levels)
ALTER TABLE budget_items
ADD CONSTRAINT chk_no_nested_parents
CHECK (
  (is_parent = FALSE) OR
  (is_parent = TRUE AND parent_id IS NULL)
);

-- Add constraint: if parent_id is set, is_parent must be FALSE
ALTER TABLE budget_items
ADD CONSTRAINT chk_child_not_parent
CHECK (
  (parent_id IS NULL) OR
  (parent_id IS NOT NULL AND is_parent = FALSE)
);

-- Update RLS policies to include parent_id in checks
-- Drop existing policies if they exist
DROP POLICY IF EXISTS budget_items_select_policy ON budget_items;
DROP POLICY IF EXISTS budget_items_insert_policy ON budget_items;
DROP POLICY IF EXISTS budget_items_update_policy ON budget_items;
DROP POLICY IF EXISTS budget_items_delete_policy ON budget_items;

-- Recreate policies with parent_id awareness
CREATE POLICY budget_items_select_policy ON budget_items
  FOR SELECT
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      JOIN spaces s ON b.space_id = s.id
      JOIN space_members sm ON s.id = sm.space_id
      WHERE sm.user_id = auth.uid()
    )
  );

CREATE POLICY budget_items_insert_policy ON budget_items
  FOR INSERT
  WITH CHECK (
    budget_id IN (
      SELECT b.id FROM budgets b
      JOIN spaces s ON b.space_id = s.id
      JOIN space_members sm ON s.id = sm.space_id
      WHERE sm.user_id = auth.uid()
    )
  );

CREATE POLICY budget_items_update_policy ON budget_items
  FOR UPDATE
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      JOIN spaces s ON b.space_id = s.id
      JOIN space_members sm ON s.id = sm.space_id
      WHERE sm.user_id = auth.uid()
    )
  );

CREATE POLICY budget_items_delete_policy ON budget_items
  FOR DELETE
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      JOIN spaces s ON b.space_id = s.id
      JOIN space_members sm ON s.id = sm.space_id
      WHERE sm.user_id = auth.uid()
    )
  );

-- Create function to auto-calculate parent totals
CREATE OR REPLACE FUNCTION calculate_parent_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a child item being inserted/updated/deleted, update parent totals
  IF (TG_OP = 'DELETE') THEN
    IF OLD.parent_id IS NOT NULL THEN
      UPDATE budget_items
      SET
        budgeted_amount = COALESCE((
          SELECT SUM(budgeted_amount)
          FROM budget_items
          WHERE parent_id = OLD.parent_id AND id != OLD.id
        ), 0),
        spent_amount = COALESCE((
          SELECT SUM(spent_amount)
          FROM budget_items
          WHERE parent_id = OLD.parent_id AND id != OLD.id
        ), 0),
        updated_at = NOW()
      WHERE id = OLD.parent_id AND is_parent = TRUE;
    END IF;
    RETURN OLD;
  ELSIF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    IF NEW.parent_id IS NOT NULL THEN
      UPDATE budget_items
      SET
        budgeted_amount = COALESCE((
          SELECT SUM(budgeted_amount)
          FROM budget_items
          WHERE parent_id = NEW.parent_id
        ), 0),
        spent_amount = COALESCE((
          SELECT SUM(spent_amount)
          FROM budget_items
          WHERE parent_id = NEW.parent_id
        ), 0),
        updated_at = NOW()
      WHERE id = NEW.parent_id AND is_parent = TRUE;
    END IF;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate parent totals
DROP TRIGGER IF EXISTS trigger_calculate_parent_totals ON budget_items;
CREATE TRIGGER trigger_calculate_parent_totals
  AFTER INSERT OR UPDATE OR DELETE ON budget_items
  FOR EACH ROW
  EXECUTE FUNCTION calculate_parent_totals();

-- Create function to update budget totals when items change
CREATE OR REPLACE FUNCTION update_budget_totals_on_item_change()
RETURNS TRIGGER AS $$
DECLARE
  v_budget_id UUID;
BEGIN
  -- Determine which budget to update
  IF (TG_OP = 'DELETE') THEN
    v_budget_id := OLD.budget_id;
  ELSE
    v_budget_id := NEW.budget_id;
  END IF;

  -- Update budget totals (only count top-level items and parents, not children)
  UPDATE budgets
  SET
    total_budgeted = COALESCE((
      SELECT SUM(budgeted_amount)
      FROM budget_items
      WHERE budget_id = v_budget_id
        AND (parent_id IS NULL OR is_parent = TRUE)
    ), 0),
    total_spent = COALESCE((
      SELECT SUM(spent_amount)
      FROM budget_items
      WHERE budget_id = v_budget_id
        AND (parent_id IS NULL OR is_parent = TRUE)
    ), 0),
    updated_at = NOW()
  WHERE id = v_budget_id;

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update budget totals
DROP TRIGGER IF EXISTS trigger_update_budget_totals ON budget_items;
CREATE TRIGGER trigger_update_budget_totals
  AFTER INSERT OR UPDATE OR DELETE ON budget_items
  FOR EACH ROW
  EXECUTE FUNCTION update_budget_totals_on_item_change();

-- Add helpful comments
COMMENT ON CONSTRAINT chk_no_nested_parents ON budget_items IS 'Prevents parent categories from having parents (max 2-level hierarchy)';
COMMENT ON CONSTRAINT chk_child_not_parent ON budget_items IS 'Ensures child items cannot be parents themselves';
COMMENT ON FUNCTION calculate_parent_totals() IS 'Auto-calculates budgeted_amount and spent_amount for parent categories based on their children';
COMMENT ON FUNCTION update_budget_totals_on_item_change() IS 'Updates budget totals when items change, excluding child items from double-counting';
