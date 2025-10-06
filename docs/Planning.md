# PLANNING.md - Wallai Technical Architecture

## Project Vision

Wallai es un asistente financiero personal impulsado por IA que transforma la gestión de finanzas personales mediante conversación natural, análisis predictivo y colaboración multi-usuario. El proyecto está migrando hacia un stack moderno optimizado para desarrollo rápido con IA, utilizando React/React Native para frontend, FastAPI para backend, Supabase como BaaS, y Anthropic Claude para capacidades conversacionales.

**MVP Scope:** Autenticación, espacios colaborativos, gestión de presupuestos, tracking de gastos, chat IA básico, dashboard analítico
**Current Status:** Fase de desarrollo inicial - Setup de infraestructura
**Target Launch:** Febrero 2026 (MVP en 8 semanas)

## Technical Architecture

### System Architecture Diagram

```
┌───────────────────────────────────────────────────────────┐
│                   CloudFlare CDN / WAF                     │
└───────────────┬────────────────────────┬──────────────────┘
                │                        │
    ┌───────────▼──────────┐   ┌────────▼──────────┐
    │    Web App (PWA)     │   │   Mobile Apps     │
    │  React + TypeScript  │   │  React Native     │
    │    Vercel Hosted     │   │   Expo + EAS      │
    └───────────┬──────────┘   └────────┬──────────┘
                │                        │
    ┌───────────▼────────────────────────▼──────────┐
    │              Supabase (BaaS)                  │
    │  ┌─────────────────────────────────────────┐  │
    │  │ Auth │ Database │ Storage │ Realtime   │  │
    │  │ RLS  │ PostGIS  │  CDN   │ WebSockets │  │
    │  └─────────────────────────────────────────┘  │
    └───────────┬────────────────────────┬──────────┘
                │                        │
    ┌───────────▼──────────┐   ┌────────▼──────────┐
    │   FastAPI Backend    │   │  External APIs    │
    │   Business Logic     │   │  - Anthropic      │
    │   AI Orchestration   │   │  - Plaid          │
    │   Price Engine       │   │  - OCR Service    │
    └───────────┬──────────┘   └───────────────────┘
                │
    ┌───────────▼──────────┐
    │    Redis Cache       │
    │   Session/Prices     │
    └──────────────────────┘
```

### Frontend Architecture

- **Framework:** React 18 + TypeScript / React Native + Expo
- **Component Structure:**
  ```
  src/
  ├── app/                    # App routing (mobile)
  ├── pages/                  # Page components (web)
  ├── features/              # Feature modules
  │   ├── auth/             # Authentication
  │   ├── spaces/           # Space management
  │   ├── budgets/          # Budget features
  │   ├── expenses/         # Expense tracking
  │   ├── ai-chat/          # AI assistant
  │   └── dashboard/        # Analytics
  ├── shared/               # Shared components
  │   ├── components/       # UI components
  │   ├── hooks/           # Custom hooks
  │   └── utils/           # Utilities
  ├── services/            # API services
  ├── stores/              # Zustand stores
  └── types/               # TypeScript types
  ```
- **State Management:** TanStack Query (server) + Zustand (client)
- **Routing:** React Router (web) / Expo Router (mobile)
- **Build Optimization:** Vite (web) / Metro (mobile)

### Backend Architecture

- **Framework:** FastAPI + Python 3.11+
- **Folder Structure:**
  ```
  src/
  ├── api/
  │   ├── auth/           # Auth endpoints
  │   ├── spaces/         # Space endpoints
  │   ├── budgets/        # Budget endpoints
  │   ├── expenses/       # Expense endpoints
  │   ├── ai/            # AI chat endpoints
  │   └── prices/        # Price endpoints
  ├── models/            # SQLAlchemy models
  ├── schemas/           # Pydantic schemas
  ├── services/          # Business logic
  │   ├── ai_service.py
  │   ├── bank_service.py
  │   └── price_service.py
  ├── core/              # Core config
  │   ├── config.py
  │   ├── database.py
  │   └── security.py
  ├── utils/             # Helper functions
  └── main.py           # FastAPI app
  ```
- **API Design:** RESTful with OpenAPI docs
- **Authentication:** Supabase Auth (JWT)
- **Database ORM:** SQLAlchemy 2.0

### Database Design

- **Type:** PostgreSQL 15+ (Supabase hosted)
- **Main Tables:**
  - `users`: Extended auth.users from Supabase
  - `spaces`: Collaborative workspaces
  - `space_members`: User-space relationships
  - `budgets`: Monthly budget plans
  - `budget_items`: Budget line items
  - `expenses`: Transaction records
  - `expense_splits`: Split expense details
  - `products`: Product catalog
  - `product_prices`: Crowdsourced prices
  - `ai_conversations`: Chat history
  - `financial_insights`: AI-generated insights
- **Indexes:**
  - `space_id, month_period`: Budget queries
  - `user_id, created_at`: User activity
  - `location (PostGIS)`: Price geoqueries
  - `barcode`: Product lookups
- **Relationships:**
  - Users ↔ Spaces (M2M via space_members)
  - Spaces → Budgets → Budget Items
  - Expenses → Expense Splits
  - Products → Product Prices

## Technology Stack

### Frontend

```yaml
Framework: React 18 + TypeScript / React Native
Version: 18.2.0 / 0.72.0
UI Library: shadcn/ui (Radix + Tailwind) / NativeWind
State Management: TanStack Query + Zustand
HTTP Client: Supabase Client + Axios
Routing: React Router 6 / Expo Router
Forms: React Hook Form + Zod
Testing: Vitest + Testing Library / Jest
Build Tool: Vite 5 / Metro
PWA: Workbox + vite-plugin-pwa
```

### Backend

```yaml
Language: Python 3.11+
Runtime: Python with Uvicorn
Framework: FastAPI 0.110+
Database: PostgreSQL 15+ (Supabase)
ORM: SQLAlchemy 2.0
Authentication: Supabase Auth
File Storage: Supabase Storage
AI Service: Anthropic Claude API
Banking: Plaid API
Cache: Redis
Queue/Jobs: Celery + Redis
Validation: Pydantic V2
Testing: Pytest + HTTPx
API Docs: OpenAPI/Swagger (auto-generated)
```

### DevOps & Tools

```yaml
Version Control: Git/GitHub
CI/CD: GitHub Actions
Container: Docker (optional)
Hosting: Vercel (web) + Railway (API)
Mobile Build: EAS (Expo)
Monitoring: Sentry
Analytics: PostHog
Package Manager: pnpm (frontend) / pip+poetry (backend)
Linting: ESLint + Prettier / Black + Ruff
Type Checking: TypeScript / mypy
```

## Code Conventions

### Naming Conventions

```python
# Frontend (React/TypeScript)
Components: PascalCase.tsx (Button.tsx, UserCard.tsx)
Hooks: camelCase starting with 'use' (useAuth.ts)
Services: camelCase.service.ts (api.service.ts)
Types: PascalCase.types.ts (User.types.ts)
Utils: camelCase.ts (formatDate.ts)
Constants: UPPER_SNAKE_CASE (API_ENDPOINTS.ts)

# Backend (Python/FastAPI)
Models: PascalCase (class User, class Space)
Schemas: PascalCase + Schema (UserSchema)
Routes: snake_case (auth_router.py)
Services: snake_case (ai_service.py)
Utils: snake_case (date_helpers.py)
Constants: UPPER_SNAKE_CASE (MAX_RETRIES)
```

### Git Commit Format

```
type(scope): subject

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance
- perf: Performance improvement

Example:
feat(expenses): add receipt OCR scanning
fix(auth): resolve token refresh race condition
```

### API Response Format

```python
# Success Response
{
  "success": True,
  "data": {
    "id": "uuid",
    "attributes": {}
  },
  "meta": {
    "timestamp": "2025-10-03T10:00:00Z"
  }
}

# Error Response
{
  "success": False,
  "error": {
    "code": "BUDGET_EXCEEDED",
    "message": "Budget limit exceeded for category",
    "details": {"category": "food", "limit": 500}
  }
}
```

### Error Handling Pattern

```python
# Backend (FastAPI)
from fastapi import HTTPException

async def get_budget(budget_id: str):
    try:
        budget = await budget_service.get(budget_id)
        if not budget:
            raise HTTPException(404, "Budget not found")
        return {"success": True, "data": budget}
    except Exception as e:
        logger.error(f"Error fetching budget: {e}")
        raise HTTPException(500, "Internal server error")

# Frontend (React)
const fetchBudget = async (id: string) => {
  try {
    const { data } = await api.get(`/budgets/${id}`);
    return data;
  } catch (error) {
    console.error('Budget fetch failed:', error);
    toast.error('Failed to load budget');
    throw error;
  }
};
```

## Folder Structure

### Complete Project Structure

```
wallai/
├── apps/
│   ├── web/                    # React PWA
│   │   ├── src/
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   ├── mobile/                 # React Native
│   │   ├── app/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── app.json
│   │   └── package.json
│   │
│   └── backend/               # FastAPI
│       ├── src/
│       ├── tests/
│       ├── alembic/
│       ├── main.py
│       └── requirements.txt
│
├── database/                  # Database assets
│   ├── security/             # RLS policies
│   │   └── rls_policies.sql
│   ├── migrations/           # Schema migrations (future)
│   ├── seeds/               # Seed data (future)
│   └── README.md
│
├── templates/                 # HTML/Email templates
│   ├── email/               # Email templates
│   │   └── supabase_auth_templates.html
│   └── README.md
│
├── packages/                  # Shared packages (after week 6)
│   ├── types/                # TypeScript types
│   ├── ui/                   # Shared UI components
│   └── utils/                # Shared utilities
│
├── docs/                      # Documentation only
│   ├── PRD.md
│   ├── PLANNING.md
│   ├── TECHNICAL.md
│   └── API.md
│
├── .github/
│   └── workflows/
│       ├── web.yml
│       ├── mobile.yml
│       └── backend.yml
│
└── docker-compose.yml         # Local development
```

## Environment Configuration

### Backend Environment Variables (.env)

```bash
# Server
ENVIRONMENT=development
PORT=8000
CORS_ORIGINS=http://localhost:3000

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx
DATABASE_URL=postgresql://user:pass@host:5432/db

# AI Services
ANTHROPIC_API_KEY=xxx
OPENAI_API_KEY=xxx  # Backup

# Banking
PLAID_CLIENT_ID=xxx
PLAID_SECRET=xxx
PLAID_ENV=sandbox

# Redis
REDIS_URL=redis://localhost:6379

# File Storage
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_EXTENSIONS=jpg,jpeg,png,pdf

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
AI_RATE_LIMIT_PER_DAY=1000

# Security
SECRET_KEY=xxx
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
```

### Frontend Environment Variables

```typescript
// .env.local (web)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_API_URL=http://localhost:8000
VITE_POSTHOG_KEY=xxx

// .env (mobile)
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
EXPO_PUBLIC_API_URL=http://localhost:8000
```

## API Design Patterns

### RESTful Endpoints Structure

```
# Authentication (Supabase handled)
POST   /auth/signup           # User registration
POST   /auth/signin           # User login
POST   /auth/signout          # User logout
POST   /auth/refresh          # Token refresh

# Spaces
GET    /api/spaces            # List user's spaces
POST   /api/spaces            # Create space
GET    /api/spaces/:id        # Get space details
PATCH  /api/spaces/:id        # Update space
DELETE /api/spaces/:id        # Delete space
POST   /api/spaces/join       # Join space with code

# Budgets
GET    /api/spaces/:id/budgets        # List budgets
POST   /api/spaces/:id/budgets        # Create budget
GET    /api/budgets/:id               # Get budget
PATCH  /api/budgets/:id               # Update budget
DELETE /api/budgets/:id               # Delete budget
POST   /api/budgets/:id/replicate     # Copy to next month

# Expenses
GET    /api/spaces/:id/expenses       # List expenses
POST   /api/spaces/:id/expenses       # Create expense
GET    /api/expenses/:id              # Get expense
PATCH  /api/expenses/:id              # Update expense
DELETE /api/expenses/:id              # Delete expense
POST   /api/expenses/:id/split        # Split expense

# AI Chat
POST   /api/ai/chat                   # Send message
GET    /api/ai/conversations          # List conversations
GET    /api/ai/insights               # Get insights
POST   /api/ai/categorize             # Categorize expense

# Prices
GET    /api/products/search           # Search products
POST   /api/products/:id/prices       # Report price
GET    /api/products/:id/prices       # Get prices
GET    /api/prices/nearby             # Nearby prices
```

## Security Standards

### Authentication & Authorization

- Supabase Auth with JWT tokens
- Row Level Security (RLS) policies
- Multi-factor authentication (MFA)
- Session management with refresh tokens
- Role-based access control (RBAC)

### Data Protection

- Input validation with Pydantic
- SQL injection prevention (parameterized queries)
- XSS protection (React's built-in)
- CSRF protection (SameSite cookies)
- Rate limiting per endpoint
- File upload validation

### Security Headers

```python
# FastAPI security headers
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://wallai.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["wallai.app", "*.wallai.app"]
)
```

## Performance Optimization

### Backend Optimization

- Database connection pooling
- Query optimization with indexes
- Redis caching for hot data
- Pagination (limit/offset)
- Async operations with FastAPI
- Background tasks with Celery
- CDN for static assets

### Frontend Optimization

- Code splitting with React.lazy
- Image optimization (WebP, lazy loading)
- Bundle optimization (tree shaking)
- Service Worker caching
- Virtual scrolling for lists
- Debounced API calls
- Optimistic UI updates

### Monitoring Metrics

- API response time < 200ms (p95)
- Page load time < 2s
- Time to interactive < 3s
- Error rate < 0.1%
- Uptime > 99.9%
- AI response time < 3s

## Testing Strategy

### Unit Testing

```yaml
# Coverage targets
Statements: > 80%
Branches: > 75%
Functions: > 80%
Lines: > 80%

# Focus areas
- Business logic services
- Data transformations
- Utility functions
- API validators
```

### Integration Testing

- API endpoint testing with pytest
- Database operations with test fixtures
- External API mocking (Anthropic, Plaid)
- Authentication flow testing

### E2E Testing

- Critical user journeys (5-8 tests)
- Expense creation flow
- Budget management
- AI chat interaction
- Cross-platform testing

### Testing Tools

```yaml
Frontend: Vitest, Testing Library, MSW
Backend: Pytest, HTTPx, Factory Boy
E2E: Playwright (web), Detox (mobile)
Performance: Locust, Lighthouse
```

## Deployment Architecture

### Development Environment

- Local Supabase instance
- Docker Compose setup
- Hot reload enabled
- Mock external APIs
- Seed data scripts

### Staging Environment

- Supabase project (staging)
- Railway/Render hosting
- Feature flags enabled
- Production-like data
- Sentry integration

### Production Environment

- Supabase (production tier)
- Vercel (web frontend)
- Railway (FastAPI backend)
- EAS Build (mobile apps)
- CloudFlare CDN/WAF
- Auto-scaling enabled

### CI/CD Pipeline

```yaml
# GitHub Actions workflow
1. Trigger on PR/push to main
2. Run linting (ESLint, Black)
3. Run type checking (TypeScript, mypy)
4. Run unit tests
5. Run integration tests
6. Build applications
7. Run E2E tests (critical paths)
8. Deploy to staging (auto)
9. Smoke tests on staging
10. Deploy to production (manual approval)
11. Monitor error rates post-deploy
```

## Scaling Strategy

### Phase 1: MVP (0-1K users)

- Single FastAPI instance
- Supabase free tier
- Basic Redis cache
- Manual monitoring

### Phase 2: Growth (1K-10K users)

- Load balanced API (2-3 instances)
- Supabase Pro tier
- Redis cluster
- Auto-scaling rules
- APM monitoring

### Phase 3: Scale (10K+ users)

- Microservices architecture
- Read replicas
- Global CDN
- Multi-region deployment
- Dedicated AI infrastructure

### Caching Strategy

- Session data: Redis (15 min TTL)
- User preferences: Redis (1 hour TTL)
- Price data: Redis (5 min TTL)
- AI responses: Redis (1 hour TTL)
- Static assets: CDN (1 year TTL)

---

**Document Status:**

- Created: October 2025
- Last Updated: October 2025
- Version: 1.0
- Maintained by: Wallai Engineering Team
