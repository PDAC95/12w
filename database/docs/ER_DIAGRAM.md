# Wallai Entity-Relationship Diagram

## Overview

This document provides a visual representation of the Wallai database schema, showing all tables, relationships, and key constraints.

## Database Version

- **Schema Version:** 1.0.0
- **Created:** 2025-10-06
- **PostgreSQL:** 15+
- **Tables:** 9 core tables
- **Relationships:** 12 foreign keys

---

## Visual ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           WALLAI DATABASE SCHEMA                        │
│                              Version 1.0.0                              │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   auth.users         │ (Supabase managed)
│                      │
│  PK  id (UUID)       │
│      email           │
│      password (hash) │
└──────┬───────────────┘
       │
       │ extends (1:1)
       ↓
┌──────────────────────┐         ┌──────────────────────────┐
│   users              │         │   ai_conversations       │
│                      │         │                          │
│  PK  id (UUID) ──────┼────┬───►│  PK  id (UUID)           │
│      username *      │    │    │  FK  user_id ────────────┤
│      full_name       │    │    │  FK  space_id (nullable) │
│      avatar_url      │    │    │      thread_id           │
│      currency        │    │    │      title               │
│      timezone        │    │    │      messages (JSONB)    │
│      settings (JSON) │    │    │      total_tokens        │
│      created_at      │    │    │      is_active           │
│      updated_at      │    │    │      created_at          │
└──────┬───────────────┘    │    │      last_message_at     │
       │                    │    └──────────────────────────┘
       │                    │
       │ created_by         │ user_id
       ↓                    ↓
┌──────────────────────┐         ┌──────────────────────────┐
│   spaces             │◄────────┤   space_members          │
│                      │         │                          │
│  PK  id (UUID)       │         │  PK  id (UUID)           │
│      name *          │         │  FK  space_id ───────────┤
│      description     │         │  FK  user_id ────────────┤
│      invite_code *   │         │      role * (owner|admin │
│      currency        │         │              |member     │
│      timezone        │         │              |viewer)    │
│      is_active       │         │      is_active           │
│  FK  created_by ─────┤         │      joined_at           │
│      created_at      │         │      left_at (nullable)  │
│      updated_at      │         │  UQ  (space_id, user_id) │
└──────┬───────────────┘         └──────────────────────────┘
       │
       │ space_id (1:M)
       ├────────────────────┬───────────────────┬─────────────────┐
       ↓                    ↓                   ↓                 ↓
┌──────────────────────┐  ┌─────────────────┐ ┌──────────────┐  ┌──────────────────┐
│   budgets            │  │   expenses      │ │ financial    │  │ space_members   │
│                      │  │                 │ │ _insights    │  │ (shown above)   │
│  PK  id (UUID)       │  │  PK  id (UUID)  │ │              │  └──────────────────┘
│  FK  space_id ───────┤  │  FK  space_id ──┤ │  PK  id (UUID│
│      name *          │  │  FK  budget_id  │ │  FK  space_id┤
│      description     │  │      (nullable) │ │      type *  │
│      type * (master  │  │  FK  budget_    │ │      title * │
│            |second.) │  │      item_id    │ │      descrip.│
│      month_period *  │  │      (nullable) │ │      insight_│
│      framework       │  │      amount *   │ │      data    │
│      total_income    │  │      descrip. * │ │      priority│
│      total_budgeted  │  │      category * │ │      confid. │
│      total_spent     │  │      ai_category│ │      is_read │
│      currency        │  │      _confidence│ │      is_dism.│
│  FK  created_by      │  │      date *     │ │      period  │
│      created_at      │  │      receipt_url│ │      created │
│      updated_at      │  │      receipt_   │ │      expires │
│  UQ  (space_id, type,│  │      processed  │ └──────────────┘
│       month_period)  │  │      payment_   │
└──────┬───────────────┘  │      method     │
       │                  │      bank_trans.│
       │ budget_id (1:M)  │      currency   │
       ↓                  │      tags []    │
┌──────────────────────┐  │      notes      │
│   budget_items       │  │  FK  created_by │
│                      │  │      created_at │
│  PK  id (UUID)       │  │      updated_at │
│  FK  budget_id ──────┤  └─────┬───────────┘
│      category *      │        │
│      description     │        │ expense_id (1:M)
│      category_type * │        ↓
│      budgeted_amount │  ┌─────────────────┐
│      spent_amount    │  │ expense_splits  │
│      icon            │  │                 │
│      color           │  │  PK  id (UUID)  │
│      display_order   │  │  FK  expense_id │
│      created_at      │  │  FK  user_id ───┤
│      updated_at      │  │      amount *   │
└──────────────────────┘  │      percentage │
                          │      is_paid    │
                          │      paid_at    │
                          │      payment_   │
                          │      method     │
                          │      payment_   │
                          │      reference  │
                          │  UQ  (expense_id│
                          │      , user_id) │
                          └─────────────────┘

LEGEND:
────────────────────────────────────────────
PK  = Primary Key               *   = NOT NULL
FK  = Foreign Key               UQ  = Unique Constraint
─── = Foreign Key Relationship  (1:M) = One-to-Many
◄── = Many-to-One              (M:M) = Many-to-Many
```

---

## Table Relationships

### Core Relationships

#### 1. Users ↔ Spaces (Many-to-Many via space_members)

```
users (1) ──< (M) space_members (M) >── (1) spaces
```

- One user can belong to many spaces
- One space can have many users
- Junction table: `space_members`
- Additional data: role, is_active, joined_at

#### 2. Spaces → Budgets (One-to-Many)

```
spaces (1) ──< (M) budgets
```

- One space can have many budgets
- Each budget belongs to exactly one space
- Unique constraint: one master budget per space per month

#### 3. Budgets → Budget Items (One-to-Many)

```
budgets (1) ──< (M) budget_items
```

- One budget contains many budget items (categories)
- Each budget item belongs to exactly one budget
- Cascade delete: removing budget removes all items

#### 4. Spaces → Expenses (One-to-Many)

```
spaces (1) ──< (M) expenses
```

- One space can have many expenses
- Each expense belongs to exactly one space
- Optional: expense can be linked to budget and budget_item

#### 5. Expenses → Expense Splits (One-to-Many)

```
expenses (1) ──< (M) expense_splits
```

- One expense can be split among many users
- Each split belongs to exactly one expense
- Unique constraint: one split per user per expense

#### 6. Users → AI Conversations (One-to-Many)

```
users (1) ──< (M) ai_conversations
```

- One user can have many AI conversations
- Each conversation belongs to exactly one user
- Optional: conversation can be scoped to a space

#### 7. Spaces → Financial Insights (One-to-Many)

```
spaces (1) ──< (M) financial_insights
```

- One space can have many AI-generated insights
- Each insight belongs to exactly one space
- Created by backend (service role)

---

## Cardinality Summary

| From Table | Relationship | To Table | Cardinality | Junction Table |
|------------|--------------|----------|-------------|----------------|
| users | extends | auth.users | 1:1 | - |
| users | member of | spaces | M:M | space_members |
| users | creates | spaces | 1:M | - |
| users | creates | expenses | 1:M | - |
| users | creates | budgets | 1:M | - |
| users | has | ai_conversations | 1:M | - |
| users | owes | expense_splits | 1:M | - |
| spaces | contains | budgets | 1:M | - |
| spaces | contains | expenses | 1:M | - |
| spaces | contains | space_members | 1:M | - |
| spaces | has | financial_insights | 1:M | - |
| budgets | contains | budget_items | 1:M | - |
| expenses | has | expense_splits | 1:M | - |
| expenses | links to | budget (optional) | M:1 | - |
| expenses | links to | budget_item (optional) | M:1 | - |

---

## Detailed Table Descriptions

### 1. users

**Purpose:** Extended user profiles beyond Supabase auth.users

**Key Features:**
- Links to Supabase auth via id (UUID)
- Unique username for @mentions
- User preferences (currency, timezone, language)
- JSON settings for flexibility

**Relationships:**
- Extends: auth.users (1:1)
- Creates: spaces, budgets, expenses (1:M)
- Member of: spaces via space_members (M:M)
- Owns: ai_conversations (1:M)
- Owes: expense_splits (1:M)

### 2. spaces

**Purpose:** Collaborative financial workspaces

**Key Features:**
- Auto-generated 6-character invite code
- Multi-currency support
- Soft delete via is_active flag

**Relationships:**
- Created by: users (M:1)
- Has members: users via space_members (M:M)
- Contains: budgets, expenses, financial_insights (1:M)

### 3. space_members

**Purpose:** Junction table for user-space relationships

**Key Features:**
- Role-based access: owner, admin, member, viewer
- Tracks join/leave dates
- Unique constraint: one membership per user per space

**Relationships:**
- Links: users ↔ spaces (M:M)

### 4. budgets

**Purpose:** Monthly financial plans

**Key Features:**
- Two types: master (main monthly), secondary (projects)
- Framework support: 50/30/20, 60/20/20, zero-based, custom
- Unique: one master budget per space per month
- Tracks totals: income, budgeted, spent

**Relationships:**
- Belongs to: spaces (M:1)
- Created by: users (M:1)
- Contains: budget_items (1:M)
- Referenced by: expenses (optional, 1:M)

### 5. budget_items

**Purpose:** Budget categories (line items)

**Key Features:**
- Category types: needs, wants, savings, income
- Tracks budgeted vs spent amounts
- Visual customization: icon, color
- Display order for UI

**Relationships:**
- Belongs to: budgets (M:1)
- Referenced by: expenses (optional, 1:M)

### 6. expenses

**Purpose:** Individual financial transactions

**Key Features:**
- AI categorization with confidence scores
- Receipt upload support
- Bank integration ready (Plaid)
- Full-text search on description
- Array of tags for flexible categorization

**Relationships:**
- Belongs to: spaces (M:1)
- Created by: users (M:1)
- Links to: budgets (optional, M:1)
- Links to: budget_items (optional, M:1)
- Has: expense_splits (1:M)

### 7. expense_splits

**Purpose:** Split shared expenses among members

**Key Features:**
- Amount and/or percentage split
- Payment tracking (is_paid, paid_at)
- Payment method and reference
- Unique: one split per user per expense

**Relationships:**
- Belongs to: expenses (M:1)
- Assigned to: users (M:1)

### 8. ai_conversations

**Purpose:** Chat history with AI assistant (Sprint 2)

**Key Features:**
- Stores messages as JSONB array
- Thread tracking for Anthropic API
- Token usage tracking
- Auto-generated conversation titles

**Relationships:**
- Belongs to: users (M:1)
- Scoped to: spaces (optional, M:1)

### 9. financial_insights

**Purpose:** AI-generated insights and recommendations (Sprint 2)

**Key Features:**
- Types: trend, anomaly, recommendation, prediction, goal
- Priority levels: low, medium, high, urgent
- Confidence scoring
- Read/dismiss tracking
- Auto-expiration

**Relationships:**
- Belongs to: spaces (M:1)
- Created by: backend service role

---

## Indexes Strategy

### Performance-Critical Indexes

```sql
-- Fast space member lookups
idx_space_members_space_id ON space_members(space_id)
idx_space_members_user_id ON space_members(user_id)

-- Fast expense queries
idx_expenses_space_date ON expenses(space_id, date DESC)
idx_expenses_category ON expenses(category)

-- Full-text search
idx_expenses_description_trgm ON expenses USING gin(description gin_trgm_ops)

-- Fast budget lookups
idx_budgets_space_month ON budgets(space_id, month_period)
```

### Unique Constraints

```sql
-- Business logic constraints
UQ users.username
UQ spaces.invite_code
UQ budgets(space_id, type, month_period)
UQ space_members(space_id, user_id)
UQ expense_splits(expense_id, user_id)
```

---

## Data Flow Examples

### Example 1: Creating a Shared Expense

```
1. User creates expense
   └─> INSERT INTO expenses (space_id, amount, description, category, created_by)

2. AI categorizes expense
   └─> UPDATE expenses SET ai_category_confidence = 0.95

3. User splits expense
   └─> INSERT INTO expense_splits (expense_id, user_id, amount, percentage)

4. Budget item updated
   └─> UPDATE budget_items SET spent_amount = spent_amount + split_amount
```

### Example 2: User Joins Space

```
1. User enters invite code
   └─> SELECT * FROM spaces WHERE invite_code = 'ABC123'

2. System creates membership
   └─> INSERT INTO space_members (space_id, user_id, role)

3. User sees space data (via RLS)
   └─> SELECT * FROM budgets WHERE space_id = 'space-uuid'
   └─> SELECT * FROM expenses WHERE space_id = 'space-uuid'
```

### Example 3: Monthly Budget Creation

```
1. User creates master budget
   └─> INSERT INTO budgets (space_id, type, month_period, framework)

2. System generates budget items based on framework
   └─> INSERT INTO budget_items (budget_id, category, category_type, budgeted_amount)
   (50/30/20: Needs=50%, Wants=30%, Savings=20%)

3. User adjusts amounts
   └─> UPDATE budget_items SET budgeted_amount = X WHERE id = 'item-uuid'

4. Expenses track against items
   └─> UPDATE budget_items SET spent_amount = spent_amount + expense_amount
```

---

## Constraints and Validations

### Check Constraints

```sql
-- Amount validations
CHECK (amount > 0)  -- expenses must be positive
CHECK (budgeted_amount >= 0)  -- budgets can be zero
CHECK (spent_amount >= 0)  -- spent cannot be negative

-- Percentage validations
CHECK (percentage >= 0 AND percentage <= 100)  -- splits
CHECK (ai_category_confidence >= 0 AND ai_category_confidence <= 1)

-- Enum validations
CHECK (role IN ('owner', 'admin', 'member', 'viewer'))
CHECK (type IN ('master', 'secondary'))
CHECK (framework IN ('50_30_20', '60_20_20', 'zero_based', 'custom'))
CHECK (category_type IN ('needs', 'wants', 'savings', 'income'))
```

### Foreign Key Cascades

```sql
-- ON DELETE CASCADE (removes children)
users.id → spaces.created_by (SET NULL)
spaces.id → space_members.space_id (CASCADE)
spaces.id → budgets.space_id (CASCADE)
budgets.id → budget_items.budget_id (CASCADE)
expenses.id → expense_splits.expense_id (CASCADE)

-- ON DELETE SET NULL (keeps orphans)
budgets.id → expenses.budget_id (SET NULL)
budget_items.id → expenses.budget_item_id (SET NULL)
```

---

## Migration History

| Version | Date | Description | Tables Added |
|---------|------|-------------|--------------|
| 1.0.0 | 2025-10-06 | Initial schema | All 9 tables |

**Next Migration:** 2.0.0 (TBD) - Add products, product_prices tables for price intelligence feature

---

**Last Updated:** 2025-10-06
**Maintained by:** Wallai Engineering Team
**Related:** [Database Schema SQL](../migrations/001_initial_schema.sql), [RLS Policies](../security/rls_policies.sql)
