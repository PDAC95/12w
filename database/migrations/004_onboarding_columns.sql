-- Migration: 004_onboarding_columns.sql
-- Description: Add columns to support onboarding flow
-- Date: 2025-10-08
-- Author: Claude Code
-- Note: Uses user_profiles table (users was renamed in migration 003)

-- ============================================
-- 1. Add onboarding_completed to user_profiles table
-- ============================================

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN user_profiles.onboarding_completed IS 'Indicates if user has completed the onboarding flow';

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
-- 4. Update RLS Policies (no changes needed)
-- ============================================

-- Note: RLS policies for spaces were already updated in previous migrations
-- No additional policy changes needed for these new columns

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify columns were added successfully
DO $$
BEGIN
  -- Check onboarding_completed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'onboarding_completed'
  ) THEN
    RAISE NOTICE '✅ onboarding_completed column added to user_profiles';
  ELSE
    RAISE EXCEPTION '❌ Failed to add onboarding_completed column';
  END IF;

  -- Check is_personal
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'is_personal'
  ) THEN
    RAISE NOTICE '✅ is_personal column added to spaces';
  ELSE
    RAISE EXCEPTION '❌ Failed to add is_personal column';
  END IF;

  -- Check auto_generated
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'auto_generated'
  ) THEN
    RAISE NOTICE '✅ auto_generated column added to budgets';
  ELSE
    RAISE EXCEPTION '❌ Failed to add auto_generated column';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '✅ Migration 004 completed successfully!';
  RAISE NOTICE 'Onboarding columns are ready.';
END $$;

-- ============================================
-- ROLLBACK SCRIPT (For reference - run manually if needed)
-- ============================================

/*
-- To rollback this migration:

ALTER TABLE user_profiles DROP COLUMN IF EXISTS onboarding_completed;
ALTER TABLE spaces DROP COLUMN IF EXISTS is_personal;
ALTER TABLE budgets DROP COLUMN IF EXISTS auto_generated;
DROP INDEX IF EXISTS idx_spaces_is_personal;
*/
