-- =====================================================
-- WALLAI DATABASE SCHEMA - INITIAL MIGRATION
-- =====================================================
-- File: 001_initial_schema.sql
-- Created: 2025-10-06
-- Description: Initial database schema for Wallai MVP
--
-- INSTRUCTIONS:
-- 1. Run this in Supabase SQL Editor
-- 2. Then run database/security/rls_policies.sql
-- 3. Verify all tables are created with \dt command
-- =====================================================

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate 6-character invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  -- Excludes confusing chars: O,0,I,1
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 1. USERS TABLE (extends auth.users)
-- =====================================================
-- Stores extended user profile information
-- Links to Supabase auth.users via id (UUID)

CREATE TABLE users (
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
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Comments
COMMENT ON TABLE users IS 'Extended user profiles, links to auth.users';
COMMENT ON COLUMN users.settings IS 'JSON object for user preferences and app settings';

-- =====================================================
-- 2. SPACES TABLE
-- =====================================================
-- Collaborative financial spaces (households, couples, groups)

CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Information
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  description TEXT,

  -- Invitation
  invite_code TEXT UNIQUE NOT NULL DEFAULT generate_invite_code(),

  -- Settings
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'America/New_York',
  settings JSONB DEFAULT '{}'::JSONB,

  -- Status
  is_active BOOLEAN DEFAULT true NOT NULL,

  -- Ownership
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger for updated_at
CREATE TRIGGER set_spaces_updated_at
  BEFORE UPDATE ON spaces
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes
CREATE INDEX idx_spaces_created_by ON spaces(created_by);
CREATE INDEX idx_spaces_invite_code ON spaces(invite_code);
CREATE INDEX idx_spaces_is_active ON spaces(is_active) WHERE is_active = true;
CREATE INDEX idx_spaces_created_at ON spaces(created_at DESC);

-- Comments
COMMENT ON TABLE spaces IS 'Collaborative financial spaces for households, couples, or groups';
COMMENT ON COLUMN spaces.invite_code IS 'Unique 6-character code for inviting members';

-- =====================================================
-- 3. SPACE_MEMBERS TABLE
-- =====================================================
-- Links users to spaces with roles

CREATE TABLE space_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Role & Permissions
  role TEXT DEFAULT 'member' NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),

  -- Status
  is_active BOOLEAN DEFAULT true NOT NULL,

  -- Timestamps
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  left_at TIMESTAMPTZ,

  -- Unique constraint: one membership per user per space
  UNIQUE(space_id, user_id)
);

-- Indexes
CREATE INDEX idx_space_members_space_id ON space_members(space_id);
CREATE INDEX idx_space_members_user_id ON space_members(user_id);
CREATE INDEX idx_space_members_role ON space_members(role);
CREATE INDEX idx_space_members_active ON space_members(space_id, user_id) WHERE is_active = true;

-- Comments
COMMENT ON TABLE space_members IS 'Junction table linking users to spaces with roles';
COMMENT ON COLUMN space_members.role IS 'owner: full control, admin: manage members, member: contribute, viewer: read-only';

-- =====================================================
-- 4. BUDGETS TABLE
-- =====================================================
-- Monthly budget plans for spaces

CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,

  -- Budget Information
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 200),
  description TEXT,

  -- Type and Period
  type TEXT DEFAULT 'master' NOT NULL CHECK (type IN ('master', 'secondary')),
  month_period TEXT NOT NULL,  -- Format: YYYY-MM

  -- Financial Framework
  framework TEXT DEFAULT 'custom' CHECK (framework IN ('50_30_20', '60_20_20', 'zero_based', 'custom')),

  -- Totals
  total_income DECIMAL(12, 2) DEFAULT 0 NOT NULL CHECK (total_income >= 0),
  total_budgeted DECIMAL(12, 2) DEFAULT 0 NOT NULL CHECK (total_budgeted >= 0),
  total_spent DECIMAL(12, 2) DEFAULT 0 NOT NULL CHECK (total_spent >= 0),

  -- Metadata
  currency TEXT DEFAULT 'USD',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraint: Only one master budget per space per month
  UNIQUE(space_id, type, month_period)
);

-- Trigger for updated_at
CREATE TRIGGER set_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes
CREATE INDEX idx_budgets_space_id ON budgets(space_id);
CREATE INDEX idx_budgets_month_period ON budgets(month_period DESC);
CREATE INDEX idx_budgets_type ON budgets(type);
CREATE INDEX idx_budgets_space_month ON budgets(space_id, month_period);
CREATE INDEX idx_budgets_created_by ON budgets(created_by);

-- Comments
COMMENT ON TABLE budgets IS 'Monthly budget plans with financial frameworks';
COMMENT ON COLUMN budgets.type IS 'master: main monthly budget, secondary: project/goal budgets';
COMMENT ON COLUMN budgets.framework IS 'Financial framework: 50/30/20, 60/20/20, zero-based, or custom';

-- =====================================================
-- 5. BUDGET_ITEMS TABLE
-- =====================================================
-- Line items within budgets (categories)

CREATE TABLE budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,

  -- Item Information
  category TEXT NOT NULL CHECK (length(category) >= 1 AND length(category) <= 100),
  description TEXT,

  -- Classification
  category_type TEXT DEFAULT 'needs' CHECK (category_type IN ('needs', 'wants', 'savings', 'income')),

  -- Amounts
  budgeted_amount DECIMAL(12, 2) DEFAULT 0 NOT NULL CHECK (budgeted_amount >= 0),
  spent_amount DECIMAL(12, 2) DEFAULT 0 NOT NULL CHECK (spent_amount >= 0),

  -- Visual
  icon TEXT,  -- Icon name (e.g., 'shopping-cart', 'home', 'car')
  color TEXT DEFAULT '#4ADE80',  -- Hex color code

  -- Order for display
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger for updated_at
CREATE TRIGGER set_budget_items_updated_at
  BEFORE UPDATE ON budget_items
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes
CREATE INDEX idx_budget_items_budget_id ON budget_items(budget_id);
CREATE INDEX idx_budget_items_category ON budget_items(category);
CREATE INDEX idx_budget_items_category_type ON budget_items(category_type);
CREATE INDEX idx_budget_items_display_order ON budget_items(budget_id, display_order);

-- Comments
COMMENT ON TABLE budget_items IS 'Categories within budgets with budgeted vs actual amounts';
COMMENT ON COLUMN budget_items.category_type IS 'Classification for 50/30/20 framework: needs, wants, savings, income';

-- =====================================================
-- 6. EXPENSES TABLE
-- =====================================================
-- Individual financial transactions

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  budget_id UUID REFERENCES budgets(id) ON DELETE SET NULL,
  budget_item_id UUID REFERENCES budget_items(id) ON DELETE SET NULL,

  -- Transaction Details
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL CHECK (length(description) >= 1),

  -- Categorization
  category TEXT NOT NULL,
  ai_category_confidence DECIMAL(3, 2) CHECK (ai_category_confidence >= 0 AND ai_category_confidence <= 1),

  -- Date
  date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Receipt
  receipt_url TEXT,
  receipt_processed BOOLEAN DEFAULT false,

  -- Payment Method
  payment_method TEXT,  -- cash, credit, debit, transfer

  -- Bank Integration (for future Plaid integration)
  bank_transaction_id TEXT,

  -- Metadata
  currency TEXT DEFAULT 'USD',
  tags TEXT[],  -- Array of tags for search
  notes TEXT,

  -- Ownership
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger for updated_at
CREATE TRIGGER set_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes for queries
CREATE INDEX idx_expenses_space_id ON expenses(space_id);
CREATE INDEX idx_expenses_budget_id ON expenses(budget_id);
CREATE INDEX idx_expenses_budget_item_id ON expenses(budget_item_id);
CREATE INDEX idx_expenses_date ON expenses(date DESC);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);
CREATE INDEX idx_expenses_space_date ON expenses(space_id, date DESC);
CREATE INDEX idx_expenses_bank_transaction_id ON expenses(bank_transaction_id) WHERE bank_transaction_id IS NOT NULL;

-- Full-text search index on description
CREATE INDEX idx_expenses_description_trgm ON expenses USING gin(description gin_trgm_ops);

-- Comments
COMMENT ON TABLE expenses IS 'Individual financial transactions with AI categorization';
COMMENT ON COLUMN expenses.ai_category_confidence IS 'Confidence score from AI categorization (0.0 to 1.0)';

-- =====================================================
-- 7. EXPENSE_SPLITS TABLE
-- =====================================================
-- Split expenses among space members

CREATE TABLE expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Split Details
  amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
  percentage DECIMAL(5, 2) CHECK (percentage >= 0 AND percentage <= 100),

  -- Payment Status
  is_paid BOOLEAN DEFAULT false NOT NULL,
  paid_at TIMESTAMPTZ,

  -- Payment Method (for tracking settlements)
  payment_method TEXT,
  payment_reference TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Unique constraint: one split per user per expense
  UNIQUE(expense_id, user_id)
);

-- Trigger for updated_at
CREATE TRIGGER set_expense_splits_updated_at
  BEFORE UPDATE ON expense_splits
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes
CREATE INDEX idx_expense_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX idx_expense_splits_user_id ON expense_splits(user_id);
CREATE INDEX idx_expense_splits_unpaid ON expense_splits(user_id, is_paid) WHERE is_paid = false;

-- Comments
COMMENT ON TABLE expense_splits IS 'Split expenses among space members with payment tracking';

-- =====================================================
-- 8. AI_CONVERSATIONS TABLE (for Sprint 2)
-- =====================================================
-- Chat conversations with AI assistant

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,

  -- Conversation Data
  thread_id TEXT,  -- Anthropic thread ID
  title TEXT,  -- Auto-generated summary of conversation

  -- Messages stored as JSONB array
  messages JSONB DEFAULT '[]'::JSONB NOT NULL,

  -- Metadata
  total_tokens INTEGER DEFAULT 0,
  model TEXT DEFAULT 'claude-3-opus',

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at
CREATE TRIGGER set_ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_space_id ON ai_conversations(space_id);
CREATE INDEX idx_ai_conversations_last_message ON ai_conversations(user_id, last_message_at DESC);

-- Comments
COMMENT ON TABLE ai_conversations IS 'Chat conversations with Anthropic Claude assistant';
COMMENT ON COLUMN ai_conversations.messages IS 'Array of message objects with role and content';

-- =====================================================
-- 9. FINANCIAL_INSIGHTS TABLE (for Sprint 2)
-- =====================================================
-- AI-generated financial insights and recommendations

CREATE TABLE financial_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,

  -- Insight Information
  type TEXT NOT NULL CHECK (type IN ('trend', 'anomaly', 'recommendation', 'prediction', 'goal')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Data
  insight_data JSONB DEFAULT '{}'::JSONB,  -- Charts, numbers, details

  -- Priority & Confidence
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  confidence_score DECIMAL(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),

  -- Status
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,

  -- Period
  period_start DATE,
  period_end DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_financial_insights_space_id ON financial_insights(space_id);
CREATE INDEX idx_financial_insights_type ON financial_insights(type);
CREATE INDEX idx_financial_insights_priority ON financial_insights(priority);
CREATE INDEX idx_financial_insights_unread ON financial_insights(space_id, is_read) WHERE is_read = false;
CREATE INDEX idx_financial_insights_created_at ON financial_insights(created_at DESC);

-- Comments
COMMENT ON TABLE financial_insights IS 'AI-generated financial insights and recommendations';
COMMENT ON COLUMN financial_insights.type IS 'Type of insight: trend, anomaly, recommendation, prediction, or goal';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check all tables created
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check all indexes
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename;

-- Check all triggers
-- SELECT trigger_name, event_manipulation, event_object_table
-- FROM information_schema.triggers WHERE trigger_schema = 'public';

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Wallai database schema created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Run database/security/rls_policies.sql';
  RAISE NOTICE '2. Create storage buckets in Supabase dashboard';
  RAISE NOTICE '3. Test database connectivity from FastAPI';
END $$;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
