"""
Script to apply migration 005_add_parent_child_categories.sql to Supabase
"""
import os
from supabase import create_client, Client
from pathlib import Path

# Get Supabase credentials from environment
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set")
    exit(1)

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Read migration file
migration_file = Path(__file__).parent / "migrations" / "005_add_parent_child_categories.sql"
print(f"📂 Reading migration file: {migration_file}")

with open(migration_file, "r", encoding="utf-8") as f:
    migration_sql = f.read()

print(f"📝 Migration SQL loaded ({len(migration_sql)} characters)")
print("\n" + "="*60)
print("MIGRATION PREVIEW:")
print("="*60)
print(migration_sql[:500] + "..." if len(migration_sql) > 500 else migration_sql)
print("="*60 + "\n")

# Confirm execution
response = input("⚠️  Apply this migration to Supabase? (yes/no): ")
if response.lower() != "yes":
    print("❌ Migration cancelled")
    exit(0)

print("\n🚀 Applying migration to Supabase...")

try:
    # Execute migration using Supabase RPC
    result = supabase.rpc("exec_sql", {"query": migration_sql}).execute()
    print("✅ Migration applied successfully!")
    print(f"📊 Result: {result.data}")
except Exception as e:
    print(f"❌ Error applying migration: {e}")
    print("\n💡 Note: You may need to apply this migration manually through Supabase Dashboard:")
    print("   1. Go to https://supabase.com/dashboard")
    print("   2. Select your project")
    print("   3. Go to SQL Editor")
    print("   4. Copy and paste the migration SQL")
    print("   5. Click 'Run'")
    exit(1)

print("\n✅ Migration 005 applied successfully!")
print("🎉 Parent-child category structure is now available in the database")
