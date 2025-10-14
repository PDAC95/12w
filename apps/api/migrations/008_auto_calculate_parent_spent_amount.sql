-- Migration: 008_auto_calculate_parent_spent_amount.sql
-- Description: Auto-calculate parent spent_amount as sum of children
-- Author: Claude
-- Date: 2025-10-14

-- Update the existing function to also calculate spent_amount
CREATE OR REPLACE FUNCTION recalculate_parent_budgeted_amount()
RETURNS TRIGGER AS $$
DECLARE
    parent_uuid UUID;
    total_budgeted DECIMAL(15,2);
    total_spent DECIMAL(15,2);
BEGIN
    -- Determine which parent_id to update based on operation
    IF TG_OP = 'DELETE' THEN
        parent_uuid := OLD.parent_id;
    ELSE
        parent_uuid := NEW.parent_id;
    END IF;

    -- Only proceed if this item has a parent
    IF parent_uuid IS NOT NULL THEN
        -- Calculate sum of all children's budgeted_amount
        SELECT COALESCE(SUM(budgeted_amount), 0)
        INTO total_budgeted
        FROM budget_items
        WHERE parent_id = parent_uuid
          AND parent_id IS NOT NULL;

        -- Calculate sum of all children's spent_amount
        SELECT COALESCE(SUM(spent_amount), 0)
        INTO total_spent
        FROM budget_items
        WHERE parent_id = parent_uuid
          AND parent_id IS NOT NULL;

        -- Update parent's budgeted_amount and spent_amount
        UPDATE budget_items
        SET budgeted_amount = total_budgeted,
            spent_amount = total_spent
        WHERE id = parent_uuid;
    END IF;

    -- Return appropriate value based on operation
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Update trigger for spent_amount changes
CREATE OR REPLACE TRIGGER trigger_child_spent_update_parent
AFTER UPDATE OF spent_amount ON budget_items
FOR EACH ROW
WHEN (NEW.parent_id IS NOT NULL)
EXECUTE FUNCTION recalculate_parent_budgeted_amount();

-- Initial calculation: Update all existing parents with sum of children's spent_amount
UPDATE budget_items AS parent
SET spent_amount = COALESCE(
    (
        SELECT SUM(child.spent_amount)
        FROM budget_items AS child
        WHERE child.parent_id = parent.id
    ),
    0
)
WHERE parent.is_parent = TRUE;

-- Update comment
COMMENT ON FUNCTION recalculate_parent_budgeted_amount() IS 'Automatically recalculates parent budgeted_amount and spent_amount as sum of children whenever children are added, updated, or deleted';
