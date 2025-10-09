-- =====================================================
-- WALLAI ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- This file contains all Row Level Security policies
-- for the Wallai application to ensure data isolation
-- and proper access control at the database level.
--
-- IMPORTANT: Run this AFTER creating the schema (US-004)
--
-- Security Principles:
-- 1. Users can only access their own data
-- 2. Space members can access space data
-- 3. Owners have additional permissions
-- 4. Service role bypasses RLS (backend only)
-- =====================================================

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_insights ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER_PROFILES TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);

-- Users are created via trigger (no direct INSERT)
-- Service role can insert for admin tasks
CREATE POLICY "Service role can insert user profiles"
ON user_profiles FOR INSERT
WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- SPACES TABLE POLICIES
-- =====================================================

-- Users can view spaces they are members of
CREATE POLICY "Users can view their spaces"
ON spaces FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM space_members
    WHERE space_members.space_id = spaces.id
    AND space_members.user_id = auth.uid()
  )
);

-- Any authenticated user can create a space
CREATE POLICY "Authenticated users can create spaces"
ON spaces FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Only space owners can update spaces
CREATE POLICY "Space owners can update spaces"
ON spaces FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM space_members
    WHERE space_members.space_id = spaces.id
    AND space_members.user_id = auth.uid()
    AND space_members.role = 'owner'
  )
);

-- Only space owners can delete spaces
CREATE POLICY "Space owners can delete spaces"
ON spaces FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM space_members
    WHERE space_members.space_id = spaces.id
    AND space_members.user_id = auth.uid()
    AND space_members.role = 'owner'
  )
);

-- =====================================================
-- SPACE_MEMBERS TABLE POLICIES
-- =====================================================

-- Members can view other members in their spaces
CREATE POLICY "Space members can view other members"
ON space_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM space_members sm
    WHERE sm.space_id = space_members.space_id
    AND sm.user_id = auth.uid()
  )
);

-- Users can join spaces (INSERT happens via join endpoint)
CREATE POLICY "Users can join spaces"
ON space_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Owners and admins can add members
CREATE POLICY "Owners can add members"
ON space_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM space_members sm
    WHERE sm.space_id = space_members.space_id
    AND sm.user_id = auth.uid()
    AND sm.role IN ('owner', 'admin')
  )
);

-- Owners and admins can update member roles
CREATE POLICY "Owners can update member roles"
ON space_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM space_members sm
    WHERE sm.space_id = space_members.space_id
    AND sm.user_id = auth.uid()
    AND sm.role IN ('owner', 'admin')
  )
);

-- Users can remove themselves from spaces
CREATE POLICY "Users can leave spaces"
ON space_members FOR DELETE
USING (user_id = auth.uid());

-- Owners can remove members
CREATE POLICY "Owners can remove members"
ON space_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM space_members sm
    WHERE sm.space_id = space_members.space_id
    AND sm.user_id = auth.uid()
    AND sm.role = 'owner'
  )
);

-- =====================================================
-- BUDGETS TABLE POLICIES
-- =====================================================

-- Space members can view budgets
CREATE POLICY "Space members can view budgets"
ON budgets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM space_members
    WHERE space_members.space_id = budgets.space_id
    AND space_members.user_id = auth.uid()
  )
);

-- Space members can create budgets
CREATE POLICY "Space members can create budgets"
ON budgets FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM space_members
    WHERE space_members.space_id = budgets.space_id
    AND space_members.user_id = auth.uid()
  )
);

-- Budget creator, owners, and admins can update
CREATE POLICY "Members can update budgets"
ON budgets FOR UPDATE
USING (
  auth.uid() = created_by
  OR EXISTS (
    SELECT 1 FROM space_members
    WHERE space_members.space_id = budgets.space_id
    AND space_members.user_id = auth.uid()
    AND space_members.role IN ('owner', 'admin')
  )
);

-- Budget creator, owners, and admins can delete
CREATE POLICY "Members can delete budgets"
ON budgets FOR DELETE
USING (
  auth.uid() = created_by
  OR EXISTS (
    SELECT 1 FROM space_members
    WHERE space_members.space_id = budgets.space_id
    AND space_members.user_id = auth.uid()
    AND space_members.role IN ('owner', 'admin')
  )
);

-- =====================================================
-- BUDGET_ITEMS TABLE POLICIES
-- =====================================================

-- Space members can view budget items
CREATE POLICY "Space members can view budget items"
ON budget_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM budgets
    JOIN space_members ON space_members.space_id = budgets.space_id
    WHERE budgets.id = budget_items.budget_id
    AND space_members.user_id = auth.uid()
  )
);

-- Space members can create budget items
CREATE POLICY "Space members can create budget items"
ON budget_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM budgets
    JOIN space_members ON space_members.space_id = budgets.space_id
    WHERE budgets.id = budget_items.budget_id
    AND space_members.user_id = auth.uid()
  )
);

-- Space members can update budget items
CREATE POLICY "Space members can update budget items"
ON budget_items FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM budgets
    JOIN space_members ON space_members.space_id = budgets.space_id
    WHERE budgets.id = budget_items.budget_id
    AND space_members.user_id = auth.uid()
  )
);

-- Space members can delete budget items
CREATE POLICY "Space members can delete budget items"
ON budget_items FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM budgets
    JOIN space_members ON space_members.space_id = budgets.space_id
    WHERE budgets.id = budget_items.budget_id
    AND space_members.user_id = auth.uid()
  )
);

-- =====================================================
-- EXPENSES TABLE POLICIES
-- =====================================================

-- Space members can view expenses in their spaces
CREATE POLICY "Space members can view expenses"
ON expenses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM space_members
    WHERE space_members.space_id = expenses.space_id
    AND space_members.user_id = auth.uid()
  )
);

-- Space members can create expenses
CREATE POLICY "Space members can create expenses"
ON expenses FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM space_members
    WHERE space_members.space_id = expenses.space_id
    AND space_members.user_id = auth.uid()
  )
  AND auth.uid() = created_by
);

-- Expense creator can update their expenses
CREATE POLICY "Users can update own expenses"
ON expenses FOR UPDATE
USING (auth.uid() = created_by);

-- Expense creator and space owners can delete
CREATE POLICY "Users can delete own expenses"
ON expenses FOR DELETE
USING (
  auth.uid() = created_by
  OR EXISTS (
    SELECT 1 FROM space_members
    WHERE space_members.space_id = expenses.space_id
    AND space_members.user_id = auth.uid()
    AND space_members.role = 'owner'
  )
);

-- =====================================================
-- EXPENSE_SPLITS TABLE POLICIES
-- =====================================================

-- Space members can view expense splits
CREATE POLICY "Space members can view expense splits"
ON expense_splits FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expenses
    JOIN space_members ON space_members.space_id = expenses.space_id
    WHERE expenses.id = expense_splits.expense_id
    AND space_members.user_id = auth.uid()
  )
);

-- Expense creator can create splits
CREATE POLICY "Expense creator can create splits"
ON expense_splits FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM expenses
    WHERE expenses.id = expense_splits.expense_id
    AND expenses.created_by = auth.uid()
  )
);

-- Expense creator can update splits
CREATE POLICY "Expense creator can update splits"
ON expense_splits FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM expenses
    WHERE expenses.id = expense_splits.expense_id
    AND expenses.created_by = auth.uid()
  )
);

-- Expense creator can delete splits
CREATE POLICY "Expense creator can delete splits"
ON expense_splits FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM expenses
    WHERE expenses.id = expense_splits.expense_id
    AND expenses.created_by = auth.uid()
  )
);

-- =====================================================
-- AI_CONVERSATIONS TABLE POLICIES
-- =====================================================

-- Users can view their own conversations
CREATE POLICY "Users can view own conversations"
ON ai_conversations FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own conversations
CREATE POLICY "Users can create conversations"
ON ai_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations"
ON ai_conversations FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own conversations
CREATE POLICY "Users can delete own conversations"
ON ai_conversations FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- FINANCIAL_INSIGHTS TABLE POLICIES
-- =====================================================

-- Space members can view insights for their spaces
CREATE POLICY "Space members can view insights"
ON financial_insights FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM space_members
    WHERE space_members.space_id = financial_insights.space_id
    AND space_members.user_id = auth.uid()
  )
);

-- Service role creates insights (via backend)
CREATE POLICY "Service role can create insights"
ON financial_insights FOR INSERT
WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- STORAGE POLICIES (Supabase Storage)
-- =====================================================

-- Receipt uploads: Users can upload to their own folder
CREATE POLICY "Users can upload receipts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'receipts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own receipts
CREATE POLICY "Users can view own receipts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'receipts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own receipts
CREATE POLICY "Users can update own receipts"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'receipts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own receipts
CREATE POLICY "Users can delete own receipts"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'receipts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Avatar uploads: Users can manage their avatar
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Avatars are publicly readable
CREATE POLICY "Avatars are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- TESTING RLS POLICIES
-- =====================================================

-- To test RLS policies, use these queries:

-- 1. Test as specific user:
-- SET LOCAL ROLE authenticated;
-- SET LOCAL request.jwt.claims.sub = 'user-uuid-here';

-- 2. Test queries:
-- SELECT * FROM spaces;  -- Should only see user's spaces
-- SELECT * FROM expenses WHERE space_id = 'space-uuid';

-- 3. Reset:
-- RESET ROLE;

-- =====================================================
-- GRANT PERMISSIONS TO AUTHENTICATED USERS
-- =====================================================

-- Grant usage on all tables
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- NOTES
-- =====================================================

-- 1. RLS policies are evaluated BEFORE any SQL query
-- 2. Service role (backend) bypasses ALL RLS policies
-- 3. Always test policies with actual user tokens
-- 4. Use SELECT * FROM ... to verify policy behavior
-- 5. Policies are ANDed together (all must pass)
-- 6. FOR SELECT/INSERT/UPDATE/DELETE controls the operation
-- 7. USING controls visibility (SELECT, UPDATE, DELETE)
-- 8. WITH CHECK controls insert/update validation
-- 9. auth.uid() returns current authenticated user's ID
-- 10. EXISTS subqueries are efficient for checking membership

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If users can't see data they should:
-- 1. Check if RLS is enabled: SELECT * FROM pg_tables WHERE tablename = 'your_table';
-- 2. List policies: SELECT * FROM pg_policies WHERE tablename = 'your_table';
-- 3. Check space membership: SELECT * FROM space_members WHERE user_id = 'uuid';
-- 4. Test with SET LOCAL ROLE to simulate user
-- 5. Check Supabase logs for policy violations

-- If users see data they shouldn't:
-- 1. Verify RLS is enabled on the table
-- 2. Check policy logic with USING clause
-- 3. Ensure no overly permissive policies exist
-- 4. Test with different user roles

-- =====================================================
-- SECURITY BEST PRACTICES
-- =====================================================

-- 1. Always enable RLS on new tables immediately
-- 2. Test policies with multiple user scenarios
-- 3. Use service role ONLY in backend, never frontend
-- 4. Validate space membership in all space-related policies
-- 5. Don't expose service_role key to frontend
-- 6. Use auth.uid() not request.user.id (deprecated)
-- 7. Add indexes on frequently queried columns in policies
-- 8. Monitor Supabase dashboard for policy violations
-- 9. Review policies during security audits
-- 10. Document policy changes in CHANGELOG

-- =====================================================
-- MAINTENANCE
-- =====================================================

-- Run this query monthly to check for tables without RLS:
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
AND tablename NOT IN (
  SELECT tablename FROM pg_policies
)
AND tableowner != 'supabase_admin';

-- =====================================================
-- END OF RLS POLICIES
-- =====================================================
