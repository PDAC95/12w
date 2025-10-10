-- =====================================================
-- ROLLBACK: REMOVE SPACE_TYPE FROM SPACES TABLE
-- =====================================================
-- File: 005_add_space_type_rollback.sql
-- Created: 2025-10-10
-- Description: Rollback migration 005 - removes space_type column
-- =====================================================

-- Drop index first
DROP INDEX IF EXISTS idx_spaces_space_type;

-- Drop column
ALTER TABLE spaces
DROP COLUMN IF EXISTS space_type;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '⚠️  Rollback 005: space_type column removed';
  RAISE NOTICE 'Index: idx_spaces_space_type dropped';
END $$;
