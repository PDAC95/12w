# Wallai Database Migrations - Index

## Critical Migration Files (START HERE)

### 1. EXECUTE_NOW.sql
**Purpose:** Main migration script to add onboarding columns
**When to run:** IMMEDIATELY (if onboarding endpoint returns 400 Bad Request)
**Execution:** Copy entire file to Supabase SQL Editor and run
**Time:** ~10 seconds
**Status:** ✅ Safe, idempotent, non-destructive

---

### 2. VERIFY_FIX.sql
**Purpose:** Verify migration was successful
**When to run:** AFTER running EXECUTE_NOW.sql
**Expected output:** All columns show "✓ READY"
**Time:** ~2 seconds

---

### 3. MIGRATION_INSTRUCTIONS.txt
**Purpose:** Quick start guide (plain text)
**Format:** Text file with step-by-step instructions
**Best for:** Quick reference, printing

---

## Documentation Files

### 4. README_MIGRATION.md
**Purpose:** Complete migration documentation
**Contents:**
- Problem statement
- Detailed instructions
- Troubleshooting guide
- Schema changes explained
- Rollback procedures
- Post-migration checklist

**Best for:** In-depth understanding, troubleshooting

---

## Diagnostic & Testing Files

### 5. DIAGNOSE.sql
**Purpose:** Comprehensive database health check
**When to run:** Anytime (safe, read-only)
**Output:** Detailed status of all tables, columns, indexes
**Best for:** Identifying what's missing or broken

---

### 6. TEST_MIGRATION.sql
**Purpose:** Integration test simulating onboarding flow
**When to run:** AFTER migration to validate functionality
**What it does:**
- Creates test user, space, and budget
- Verifies all columns work correctly
- Cleans up test data automatically

**Best for:** Confirming everything works end-to-end

---

### 7. INDEX.md
**Purpose:** This file - navigation guide
**Contents:** Overview of all migration files

---

## Legacy Migration Files (Reference Only)

### 8. 001_initial_schema.sql
**Purpose:** Initial database schema creation
**Status:** Should already be executed
**Note:** Run this FIRST if starting from scratch

---

### 9. 002_auth_triggers.sql
**Purpose:** Authentication triggers setup
**Status:** Should already be executed

---

### 10. 003_onboarding_columns.sql
**Purpose:** Legacy - adds onboarding columns to `users` table
**Status:** ⚠️ DEPRECATED - use EXECUTE_NOW.sql instead
**Note:** Only works if table is named `users` (not `user_profiles`)

---

### 11. 004_onboarding_columns.sql
**Purpose:** Legacy - adds onboarding columns to `user_profiles` table
**Status:** ⚠️ DEPRECATED - use EXECUTE_NOW.sql instead
**Note:** Only works if table is named `user_profiles`

---

### 12. 003_rename_users_to_profiles.sql
**Purpose:** Renames `users` table to `user_profiles`
**Status:** Should already be executed
**Note:** EXECUTE_NOW.sql auto-detects which table exists

---

## Execution Order (Fresh Installation)

If setting up database from scratch:

1. `001_initial_schema.sql` - Creates all tables
2. `002_auth_triggers.sql` - Sets up auth triggers
3. `EXECUTE_NOW.sql` - Adds onboarding columns
4. `VERIFY_FIX.sql` - Verify success
5. `TEST_MIGRATION.sql` - Run integration test

---

## Execution Order (Existing Installation)

If database already exists but onboarding fails:

1. `DIAGNOSE.sql` - Identify missing columns
2. `EXECUTE_NOW.sql` - Add missing columns
3. `VERIFY_FIX.sql` - Verify success
4. `TEST_MIGRATION.sql` - (Optional) Run integration test

---

## File Decision Tree

### I need to fix the onboarding endpoint
→ Run `EXECUTE_NOW.sql`

### I want to verify migration worked
→ Run `VERIFY_FIX.sql`

### I don't know what's wrong
→ Run `DIAGNOSE.sql`

### I want step-by-step instructions
→ Read `MIGRATION_INSTRUCTIONS.txt`

### I need detailed documentation
→ Read `README_MIGRATION.md`

### I want to test everything works
→ Run `TEST_MIGRATION.sql`

### I'm setting up from scratch
→ Run migrations in order (see "Fresh Installation" above)

---

## Summary Table

| File | Type | Purpose | When to Use |
|------|------|---------|-------------|
| EXECUTE_NOW.sql | Migration | Add onboarding columns | When onboarding fails |
| VERIFY_FIX.sql | Verification | Confirm migration success | After running EXECUTE_NOW |
| MIGRATION_INSTRUCTIONS.txt | Docs | Quick start guide | Need quick reference |
| README_MIGRATION.md | Docs | Complete documentation | Need detailed info |
| DIAGNOSE.sql | Diagnostic | Database health check | Troubleshooting |
| TEST_MIGRATION.sql | Test | Integration test | Validate functionality |
| INDEX.md | Navigation | This file | Navigate migration files |

---

## Environment

**Database:** PostgreSQL (Supabase)
**Project:** Wallai
**Schema:** public
**Tables affected:**
- user_profiles (or users)
- spaces
- budgets

---

## Support

**Issues?**
1. Run `DIAGNOSE.sql` to identify problems
2. Check `README_MIGRATION.md` troubleshooting section
3. Verify Supabase project is correct
4. Ensure you have admin/owner permissions

---

**Last updated:** 2025-10-08
**Version:** 1.0
**Created by:** Claude Code (Database Developer Agent)
