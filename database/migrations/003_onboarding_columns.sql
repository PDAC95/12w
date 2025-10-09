-- Migration: 003_onboarding_columns.sql
-- Description: Add columns to support onboarding flow
-- Date: 2025-10-08
-- Author: Claude Code

-- ============================================
-- 1. Add onboarding_completed to users table
-- ============================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN users.onboarding_completed IS 'Indicates if user has completed the onboarding flow';

-- ============================================
-- 2. Add is_personal to spaces table
-- ============================================

ALTER TABLE spaces
ADD COLUMN IF NOT EXISTS is_personal BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN spaces.is_personal IS 'Indicates if this is a personal space (only one per user) or a shared space';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_spaces_is_personal ON spaces(created_by, is_personal) WHERE is_personal = TRUE;

-- ============================================
-- 3. Add auto_generated to budgets table
-- ============================================

ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS auto_generated BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN budgets.auto_generated IS 'Indicates if budget was created automatically by onboarding wizard';

-- ============================================
-- 4. Update RLS Policies
-- ============================================

-- Update spaces policy to include is_personal check
DROP POLICY IF EXISTS "Users can view own spaces" ON spaces;

CREATE POLICY "Users can view own spaces" ON spaces
FOR SELECT
USING (
  auth.uid() = created_by
  OR auth.uid() IN (
    SELECT user_id FROM space_members
    WHERE space_id = spaces.id
  )
);

-- ============================================
-- ROLLBACK SCRIPT (For reference - run manually if needed)
-- ============================================

/*
-- To rollback this migration:

ALTER TABLE users DROP COLUMN IF EXISTS onboarding_completed;
ALTER TABLE spaces DROP COLUMN IF EXISTS is_personal;
ALTER TABLE budgets DROP COLUMN IF EXISTS auto_generated;
DROP INDEX IF EXISTS idx_spaces_is_personal;

-- Restore original policy
DROP POLICY IF EXISTS "Users can view own spaces" ON spaces;
CREATE POLICY "Users can view own spaces" ON spaces
FOR SELECT
USING (
  auth.uid() = created_by
  OR auth.uid() IN (
    SELECT user_id FROM space_members
    WHERE space_id = spaces.id
  )
);
*/
