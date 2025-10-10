-- =====================================================
-- ADD SPACE_TYPE TO SPACES TABLE
-- =====================================================
-- File: 005_add_space_type.sql
-- Created: 2025-10-10
-- Description: Add space_type column to differentiate between personal, shared, and project spaces
--
-- US-011: Crear Espacios Adicionales
-- =====================================================

-- Add space_type column
ALTER TABLE spaces
ADD COLUMN space_type TEXT DEFAULT 'personal' NOT NULL
CHECK (space_type IN ('personal', 'shared', 'project'));

-- Create index for filtering by type
CREATE INDEX idx_spaces_space_type ON spaces(space_type);

-- Update existing spaces to be 'personal' type
UPDATE spaces
SET space_type = 'personal'
WHERE space_type IS NULL OR space_type = '';

-- Add comment
COMMENT ON COLUMN spaces.space_type IS 'Type of space: personal (single user), shared (household/couple), project (specific goal)';

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check column was added
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'spaces' AND column_name = 'space_type';

-- Check existing spaces
-- SELECT id, name, space_type FROM spaces;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 005: space_type column added successfully!';
  RAISE NOTICE 'Column: space_type (personal, shared, project)';
  RAISE NOTICE 'Index: idx_spaces_space_type created';
  RAISE NOTICE 'Existing spaces updated to personal type';
END $$;
