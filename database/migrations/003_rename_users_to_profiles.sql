-- =====================================================
-- WALLAI DATABASE - RENAME USERS TO USER_PROFILES
-- =====================================================
-- File: 003_rename_users_to_profiles.sql
-- Created: 2025-10-07
-- Description: Rename users table to user_profiles to avoid conflict with auth.users
--
-- CRITICAL: This migration fixes the PostgREST conflict between auth.users and public.users
-- =====================================================

-- =====================================================
-- STEP 1: DROP EXISTING OBJECTS (if they exist)
-- =====================================================

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;

-- Drop existing triggers
DROP TRIGGER IF EXISTS set_users_updated_at ON users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing foreign key constraints that reference users
ALTER TABLE spaces DROP CONSTRAINT IF EXISTS spaces_created_by_fkey;
ALTER TABLE space_members DROP CONSTRAINT IF EXISTS space_members_user_id_fkey;
ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_created_by_fkey;
ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_created_by_fkey;
ALTER TABLE expense_splits DROP CONSTRAINT IF EXISTS expense_splits_user_id_fkey;
ALTER TABLE ai_conversations DROP CONSTRAINT IF EXISTS ai_conversations_user_id_fkey;

-- =====================================================
-- STEP 2: RENAME TABLE AND RECREATE STRUCTURE
-- =====================================================

-- Drop the old users table completely
DROP TABLE IF EXISTS users CASCADE;

-- Create new user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Profile Information
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,

  -- Preferences
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'America/New_York',

  -- Settings (JSON for flexibility)
  settings JSONB DEFAULT '{}'::JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_seen_at TIMESTAMPTZ
);

-- Trigger for updated_at
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes for performance
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at DESC);

-- Comments
COMMENT ON TABLE user_profiles IS 'Extended user profiles, links to auth.users';
COMMENT ON COLUMN user_profiles.settings IS 'JSON object for user preferences and app settings';

-- =====================================================
-- STEP 3: UPDATE FOREIGN KEY REFERENCES
-- =====================================================

-- Re-add foreign key constraints with user_profiles
ALTER TABLE spaces
  ADD CONSTRAINT spaces_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE space_members
  ADD CONSTRAINT space_members_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE budgets
  ADD CONSTRAINT budgets_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE expenses
  ADD CONSTRAINT expenses_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE expense_splits
  ADD CONSTRAINT expense_splits_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE ai_conversations
  ADD CONSTRAINT ai_conversations_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- =====================================================
-- STEP 4: UPDATE TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_username TEXT;
  v_full_name TEXT;
BEGIN
  -- Extract username from metadata (set during signup)
  v_username := NEW.raw_user_meta_data->>'username';

  -- Extract full_name from metadata (optional)
  v_full_name := NEW.raw_user_meta_data->>'full_name';

  -- Validate username exists
  IF v_username IS NULL OR v_username = '' THEN
    RAISE EXCEPTION 'Username is required in user metadata';
  END IF;

  -- Insert user profile into public.user_profiles (renamed table)
  INSERT INTO public.user_profiles (
    id,
    username,
    full_name,
    avatar_url,
    preferred_language,
    currency,
    timezone,
    settings,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_username,
    v_full_name,
    NULL,  -- avatar_url will be added later
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'es'),
    COALESCE(NEW.raw_user_meta_data->>'currency', 'USD'),
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'America/New_York'),
    COALESCE((NEW.raw_user_meta_data->>'settings')::jsonb, '{}'::jsonb),
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$;

-- Re-create trigger with updated function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STEP 5: RECREATE RLS POLICIES FOR USER_PROFILES
-- =====================================================

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);

-- Service role can insert for admin tasks
CREATE POLICY "Service role can insert user profiles"
ON user_profiles FOR INSERT
WITH CHECK (auth.jwt()->>'role' = 'service_role' OR auth.uid() = id);

-- =====================================================
-- STEP 6: GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- STEP 7: FORCE POSTGREST SCHEMA CACHE RELOAD
-- =====================================================

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Alternative method to force reload
SELECT pg_notify('pgrst', 'reload schema');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify user_profiles table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
    RAISE NOTICE '✅ user_profiles table created successfully';
  ELSE
    RAISE EXCEPTION '❌ user_profiles table was not created';
  END IF;
END $$;

-- List all tables to verify renaming
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check RLS policies on user_profiles
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'user_profiles';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE 'Changes:';
  RAISE NOTICE '  - Renamed users → user_profiles';
  RAISE NOTICE '  - Updated all foreign key references';
  RAISE NOTICE '  - Updated trigger function';
  RAISE NOTICE '  - Recreated RLS policies';
  RAISE NOTICE '  - Reloaded PostgREST schema cache';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Update frontend code to use "user_profiles" instead of "users"';
  RAISE NOTICE '2. Test registration and login functionality';
END $$;

-- =====================================================
-- END OF MIGRATION
-- =====================================================