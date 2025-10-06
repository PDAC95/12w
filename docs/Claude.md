# CLAUDE.md - Wallai Framework Rules

## MANDATORY RULES FOR CLAUDE CODE

### 🚀 START OF EACH SESSION

1. **ALWAYS read files in this exact order:**

   ```
   1. CLAUDE.md (this file - project rules)
   2. PLANNING.md (technical architecture)
   3. PRD.md (product requirements)
   4. TASKS.md (find next P0 task)
   5. ERRORS.md (check active blockers)
   6. PROGRESS.md (review last session)
   ```

2. **Announce work plan:**

   ```
   "Files loaded. Working on: [Task #X - Description]
   Priority: P0
   Sprint: [Current Sprint]
   Estimated time: [X hours]"
   ```

3. **Environment verification checklist:**
   - [ ] Supabase project running
   - [ ] PostgreSQL connection active
   - [ ] All npm/pnpm packages installed
   - [ ] Environment variables configured (.env)
   - [ ] FastAPI server running (port: 8000)
   - [ ] React dev server running (port: 3000)
   - [ ] Redis running (port: 6379)
   - [ ] No conflicting processes on ports

### 💻 DURING DEVELOPMENT

#### Code Standards Enforcement

**Technology Stack Compliance:**

- React 18 + TypeScript (Web PWA)
- React Native + Expo (Mobile)
- FastAPI + Python 3.11+ (Backend)
- Supabase (Auth, Database, Storage)
- PostgreSQL 15+ (Database)
- Redis (Cache)
- Anthropic Claude API (AI)

**File Naming Conventions:**

```typescript
// Frontend (React/TypeScript)
Components: PascalCase.tsx (Button.tsx, ExpenseCard.tsx)
Hooks: use[HookName].ts (useAuth.ts, useBudget.ts)
Services: [name].service.ts (api.service.ts, ai.service.ts)
Types: [Name].types.ts (User.types.ts, Budget.types.ts)
Utils: camelCase.ts (formatCurrency.ts, dateHelpers.ts)
Stores: [name]Store.ts (authStore.ts, budgetStore.ts)

// Backend (Python/FastAPI)
Models: models.py (class User, class Budget)
Schemas: schemas.py (UserSchema, BudgetSchema)
Routes: [resource]_router.py (auth_router.py, budget_router.py)
Services: [name]_service.py (ai_service.py, bank_service.py)
Utils: [name]_helpers.py (date_helpers.py, validators.py)
```

**API Response Consistency:**

```python
# All API responses must follow this format
{
    "success": True,
    "data": {
        "id": "uuid",
        "attributes": {}
    },
    "meta": {
        "timestamp": "2025-10-03T10:00:00Z",
        "request_id": "uuid"
    }
}

# Error responses
{
    "success": False,
    "error": {
        "code": "BUDGET_EXCEEDED",
        "message": "Budget limit exceeded",
        "details": {"category": "food", "limit": 500}
    }
}
```

#### Before Writing Any Code

1. **Announce specific changes:**

   ```
   "Modifying: apps/web/src/features/expenses/ExpenseForm.tsx
   Component: ExpenseForm
   Purpose: Add receipt upload with OCR
   Dependencies: Adding react-dropzone"
   ```

2. **Check ERRORS.md for related issues:**

   - Search for file name
   - Check for similar error patterns
   - Apply documented solutions
   - Avoid repeating fixed errors

3. **Verify against PLANNING.md:**
   - Follows folder structure?
   - Uses correct naming?
   - Implements security standards?
   - Matches API patterns?

#### After Each Code Change

1. **Test immediately:**

   ```bash
   # Frontend
   pnpm dev  # Check for errors
   pnpm test  # Run unit tests

   # Backend
   uvicorn main:app --reload  # Check API
   pytest  # Run tests
   ```

2. **Update documentation:**
   - Docstrings for complex functions
   - Update API documentation if changed
   - Note breaking changes in CHANGELOG.md

#### Task Completion Protocol

1. **Update TASKS.md immediately:**

   ```markdown
   - [x] [2025-10-03 14:30] [P0] Implement expense categorization with AI
   ```

2. **Add to PROGRESS.md:**

   ```markdown
   ## 2025-10-03

   ✅ Completed: AI expense categorization

   - Details: Integrated Anthropic API for auto-categorization
   - Files modified:
     - backend/src/services/ai_service.py
     - frontend/src/features/expenses/ExpenseForm.tsx
   - Testing: Created 10 test expenses, 90% accuracy
     ⚠️ Issues: Rate limiting needs adjustment
   ```

3. **Document any errors in ERRORS.md:**
   ```markdown
   - [ ] [2025-10-03 14:30] Anthropic API rate limit exceeded
     - File: backend/src/services/ai_service.py:45
     - Error: 429 Too Many Requests
     - Context: Batch categorization of expenses
     - Solution: Implement queue with retry logic
     - Status: Active
   ```

### 🎯 TASK PRIORITY SYSTEM

**P0 - CRITICAL (Do immediately):**

- Authentication broken
- Database connection issues
- Payment processing failures
- Security vulnerabilities
- Data loss risks
- Production bugs

**P1 - IMPORTANT (Do after all P0):**

- Core features (spaces, budgets, expenses)
- AI chat functionality
- User-facing features
- Performance issues
- Bank integration
- PWA functionality

**P2 - NICE TO HAVE (Only if no P0/P1):**

- UI enhancements
- Code refactoring
- Documentation updates
- Test coverage improvements
- Minor optimizations

### 🚫 FORBIDDEN ACTIONS

**NEVER do these:**

1. Skip reading documentation files
2. Use different tech stack than specified
3. Commit .env file or API keys
4. Delete migrations without backup
5. Use print() instead of logging
6. Skip input validation (Pydantic/Zod)
7. Ignore Supabase RLS policies
8. Make DB changes without migrations
9. Use any/unknown TypeScript types
10. Forget to update TASKS.md

**ALWAYS do these:**

1. Use Supabase client for auth/db operations
2. Validate with Pydantic (backend) / Zod (frontend)
3. Handle errors with try-catch/except
4. Use TypeScript strict mode
5. Follow REST conventions for APIs
6. Test with different user roles
7. Implement proper error boundaries
8. Use environment variables for config
9. Run tests before marking complete
10. Update all tracking files

### 📄 SESSION MANAGEMENT

#### Starting a Session

```markdown
## Session Start: 2025-10-03 14:00

- Previous session: Completed authentication system
- Current task: Implement expense tracking
- Blockers: None
- Environment ready: Yes
```

#### During the Session

- Commit code every 30 minutes:
  ```bash
  git add .
  git commit -m "feat(expenses): add receipt OCR scanning"
  git push origin main
  ```
- Update TASKS.md after each completion
- Document errors immediately
- Run tests frequently

#### Ending a Session

1. **Create session summary in PROGRESS.md:**

   ```markdown
   ## Session Summary - 2025-10-03 18:00

   Duration: 4 hours

   Completed Tasks:

   - Expense model with AI categorization
   - Receipt upload functionality

   In Progress:

   - Expense splitting logic (60% complete)

   Blockers:

   - Anthropic rate limiting on bulk operations

   Next Session Priority:

   1. Fix rate limiting with queue
   2. Complete expense splitting
   3. Start budget dashboard

   Notes:

   - Consider caching AI responses
   - Need to optimize image uploads
   ```

2. **Cleanup:**

   ```bash
   # Check for issues
   pnpm lint
   pytest

   # Final commit
   git status
   git add .
   git commit -m "chore: end of session cleanup"
   ```

### 🔧 WALLAI-SPECIFIC PATTERNS

#### Supabase Integration Pattern

```typescript
// Frontend - Using Supabase client
import { supabase } from "@/lib/supabase";

export const createExpense = async (expense: ExpenseInput) => {
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      ...expense,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

#### AI Service Pattern

```python
# Backend - Anthropic integration
from anthropic import Anthropic
from core.config import settings

class AIService:
    def __init__(self):
        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    async def categorize_expense(self, description: str) -> dict:
        """Categorize expense using Claude"""
        try:
            message = await self.client.messages.create(
                model="claude-3-opus",
                max_tokens=100,
                messages=[{
                    "role": "user",
                    "content": f"Categorize this expense: {description}"
                }]
            )
            return {
                "category": message.content,
                "confidence": 0.95
            }
        except Exception as e:
            logger.error(f"AI categorization failed: {e}")
            return {"category": "other", "confidence": 0.0}
```

#### Error Handling Pattern

```python
# Backend - FastAPI error handling
from fastapi import HTTPException

@router.post("/expenses")
async def create_expense(
    expense: ExpenseSchema,
    current_user: User = Depends(get_current_user)
):
    try:
        # Validate budget limits
        if not await budget_service.check_limit(expense):
            raise HTTPException(400, "Budget limit exceeded")

        # Create expense
        result = await expense_service.create(expense, current_user)

        return {
            "success": True,
            "data": result,
            "message": "Expense created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Expense creation failed: {e}")
        raise HTTPException(500, "Internal server error")
```

### 🎯 WALLAI SPRINT ROADMAP

**Current Sprint: Sprint 1 - Foundation (Weeks 1-2)**

- [x] Project setup with Supabase
- [x] Authentication system
- [ ] Space creation and management
- [ ] Basic budget CRUD
- [ ] Manual expense entry
- [ ] Simple dashboard

**Sprint 2: AI Integration (Weeks 3-4)**

- [ ] Anthropic API integration
- [ ] Chat interface
- [ ] Auto-categorization
- [ ] Basic insights

**Sprint 3: Core Features (Weeks 5-6)**

- [ ] Expense splitting
- [ ] Budget frameworks (50/30/20)
- [ ] Recurring expenses
- [ ] Mobile app setup

**Sprint 4: Banking & Polish (Weeks 7-8)**

- [ ] Plaid integration
- [ ] Receipt OCR
- [ ] Price comparison
- [ ] Performance optimization
- [ ] Launch preparation

### 📊 TESTING REQUIREMENTS

**Unit Testing:**

```python
# Backend - pytest
def test_expense_categorization():
    service = AIService()
    result = await service.categorize_expense("Coffee at Starbucks")
    assert result["category"] == "dining"
    assert result["confidence"] > 0.8
```

```typescript
// Frontend - Vitest
describe("ExpenseForm", () => {
  it("should validate amount is positive", () => {
    const result = expenseSchema.safeParse({ amount: -10 });
    expect(result.success).toBe(false);
  });
});
```

**E2E Testing (Critical Paths Only):**

1. User registration → Space creation → Budget setup
2. Expense entry → AI categorization → Dashboard update
3. Chat conversation → Insight generation
4. Bank connection → Transaction import

### 🔍 COMMON WALLAI ISSUES & SOLUTIONS

**Issue: Supabase RLS policies blocking queries**

```sql
-- Solution: Create proper RLS policies
CREATE POLICY "Users can view own expenses"
ON expenses FOR SELECT
USING (auth.uid() = user_id OR
       auth.uid() IN (
         SELECT user_id FROM space_members
         WHERE space_id = expenses.space_id
       ));
```

**Issue: Anthropic API costs too high**

```python
# Solution: Cache responses
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_cached_category(description: str):
    # Check Redis first
    cached = redis_client.get(f"category:{description}")
    if cached:
        return json.loads(cached)

    # Call AI if not cached
    result = ai_service.categorize(description)
    redis_client.setex(f"category:{description}", 3600, json.dumps(result))
    return result
```

**Issue: PWA not updating**

```javascript
// Solution: Proper service worker versioning
const CACHE_VERSION = "v1.0.1";
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_VERSION)
          .map((name) => caches.delete(name))
      );
    })
  );
});
```

### 📈 SUCCESS METRICS

**Code Quality Indicators:**

- TypeScript strict mode: No any types
- Python type hints: 100% coverage
- Test coverage: >80% for critical paths
- API response time: <200ms p95
- Error rate: <0.1%

**Development Velocity:**

- P0 tasks: Complete same day
- P1 tasks: Complete within sprint
- Documentation: Updated immediately
- Tests: Written before marking complete

---

## REMEMBER

**The framework exists to:**

1. Build Wallai efficiently with Claude Code assistance
2. Maintain high code quality
3. Track progress accurately
4. Leverage AI for financial insights
5. Deliver value to users quickly

**Never compromise on:**

1. Security (financial data is sensitive)
2. Input validation
3. Error handling
4. Task documentation
5. User experience

**Current Sprint:** Sprint 1 - Foundation
**Sprint Goal:** Complete auth, spaces, and basic budgets
**Sprint End Date:** 2025-10-17
**Next Major Milestone:** AI Integration (Sprint 2)

---

_This document is the source of truth for Wallai development. Follow it strictly._
