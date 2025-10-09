# Wallai - Onboarding Migration Guide

## Problem Statement

The onboarding endpoint `POST /api/onboarding/space` returns **400 Bad Request** because critical columns are missing from the database.

### Missing Columns Identified

| Table | Column | Type | Purpose |
|-------|--------|------|---------|
| `user_profiles` (or `users`) | `onboarding_completed` | `BOOLEAN` | Tracks if user finished onboarding wizard |
| `spaces` | `is_personal` | `BOOLEAN` | Distinguishes personal vs shared spaces |
| `budgets` | `auto_generated` | `BOOLEAN` | Marks budgets created by onboarding wizard |

---

## Solution: Execute Migration Scripts

This migration is **safe, idempotent, and non-destructive**. It can be run multiple times without errors.

---

## Prerequisites

- Access to Supabase Dashboard
- Project: **Wallai**
- Role: **Admin** or **Owner**

---

## Step-by-Step Execution Instructions

### 1. Open Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **Wallai** project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**

---

### 2. Execute Migration Script

1. Open the file: `C:\dev\12w\database\migrations\EXECUTE_NOW.sql`

2. **Copy the entire contents** of the file

3. **Paste** into Supabase SQL Editor

4. Click **Run** (or press `Ctrl+Enter`)

5. **Wait for completion** (~10 seconds)

---

### 3. Expected Output

You should see output similar to this:

```
========================================
WALLAI - ONBOARDING MIGRATION
========================================
Starting critical migration...

STEP 1: Detecting user table name...
  → Found: user_profiles ✓

STEP 2: Adding onboarding_completed column...
  → Added onboarding_completed to user_profiles ✓

STEP 3: Adding is_personal column to spaces...
  → Added is_personal to spaces ✓
  → Created index idx_spaces_is_personal ✓

STEP 4: Adding auto_generated column to budgets...
  → Added auto_generated to budgets ✓

========================================
FINAL VERIFICATION
========================================
✅ user_profiles.onboarding_completed EXISTS
✅ spaces.is_personal EXISTS
✅ budgets.auto_generated EXISTS

========================================
🎉 MIGRATION SUCCESSFUL! 🎉

All onboarding columns are now ready.
The backend API should now work correctly.
========================================
```

---

### 4. Verify Migration Success

**Option A: Run Verification Script**

1. Open the file: `C:\dev\12w\database\migrations\VERIFY_FIX.sql`
2. Copy entire contents
3. Paste into Supabase SQL Editor
4. Click **Run**

**Expected Result:**

```
table_name                          | column_name          | exists | status
------------------------------------|----------------------|--------|--------
user table (user_profiles or users) | onboarding_completed | true   | ✓ READY
spaces                              | is_personal          | true   | ✓ READY
budgets                             | auto_generated       | true   | ✓ READY
```

All rows should show **✓ READY**.

---

**Option B: Manual Verification**

Run this query in SQL Editor:

```sql
-- Check columns exist
SELECT
  table_name,
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    (table_name IN ('user_profiles', 'users') AND column_name = 'onboarding_completed')
    OR (table_name = 'spaces' AND column_name = 'is_personal')
    OR (table_name = 'budgets' AND column_name = 'auto_generated')
  )
ORDER BY table_name, column_name;
```

You should see **3 rows** returned.

---

## After Migration: Test Backend API

### Test Onboarding Endpoint

**Request:**

```bash
curl -X POST http://localhost:8000/api/onboarding/space \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "space_name": "My Personal Space",
    "currency": "USD",
    "monthly_income": 5000,
    "framework": "50_30_20"
  }'
```

**Expected Response (200 OK):**

```json
{
  "space_id": "uuid-here",
  "budget_id": "uuid-here",
  "message": "Onboarding completed successfully"
}
```

---

## Troubleshooting

### Error: "Neither user_profiles nor users table exists"

**Cause:** Database schema not initialized

**Solution:**
1. Run `database/migrations/001_initial_schema.sql` first
2. Then run `EXECUTE_NOW.sql`

---

### Error: Column already exists

**Cause:** Migration already applied (this is **OK**)

**Action:** No action needed. The script detects existing columns and skips them.

---

### Error: Permission denied

**Cause:** Insufficient database privileges

**Solution:**
1. Ensure you're logged in as **project owner**
2. Or ask owner to run the migration

---

### Error: Relation "spaces" does not exist

**Cause:** Initial schema not created

**Solution:**
1. Run `database/migrations/001_initial_schema.sql`
2. Run `database/security/rls_policies.sql`
3. Then run `EXECUTE_NOW.sql`

---

## Migration Files Reference

| File | Purpose |
|------|---------|
| `EXECUTE_NOW.sql` | Main migration script (RUN THIS FIRST) |
| `VERIFY_FIX.sql` | Verification script (run after migration) |
| `003_onboarding_columns.sql` | Legacy - for `users` table |
| `004_onboarding_columns.sql` | Legacy - for `user_profiles` table |

**Note:** You only need to run **EXECUTE_NOW.sql**. It handles both `users` and `user_profiles` scenarios automatically.

---

## Database Schema Changes Summary

### Table: `user_profiles` (or `users`)

```sql
ALTER TABLE user_profiles
ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
```

- **Purpose:** Track onboarding wizard completion status
- **Default:** `FALSE` (new users haven't completed onboarding)
- **Usage:** Backend checks this before redirecting to dashboard

---

### Table: `spaces`

```sql
ALTER TABLE spaces
ADD COLUMN is_personal BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_spaces_is_personal
ON spaces(created_by, is_personal)
WHERE is_personal = TRUE;
```

- **Purpose:** Distinguish personal spaces from shared/collaborative spaces
- **Default:** `FALSE` (explicitly set to `TRUE` for personal spaces)
- **Index:** Optimized query for finding user's personal space
- **Usage:** Ensures only ONE personal space per user

---

### Table: `budgets`

```sql
ALTER TABLE budgets
ADD COLUMN auto_generated BOOLEAN DEFAULT FALSE;
```

- **Purpose:** Mark budgets created automatically by onboarding wizard
- **Default:** `FALSE` (manually created budgets)
- **Usage:** Distinguish wizard-generated budgets from user-created ones

---

## Security Considerations

- All changes are **additive** (no data deletion)
- Uses `IF NOT EXISTS` (safe to run multiple times)
- No RLS policy changes needed
- No breaking changes to existing code

---

## Rollback Plan (If Needed)

**WARNING: This will delete columns and data. Only use if absolutely necessary.**

```sql
-- Remove onboarding columns (DESTRUCTIVE)
ALTER TABLE user_profiles DROP COLUMN IF EXISTS onboarding_completed;
ALTER TABLE spaces DROP COLUMN IF EXISTS is_personal;
ALTER TABLE budgets DROP COLUMN IF EXISTS auto_generated;
DROP INDEX IF EXISTS idx_spaces_is_personal;
```

---

## Post-Migration Checklist

- [ ] Migration executed successfully in Supabase
- [ ] Verification script shows all columns exist
- [ ] Backend API starts without errors
- [ ] Test user can complete onboarding flow
- [ ] Personal space created correctly
- [ ] Budget auto-generated with correct framework
- [ ] No errors in application logs

---

## Support

**Issues with migration?**

1. Check Supabase SQL Editor for error messages
2. Run `VERIFY_FIX.sql` to see which columns are missing
3. Verify you're using the correct Supabase project
4. Ensure initial schema (`001_initial_schema.sql`) was run first

**Need help?**

- Review error output from SQL Editor
- Check application logs for backend errors
- Verify environment variables point to correct database

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2025-10-08 | Initial migration for onboarding columns |

---

**Migration created by:** Claude Code (Database Developer Agent)
**Last updated:** 2025-10-08
