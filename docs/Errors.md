# ERROR LOG - Wallai

## HOW TO DOCUMENT ERRORS

Each error entry must include:

1. **Date & Time** when error occurred
2. **File & Line** where error happened
3. **Error Message** complete and exact
4. **Context** what was being attempted
5. **Stack Trace** if applicable
6. **Solution Attempts** what was tried
7. **Resolution** final solution or current status

Format:

```markdown
- [ ] [2025-MM-DD HH:MM] Brief error description
  - **File:** path/to/file.ts:lineNumber
  - **Error:** Complete error message
  - **Context:** What operation was being performed
  - **Stack:** Stack trace if relevant
  - **Attempted:**
    1. First solution attempt
    2. Second solution attempt
  - **Status:** [ACTIVE/RESOLVED/BLOCKED]
  - **Solution:** How it was fixed (if resolved)
```

---

## 🔴 CRITICAL ERRORS (Blockers)

Errors that completely prevent development or break the system

### Active Critical Errors:

<!-- Add critical errors as they occur -->

---

## 🟡 ACTIVE ERRORS (Non-Critical)

Errors that don't block development but need fixing

### Active Non-Critical Errors:

<!-- Add non-critical errors as they occur -->

---

## 🟢 RESOLVED ERRORS (Reference)

Keep for future reference when similar issues occur

### Recently Resolved:

- [x] [2025-10-10 19:25] Budget types import error in budget.service.ts
  - **File:** wallai-web/src/services/budget.service.ts:9
  - **Error:** `Uncaught SyntaxError: The requested module '/src/types/Budget.types.ts' does not provide an export named 'Budget'`
  - **Context:** Same pattern as AxiosInstance - TypeScript interfaces imported as values
  - **Root Cause:** All Budget-related types (Budget, BudgetCreate, etc.) imported without type keyword
  - **Status:** RESOLVED
  - **Solution:** Changed from `import { Budget, ... }` to `import type { Budget, ... }`
  - **Files Modified:** wallai-web/src/services/budget.service.ts
  - **Prevention:** ALWAYS use `import type` for ALL TypeScript interfaces, types, and type aliases

- [x] [2025-10-10 19:15] AxiosInstance import error in budget.service.ts
  - **File:** wallai-web/src/services/budget.service.ts:6
  - **Error:** `Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/axios.js?v=ae482c30' does not provide an export named 'AxiosInstance'`
  - **Context:** Browser console showing import error when accessing /budgets page
  - **Root Cause:** AxiosInstance imported as named export instead of type import
  - **Status:** RESOLVED
  - **Solution:** Changed from `import axios, { AxiosInstance } from 'axios';` to `import axios from 'axios'; import type { AxiosInstance } from 'axios';`
  - **Files Modified:** wallai-web/src/services/budget.service.ts
  - **Prevention:** Always use `import type` for TypeScript type imports from libraries

- [x] [2025-10-10 19:00] Budget page showing "coming soon" instead of BudgetList component
  - **File:** wallai-web/src/App.tsx:137
  - **Error:** Page displays placeholder text "Budgets page coming soon" instead of actual component
  - **Context:** After implementing US-014 (Budget CRUD), the /budgets route was not updated to use the new BudgetsPage component
  - **Root Cause:** Route was using placeholder `<div>` instead of importing and rendering `BudgetsPage` component
  - **Attempted:**
    1. Created BudgetsPage component at wallai-web/src/pages/Budgets.tsx
    2. Created BudgetList and CreateBudgetModal components
    3. Fixed icon imports (lucide-react → @heroicons/react)
    4. Added @/services/* alias to tsconfig.app.json
  - **Status:** RESOLVED
  - **Solution:**
    1. Added import in App.tsx: `import BudgetsPage from './pages/Budgets';`
    2. Updated route: `<Route path="/budgets" element={<BudgetsPage />} />`
    3. Fixed icon imports in CreateBudgetModal.tsx and BudgetList.tsx
    4. Changed `TrendingUpIcon` → `ArrowTrendingUpIcon`
    5. Changed `AlertCircleIcon` → `ExclamationCircleIcon`
    6. Added `@/services/*` to tsconfig paths
  - **Files Modified:**
    - wallai-web/src/App.tsx (added import and updated route)
    - wallai-web/src/features/budgets/CreateBudgetModal.tsx (fixed icons)
    - wallai-web/src/features/budgets/BudgetList.tsx (fixed icons)
    - wallai-web/tsconfig.app.json (added services alias)
  - **Prevention:** Always update routing after creating new page components

---

## ⚠️ PROBLEMATIC PATTERNS - Wallai Specific

Recurring issues and their solutions

### Pattern: TypeScript Type Import Errors from npm Packages

**Problem:** "does not provide an export named [TypeName]" error in browser console
**Symptoms:**
- Vite dev server compiles without errors
- TypeScript checks pass
- Error only appears in browser console
- Import statement looks correct

**Solution:**
```typescript
// ❌ WRONG - Named export for types
import axios, { AxiosInstance } from 'axios';

// ✅ CORRECT - Use 'import type' for TypeScript types
import axios from 'axios';
import type { AxiosInstance } from 'axios';
```

**Why:** Some libraries only export types, not runtime values. Using `import type` tells the bundler to strip these imports at runtime.

**Other Common Cases:**
- `import type { Request, Response } from 'express';`
- `import type { NextPage } from 'next';`
- `import type { RouteComponentProps } from 'react-router-dom';`

### Pattern: New Page Components Not Appearing (Routing Issue)

**Problem:** Created new page component but route still shows placeholder or 404
**Symptoms:**
- Page displays "coming soon" text
- Component works in isolation but not in app
- No errors in console or TypeScript

**Solution Checklist:**
1. ✅ Import component in App.tsx: `import PageName from './pages/PageName';`
2. ✅ Update route element: `<Route path="/path" element={<PageName />} />`
3. ✅ Check component imports (use correct icon library)
4. ✅ Verify path aliases in tsconfig.app.json
5. ✅ Restart dev server after config changes

**Example:**
```typescript
// ❌ WRONG - Using placeholder
<Route path="/budgets" element={<div>Coming soon</div>} />

// ✅ CORRECT - Using actual component
import BudgetsPage from './pages/Budgets';
<Route path="/budgets" element={<BudgetsPage />} />
```

### Pattern: Supabase RLS Policy Blocking Queries

**Problem:** Row Level Security policies prevent users from accessing their own data
**Solution:** Ensure RLS policies check both direct ownership and space membership

```sql
-- Example: Allow users to see expenses in their spaces
CREATE POLICY "Users can view space expenses"
ON expenses FOR SELECT
USING (
  auth.uid() = user_id
  OR
  auth.uid() IN (
    SELECT user_id FROM space_members
    WHERE space_id = expenses.space_id
  )
);
```

### Pattern: Anthropic API Rate Limiting

**Problem:** Too many requests to Claude API causing 429 errors
**Solution:** Implement rate limiting and caching

```python
from functools import lru_cache
import redis

redis_client = redis.Redis()

class AIService:
    def __init__(self):
        self.rate_limiter = RateLimiter(max_requests=100, per_minutes=1)

    @lru_cache(maxsize=1000)
    async def categorize_expense(self, description: str):
        # Check cache first
        cached = redis_client.get(f"category:{description}")
        if cached:
            return json.loads(cached)

        # Rate limit check
        if not self.rate_limiter.allow_request():
            raise HTTPException(429, "Rate limit exceeded")

        # Make API call
        result = await self._call_anthropic(description)

        # Cache result
        redis_client.setex(f"category:{description}", 3600, json.dumps(result))
        return result
```

### Pattern: Zustand Store Hydration Issues

**Problem:** State not persisting or hydrating incorrectly on page refresh
**Solution:** Proper hydration handling with persist middleware

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      session: null,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        // Don't persist sensitive session data
      }),
    }
  )
);
```

### Pattern: React Query Stale Data

**Problem:** TanStack Query showing outdated data after mutations
**Solution:** Proper invalidation and optimistic updates

```typescript
const createExpenseMutation = useMutation({
  mutationFn: createExpense,
  onSuccess: (data) => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    queryClient.invalidateQueries({ queryKey: ["budgets"] });

    // Or optimistic update
    queryClient.setQueryData(["expenses"], (old) => [...old, data]);
  },
  onError: (error) => {
    toast.error("Failed to create expense");
  },
});
```

### Pattern: Supabase Realtime Not Working

**Problem:** Realtime subscriptions not receiving updates
**Solution:** Check Realtime is enabled for tables and proper channel setup

```typescript
useEffect(() => {
  const channel = supabase
    .channel("expenses-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "expenses",
        filter: `space_id=eq.${spaceId}`,
      },
      (payload) => {
        console.log("Change received!", payload);
        // Update local state
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [spaceId]);
```

---

## 📚 LESSONS LEARNED - Wallai Specific

### Supabase Issues

- Always enable RLS on new tables
- Test RLS policies with different user roles
- Use service key only in backend, never frontend
- Enable Realtime in Supabase dashboard for tables that need it

### Anthropic AI Issues

- Cache responses to reduce API costs
- Implement retry logic with exponential backoff
- Use streaming for long responses
- Keep prompts concise to reduce token usage

### React/TypeScript Issues

- Use strict TypeScript mode from start
- Avoid 'any' types - define interfaces properly
- Handle loading and error states in all components
- Unsubscribe from Supabase channels on unmount

### FastAPI Issues

- Use Pydantic for all request/response validation
- Implement proper CORS for Supabase Auth
- Handle async operations properly
- Use dependency injection for services

### PWA Issues

- Update service worker version on each deployment
- Test offline mode thoroughly
- Handle stale cache properly
- Implement proper update prompts

---

## 🔧 WALLAI-SPECIFIC SOLUTION SNIPPETS

### Supabase Auth Session Management

```typescript
// Check and refresh session
const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Session error:", error);
    return null;
  }

  if (session?.expires_at) {
    const expiresAt = new Date(session.expires_at * 1000);
    const now = new Date();

    // Refresh if expires in less than 5 minutes
    if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
      const {
        data: { session: newSession },
      } = await supabase.auth.refreshSession();
      return newSession;
    }
  }

  return session;
};
```

### Expense Categorization with Fallback

```python
async def categorize_expense(description: str) -> dict:
    """Categorize expense with AI, fallback to rules"""
    try:
        # Try AI categorization
        result = await ai_service.categorize(description)
        if result['confidence'] > 0.7:
            return result
    except Exception as e:
        logger.warning(f"AI categorization failed: {e}")

    # Fallback to rule-based
    categories = {
        'grocery': ['walmart', 'target', 'kroger', 'whole foods'],
        'dining': ['restaurant', 'cafe', 'starbucks', 'mcdonalds'],
        'transport': ['uber', 'lyft', 'gas', 'parking'],
        'utilities': ['electric', 'water', 'internet', 'phone'],
    }

    description_lower = description.lower()
    for category, keywords in categories.items():
        if any(keyword in description_lower for keyword in keywords):
            return {'category': category, 'confidence': 0.5}

    return {'category': 'other', 'confidence': 0.0}
```

### Budget Calculation with Currency

```typescript
interface BudgetCalculation {
  totalIncome: number;
  totalExpenses: number;
  remaining: number;
  percentUsed: number;
  currency: string;
}

const calculateBudgetStatus = (
  budget: Budget,
  expenses: Expense[]
): BudgetCalculation => {
  const totalIncome = budget.income_items.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalExpenses = expenses
    .filter((e) => e.month_period === budget.month_period)
    .reduce((sum, e) => sum + e.amount, 0);

  const remaining = totalIncome - totalExpenses;
  const percentUsed = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    remaining,
    percentUsed: Math.round(percentUsed),
    currency: budget.currency || "USD",
  };
};
```

### Space Invitation System

```python
import secrets
import string

def generate_invite_code() -> str:
    """Generate 6-character alphanumeric invite code"""
    alphabet = string.ascii_uppercase + string.digits
    # Avoid confusing characters
    alphabet = alphabet.replace('O', '').replace('0', '').replace('I', '').replace('1', '')
    return ''.join(secrets.choice(alphabet) for _ in range(6))

async def join_space_with_code(code: str, user_id: str) -> dict:
    """Join a space using invite code"""
    # Find space
    space = await db.fetch_one(
        "SELECT * FROM spaces WHERE invite_code = :code AND is_active = true",
        {"code": code.upper()}
    )

    if not space:
        raise HTTPException(404, "Invalid invite code")

    # Check member limit
    member_count = await db.fetch_val(
        "SELECT COUNT(*) FROM space_members WHERE space_id = :space_id",
        {"space_id": space.id}
    )

    if member_count >= 10:
        raise HTTPException(400, "Space is full")

    # Check if already member
    existing = await db.fetch_one(
        "SELECT * FROM space_members WHERE space_id = :space_id AND user_id = :user_id",
        {"space_id": space.id, "user_id": user_id}
    )

    if existing:
        raise HTTPException(400, "Already a member of this space")

    # Add member
    await db.execute(
        "INSERT INTO space_members (space_id, user_id, role) VALUES (:space_id, :user_id, 'member')",
        {"space_id": space.id, "user_id": user_id}
    )

    return {"success": True, "space": space}
```

---

## 🚨 WALLAI STACK-SPECIFIC ERRORS

### React + TypeScript Errors

- Type inference issues with Supabase client
- Hydration mismatch in Next.js (if migrating)
- Strict mode causing double renders

### FastAPI + Python Errors

- Pydantic v2 validation changes
- Async context manager issues
- SQLAlchemy session management

### Supabase Errors

- RLS policy conflicts
- Storage bucket permissions
- Realtime connection drops

### Deployment Errors

- Environment variable mismatches
- Build failures on Vercel
- Railway deployment issues

---

## 📈 ERROR LOG HISTORY

### Week of 2025-10-03

- Total errors encountered: 3
- Critical errors: 0
- Resolved: 3
- Still active: 0

#### Errors This Week:
1. ✅ Budget page routing issue (2025-10-10) - RESOLVED
2. ✅ AxiosInstance import error (2025-10-10) - RESOLVED
3. ✅ Budget types import error (2025-10-10) - RESOLVED

---

## 🔍 DEBUGGING CHECKLIST

When encountering a new error:

1. **Immediate Actions:**

   - [ ] Copy exact error message
   - [ ] Note file and line number
   - [ ] Check browser console
   - [ ] Check network tab for API errors
   - [ ] Verify Supabase dashboard for issues

2. **Investigation:**

   - [ ] Search this file for similar errors
   - [ ] Check Supabase logs
   - [ ] Verify RLS policies
   - [ ] Check Anthropic API dashboard
   - [ ] Review recent code changes

3. **Documentation:**
   - [ ] Add error to appropriate section
   - [ ] Document all solution attempts
   - [ ] Update status regularly
   - [ ] Add solution when found
   - [ ] Create snippet if reusable

---

**Last Updated:** 2025-10-10 19:30
**Total Documented Errors:** 3
**Resolution Rate:** 100% (3/3 resolved)
**Most Common Issue Category:** Import/Configuration
