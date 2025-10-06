# Wallai Database Setup - Execution Order

## Overview

This guide provides the correct order to execute database migrations and setup scripts.

## Prerequisites

- Supabase project created (follow `docs/SUPABASE_SETUP.md`)
- Access to Supabase SQL Editor
- Database connection string configured in `.env`

## Step-by-Step Execution Order

### Step 1: Create Initial Schema

**File:** `database/migrations/001_initial_schema.sql`

**What it does:**
- Creates 9 core tables (users, spaces, budgets, expenses, etc.)
- Adds indexes for performance
- Creates helper functions (updated_at trigger, invite code generator)
- Sets up foreign key relationships

**How to run:**
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `001_initial_schema.sql`
3. Paste and click "Run" (or Ctrl+Enter)
4. Wait for "Success" message

**Verification:**
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
-- Should show 9 tables
```

---

### Step 2: Create Auth Triggers

**File:** `database/migrations/002_auth_triggers.sql`

**What it does:**
- Creates trigger to automatically create user profile when user signs up
- Handles user metadata (username, full_name) from Supabase Auth
- Sets up cascade delete handling

**How to run:**
1. In Supabase SQL Editor, create new query
2. Copy entire contents of `002_auth_triggers.sql`
3. Paste and click "Run"
4. Check for success notices

**Verification:**
```sql
-- Check trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check function exists
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
```

---

### Step 3: Enable Row Level Security

**File:** `database/security/rls_policies.sql`

**What it does:**
- Enables RLS on all tables
- Creates access policies for users, spaces, budgets, expenses
- Sets up storage policies for receipts and avatars
- Grants permissions to authenticated users

**How to run:**
1. In Supabase SQL Editor, create new query
2. Copy entire contents of `rls_policies.sql`
3. Paste and click "Run"
4. This may take 30-60 seconds due to many policies

**Verification:**
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check policies exist
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

---

### Step 4: Create Storage Buckets

**Via Supabase Dashboard:**

1. Go to **Storage** in left sidebar
2. Click "Create Bucket"

**Bucket 1: receipts**
- Name: `receipts`
- Public: **No** (private)
- File size limit: 10 MB
- Allowed MIME types: `image/jpeg, image/png, application/pdf`

**Bucket 2: avatars**
- Name: `avatars`
- Public: **Yes** (public)
- File size limit: 2 MB
- Allowed MIME types: `image/jpeg, image/png`

---

### Step 5: Verify Complete Setup

Run this verification script:

```sql
-- Check all tables exist
SELECT COUNT(*) as table_count FROM pg_tables WHERE schemaname = 'public';
-- Should return 9

-- Check RLS enabled
SELECT COUNT(*) as rls_enabled FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true;
-- Should return 9

-- Check triggers exist
SELECT COUNT(*) as trigger_count FROM pg_trigger
WHERE tgname IN ('on_auth_user_created', 'on_auth_user_deleted');
-- Should return 2

-- Check policies exist
SELECT COUNT(*) as policy_count FROM pg_policies WHERE schemaname = 'public';
-- Should return 40+

-- Test helper function
SELECT generate_invite_code();
-- Should return random 6-char code like 'A3F9K2'
```

---

## Testing User Registration

After setup is complete, test the full flow:

### Test via Frontend

1. Start frontend: `cd wallai-web && npm run dev`
2. Navigate to `http://localhost:3000/register`
3. Fill in registration form:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `Test123!`
   - Full Name: `Test User`
4. Submit form
5. Check email for confirmation link

### Verify Profile Created

```sql
-- Check auth.users
SELECT id, email, created_at FROM auth.users WHERE email = 'test@example.com';

-- Check public.users (should be created by trigger)
SELECT id, username, full_name, created_at FROM public.users WHERE username = 'testuser';
```

If both queries return data, the trigger is working! ✅

---

## Troubleshooting

### Issue: Trigger not creating profile

**Check trigger is enabled:**
```sql
SELECT tgname, tgenabled FROM pg_trigger WHERE tgname = 'on_auth_user_created';
-- tgenabled should be 'O' (enabled)
```

**Check function logs:**
Go to Supabase Dashboard → Logs → Postgres Logs

**Test trigger manually:**
```sql
-- This won't actually work but will show if function can be called
SELECT handle_new_user();
```

### Issue: RLS blocking queries

**Test with specific user:**
```sql
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub = 'user-uuid-here';
SELECT * FROM spaces;
RESET ROLE;
```

### Issue: Storage bucket not working

1. Check bucket exists: Dashboard → Storage
2. Check bucket policies are applied
3. Verify file upload permissions in RLS policies

---

## Rollback (if needed)

To start fresh:

```sql
-- WARNING: This deletes all data!

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_delete();
DROP FUNCTION IF EXISTS public.trigger_set_timestamp();
DROP FUNCTION IF EXISTS public.generate_invite_code();

-- Drop all policies
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
    END LOOP;
END $$;

-- Drop all tables (CASCADE will handle foreign keys)
DROP TABLE IF EXISTS public.financial_insights CASCADE;
DROP TABLE IF EXISTS public.ai_conversations CASCADE;
DROP TABLE IF EXISTS public.expense_splits CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.budget_items CASCADE;
DROP TABLE IF EXISTS public.budgets CASCADE;
DROP TABLE IF EXISTS public.space_members CASCADE;
DROP TABLE IF EXISTS public.spaces CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
```

Then re-run setup from Step 1.

---

## Summary

**Correct Order:**
1. `001_initial_schema.sql` - Tables & functions
2. `002_auth_triggers.sql` - Auto-create profiles
3. `rls_policies.sql` - Security policies
4. Create storage buckets via Dashboard
5. Test registration flow

**Total Time:** ~10 minutes
**Prerequisites:** Supabase project created

---

**Last Updated:** 2025-10-06
**Version:** 1.0.0
**Related:** `database/README.md`, `docs/SUPABASE_SETUP.md`
