# Wallai Database Migrations

> Database schema migrations for Wallai financial management application

---

## Quick Start (Fix Onboarding Issue)

**Problem:** Backend endpoint `POST /api/onboarding/space` returns 400 Bad Request

**Solution:** Run the critical migration script

### 3-Step Fix

1. **Open Supabase SQL Editor**
   - Go to https://supabase.com/dashboard
   - Select Wallai project
   - Click SQL Editor → New Query

2. **Execute Migration**
   - Copy contents of `EXECUTE_NOW.sql`
   - Paste into SQL Editor
   - Click Run

3. **Verify Success**
   - Copy contents of `VERIFY_FIX.sql`
   - Paste into SQL Editor
   - Click Run
   - Confirm all show "✓ READY"

**Done!** Backend should now work correctly.

---

## File Structure

```
database/migrations/
├── README.md                         ← You are here
├── INDEX.md                          ← Detailed file index
├── MIGRATION_INSTRUCTIONS.txt        ← Quick reference guide
├── README_MIGRATION.md               ← Complete documentation
│
├── EXECUTE_NOW.sql                   ← 🔥 MAIN MIGRATION (run this)
├── VERIFY_FIX.sql                    ← Verification script
├── PRE_MIGRATION_CHECK.sql           ← Check before migrating
├── DIAGNOSE.sql                      ← Troubleshooting tool
├── TEST_MIGRATION.sql                ← Integration test
│
├── 001_initial_schema.sql            ← Initial database setup
├── 002_auth_triggers.sql             ← Auth triggers setup
├── 003_rename_users_to_profiles.sql  ← Table rename
├── 003_onboarding_columns.sql        ← (Legacy)
├── 004_onboarding_columns.sql        ← (Legacy)
└── FIX_OAUTH_TRIGGER.sql             ← OAuth fix
```

---

## What This Migration Does

Adds critical columns needed for onboarding flow:

| Table | Column | Type | Purpose |
|-------|--------|------|---------|
| `user_profiles` | `onboarding_completed` | BOOLEAN | Tracks onboarding completion |
| `spaces` | `is_personal` | BOOLEAN | Marks personal spaces |
| `budgets` | `auto_generated` | BOOLEAN | Marks auto-created budgets |

**Safe:** Non-destructive, idempotent, no data loss

---

## Choose Your Path

### I just want to fix it quickly
→ Read `MIGRATION_INSTRUCTIONS.txt`
→ Run `EXECUTE_NOW.sql`

### I want detailed documentation
→ Read `README_MIGRATION.md`

### I want to check status first
→ Run `PRE_MIGRATION_CHECK.sql`

### I'm not sure what's wrong
→ Run `DIAGNOSE.sql`

### I want to verify it worked
→ Run `VERIFY_FIX.sql`

### I want to test thoroughly
→ Run `TEST_MIGRATION.sql`

### I want a complete file list
→ Read `INDEX.md`

---

## Migration Execution Order

### For Existing Database (Onboarding Fix)
```
PRE_MIGRATION_CHECK.sql  (optional - verify prerequisites)
         ↓
EXECUTE_NOW.sql          (main migration)
         ↓
VERIFY_FIX.sql           (verify success)
         ↓
TEST_MIGRATION.sql       (optional - integration test)
```

### For Fresh Installation
```
001_initial_schema.sql
         ↓
002_auth_triggers.sql
         ↓
EXECUTE_NOW.sql
         ↓
VERIFY_FIX.sql
```

---

## Troubleshooting

### Migration fails with "table not found"
**Cause:** Initial schema not created
**Fix:** Run `001_initial_schema.sql` first

### Migration says "no changes needed"
**Cause:** Columns already exist (this is OK!)
**Action:** Run `VERIFY_FIX.sql` to confirm

### Onboarding still fails after migration
**Diagnose:** Run `DIAGNOSE.sql`
**Check:** Backend logs for specific error
**Verify:** Environment variables point to correct database

### Want to see what will change
**Before migrating:** Run `PRE_MIGRATION_CHECK.sql`

---

## Safety Guarantees

✅ **Idempotent** - Safe to run multiple times
✅ **Non-destructive** - No data deletion
✅ **Additive** - Only adds columns
✅ **Default values** - Existing rows get FALSE
✅ **No breaking changes** - Backward compatible

---

## Requirements

- **Database:** PostgreSQL (Supabase)
- **Access:** Admin or Owner role
- **Environment:** Supabase Dashboard with SQL Editor

---

## Support

**Need help?**

1. Run `DIAGNOSE.sql` to identify issues
2. Check `README_MIGRATION.md` for troubleshooting
3. Verify Supabase project is correct
4. Ensure proper permissions

**Files not working?**

- Verify you copied the entire file contents
- Check Supabase SQL Editor for error messages
- Confirm you're in the correct database

---

## Version Information

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2025-10-08 | Initial onboarding migration |

**Database:** PostgreSQL 15+ (Supabase)
**Project:** Wallai
**Schema:** public

---

## Developer Notes

### Why separate EXECUTE_NOW.sql from 003/004?

- `003_onboarding_columns.sql` - Works only for `users` table
- `004_onboarding_columns.sql` - Works only for `user_profiles` table
- `EXECUTE_NOW.sql` - Auto-detects which table exists (recommended)

### Can I run this in production?

Yes. Migration is:
- Non-blocking (no locks)
- Instant for small databases
- Safe for existing data
- Tested with integration suite

### What if I need to rollback?

```sql
-- Rollback script (CAUTION: Deletes columns)
ALTER TABLE user_profiles DROP COLUMN IF EXISTS onboarding_completed;
ALTER TABLE spaces DROP COLUMN IF EXISTS is_personal;
ALTER TABLE budgets DROP COLUMN IF EXISTS auto_generated;
DROP INDEX IF EXISTS idx_spaces_is_personal;
```

**Warning:** Only rollback if absolutely necessary. Data in those columns will be lost.

---

## Testing

### Unit Test (Column Existence)
```bash
# Run VERIFY_FIX.sql
# Expected: All columns show "✓ READY"
```

### Integration Test (End-to-End)
```bash
# Run TEST_MIGRATION.sql
# Expected: "🎉 ALL TESTS PASSED!"
```

### Manual Test (Backend API)
```bash
curl -X POST http://localhost:8000/api/onboarding/space \
  -H "Authorization: Bearer TOKEN" \
  -d '{"space_name":"Test","currency":"USD","monthly_income":5000,"framework":"50_30_20"}'

# Expected: 200 OK with space_id and budget_id
```

---

## Related Documentation

- [Main README](../../README.md) - Project overview
- [Database Schema](../schema/) - Complete schema docs
- [API Documentation](../../apps/api/docs/) - Backend API reference

---

**Created by:** Claude Code (Database Developer Agent)
**Last updated:** 2025-10-08
**Status:** Production Ready
