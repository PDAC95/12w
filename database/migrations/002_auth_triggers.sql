-- =====================================================
-- WALLAI AUTH TRIGGERS - User Profile Creation
-- =====================================================
-- File: 002_auth_triggers.sql
-- Created: 2025-10-06
-- Description: Triggers for automatic user profile creation
--
-- INSTRUCTIONS:
-- Run this AFTER 001_initial_schema.sql
-- This creates triggers that automatically create user profiles
-- when a new user signs up via Supabase Auth
-- =====================================================

-- =====================================================
-- DROP EXISTING TRIGGERS AND FUNCTIONS (if re-running)
-- =====================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- =====================================================
-- FUNCTION: handle_new_user()
-- =====================================================
-- This function is triggered when a new user signs up
-- It automatically creates a profile in the public.users table
-- with data from auth.users and user_metadata

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

  -- Insert user profile into public.users
  INSERT INTO public.users (
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

-- Add comment
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user profile when new user signs up via Supabase Auth';

-- =====================================================
-- TRIGGER: on_auth_user_created
-- =====================================================
-- Fires AFTER a new row is inserted into auth.users
-- Calls handle_new_user() to create the profile

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add comment
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Creates user profile automatically when user signs up';

-- =====================================================
-- FUNCTION: handle_user_delete()
-- =====================================================
-- This function is triggered when a user is deleted from auth.users
-- It's handled by CASCADE DELETE in the foreign key constraint
-- But we add this for logging/cleanup if needed

CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- User profile will be deleted automatically due to CASCADE
  -- Log the deletion for audit purposes
  RAISE NOTICE 'User % deleted from auth.users, profile cascade deleted', OLD.id;

  RETURN OLD;
END;
$$;

-- =====================================================
-- TRIGGER: on_auth_user_deleted
-- =====================================================

CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_delete();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant execute permission to authenticated users
-- (Though these functions run with SECURITY DEFINER)
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_user_delete() TO authenticated;

-- =====================================================
-- TESTING THE TRIGGER
-- =====================================================

-- To test this trigger manually:
-- 1. Create a test user via Supabase Auth Dashboard
-- 2. Or use the signup endpoint with metadata:
/*
{
  "email": "test@example.com",
  "password": "Test123!",
  "options": {
    "data": {
      "username": "testuser",
      "full_name": "Test User"
    }
  }
}
*/

-- 3. Verify profile was created:
-- SELECT * FROM public.users WHERE username = 'testuser';

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If trigger doesn't fire:
-- 1. Check if trigger exists:
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- 2. Check function exists:
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';

-- 3. Check for errors in Supabase logs:
-- Dashboard → Logs → Postgres Logs

-- 4. Test function manually:
/*
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
BEGIN
  -- Simulate user metadata
  -- This is just for testing, actual signup will provide metadata
  RAISE NOTICE 'Test trigger would create user profile for: %', test_user_id;
END $$;
*/

-- =====================================================
-- ROLLBACK (if needed)
-- =====================================================

-- To remove these triggers:
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP FUNCTION IF EXISTS public.handle_user_delete();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Auth triggers created successfully!';
  RAISE NOTICE 'Triggers:';
  RAISE NOTICE '  - on_auth_user_created: Creates profile on signup';
  RAISE NOTICE '  - on_auth_user_deleted: Logs user deletion';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Test signup via frontend or API';
  RAISE NOTICE '2. Verify profile creation in public.users table';
END $$;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
