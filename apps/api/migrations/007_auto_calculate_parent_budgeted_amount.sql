-- Migration: 007_auto_calculate_parent_budgeted_amount.sql
-- Description: Auto-calculate parent budgeted_amount as sum of children
-- Author: Claude
-- Date: 2025-10-14

-- Function to recalculate parent's budgeted_amount
CREATE OR REPLACE FUNCTION recalculate_parent_budgeted_amount()
RETURNS TRIGGER AS $$
DECLARE
    parent_uuid UUID;
    total_budgeted DECIMAL(15,2);
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

        -- Update parent's budgeted_amount
        UPDATE budget_items
        SET budgeted_amount = total_budgeted
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

-- Trigger for INSERT: when a child is added
CREATE TRIGGER trigger_child_insert_update_parent
AFTER INSERT ON budget_items
FOR EACH ROW
WHEN (NEW.parent_id IS NOT NULL)
EXECUTE FUNCTION recalculate_parent_budgeted_amount();

-- Trigger for UPDATE: when a child's budgeted_amount changes
CREATE TRIGGER trigger_child_update_update_parent
AFTER UPDATE OF budgeted_amount ON budget_items
FOR EACH ROW
WHEN (NEW.parent_id IS NOT NULL)
EXECUTE FUNCTION recalculate_parent_budgeted_amount();

-- Trigger for DELETE: when a child is removed
CREATE TRIGGER trigger_child_delete_update_parent
AFTER DELETE ON budget_items
FOR EACH ROW
WHEN (OLD.parent_id IS NOT NULL)
EXECUTE FUNCTION recalculate_parent_budgeted_amount();

-- Trigger for UPDATE: when a child's parent_id changes (moving between parents)
CREATE TRIGGER trigger_child_reparent_update_parents
AFTER UPDATE OF parent_id ON budget_items
FOR EACH ROW
WHEN (OLD.parent_id IS DISTINCT FROM NEW.parent_id)
EXECUTE FUNCTION recalculate_parent_budgeted_amount();

-- Initial calculation: Update all existing parents with sum of their children
UPDATE budget_items AS parent
SET budgeted_amount = COALESCE(
    (
        SELECT SUM(child.budgeted_amount)
        FROM budget_items AS child
        WHERE child.parent_id = parent.id
    ),
    0
)
WHERE parent.is_parent = TRUE;

-- Add comment
COMMENT ON FUNCTION recalculate_parent_budgeted_amount() IS 'Automatically recalculates parent budgeted_amount as sum of children whenever children are added, updated, or deleted';
