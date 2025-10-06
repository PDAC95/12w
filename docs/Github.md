# GITHUB.md - Wallai Version Control & CI/CD Guide

## 🎯 Current Status: Turborepo Monorepo Architecture

> **Configured:** 2025-10-06
> **Repository:** https://github.com/PDAC95/12w
> **Branch:** main
> **Architecture:** Turborepo v2.5.8 + npm workspaces

---

## 📦 Repository Structure (Turborepo Monorepo)

### Quick Info

| Property | Value |
|----------|-------|
| **Repository** | https://github.com/PDAC95/12w |
| **Owner** | PDAC95 |
| **Visibility** | Private |
| **Architecture** | Turborepo monorepo with npm workspaces |
| **Build Tool** | Turborepo v2.5.8 |
| **Team Size** | Small team (2-5 developers) |

### Monorepo Structure

```
12w/                              ← Root monorepo
├── apps/                         ← Applications
│   ├── api/                      ← FastAPI Backend (Python 3.11+)
│   │   ├── src/
│   │   ├── tests/
│   │   ├── requirements.txt
│   │   ├── package.json         ← npm wrapper for Turborepo
│   │   └── venv/
│   └── wallai-web/              ← React Web App (Vite + TypeScript)
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── node_modules/
├── packages/                     ← Shared packages (future)
│   ├── ui/                      ← Shared UI components
│   ├── types/                   ← Shared TypeScript types
│   ├── config/                  ← Shared configs (ESLint, TS, etc.)
│   └── utils/                   ← Shared utilities
├── database/                     ← Database migrations & schemas
│   ├── migrations/              ← SQL migration files
│   └── security/                ← RLS policies
├── docs/                         ← Project documentation
│   ├── PRD.md
│   ├── Planning.md
│   ├── Tasks.md
│   ├── Progress.md
│   ├── Github.md               ← This file
│   └── ...
├── templates/                    ← Email & other templates
├── .gitignore                   ← Unified ignore rules
├── package.json                 ← Root workspace configuration
├── turbo.json                   ← Turborepo pipeline config
├── README.md                    ← Monorepo documentation
└── .env                         ← Environment variables
```

### Workspaces Configuration

The monorepo uses **npm workspaces** with Turborepo for task orchestration:

**Root `package.json`:**
```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

**Current Workspaces:**
1. `wallai-web` - React frontend (apps/wallai-web)
2. `wallai-api` - FastAPI backend (apps/api)

**Future Workspaces:**
- `packages/ui` - Shared UI components
- `packages/types` - Shared TypeScript types
- `packages/config` - Shared configuration
- `apps/mobile` - React Native app (Sprint 4)

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React + TypeScript | 18.x |
| **Build Tool** | Vite | 7.x |
| **Backend** | FastAPI | 0.100+ |
| **Language** | Python | 3.11+ |
| **Database** | PostgreSQL (Supabase) | 15+ |
| **Monorepo** | Turborepo | 2.5.8 |
| **Package Manager** | npm | 10.2.4 |
| **Mobile** | React Native + Expo | (Sprint 4) |

### Deployment Platforms

| App | Platform | URL |
|-----|----------|-----|
| **Web** | Vercel | TBD |
| **Backend** | Railway | TBD |
| **Mobile** | EAS (Expo) | Sprint 4 |
| **Database** | Supabase | Configured |

---

## ⚡ Available Commands

### Root Level (Turborepo)

All these commands run from the **root directory** (`C:\dev\12w`):

```bash
# Development
npm run dev          # 🚀 Run all apps (web + api) in dev mode
npm run web:dev      # 🌐 Run web app only (port 3000)
npm run api:dev      # 🔧 Run API only (port 8000)

# Build & Production
npm run build        # 📦 Build all apps for production
npm run web:build    # 📦 Build web app only
npm run api:build    # ✅ Validate Python backend

# Testing & Quality
npm run test         # ✅ Run tests across all apps
npm run lint         # 🔍 Lint all apps
npm run format       # 💅 Format code with Prettier

# Utilities
npm run clean        # 🧹 Clean all node_modules and build artifacts
```

### How Turborepo Works

When you run `npm run dev`, Turborepo:

1. **Reads** `turbo.json` pipeline configuration
2. **Detects** which apps need to run
3. **Executes** tasks in parallel (when possible)
4. **Caches** results for faster subsequent runs
5. **Streams** output from all apps to your terminal

Example output:
```bash
$ npm run dev

• Packages in scope: wallai-api, wallai-web
• Running dev in 2 packages
• Remote caching disabled

wallai-web:dev: > vite
wallai-api:dev: > uvicorn src.main:app --reload

wallai-web:dev:   VITE v7.1.7  ready in 324 ms
wallai-web:dev:   ➜  Local:   http://localhost:3000/
wallai-api:dev:   INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## 🚀 Why Monorepo? (vs Multi-repo)

### ✅ Benefits of Monorepo for Wallai

| Benefit | Description |
|---------|-------------|
| **Code Sharing** | Share types, utils, and components between apps |
| **Unified Versioning** | All apps use same React, TypeScript versions |
| **Atomic Changes** | Update frontend + backend in single commit |
| **Simplified CI/CD** | One pipeline tests/deploys everything |
| **Developer Experience** | Clone once, run everything |
| **Turborepo Caching** | Builds are cached, subsequent runs are instant |
| **Parallel Execution** | Tasks run concurrently (faster builds) |
| **Single Source of Truth** | One repo to manage, not 3 |

### ❌ Multi-repo Drawbacks (Why We Avoided It)

- **3 repos to clone** (wbackend, wweb, wmobile)
- **3 CI/CD pipelines** to maintain
- **Version drift** (React 18.1 in web, 18.0 in mobile)
- **Code duplication** (types defined in 3 places)
- **Sync overhead** (coordinate releases across repos)
- **Complex onboarding** (new devs clone 3 repos)

### 📊 Decision Matrix

| Criteria | Monorepo | Multi-repo | Winner |
|----------|----------|------------|---------|
| Code sharing | ✅ Easy | ❌ Difficult | Monorepo |
| Setup time | ✅ 5 min | ❌ 15 min | Monorepo |
| CI/CD complexity | ✅ Simple | ❌ Complex | Monorepo |
| Build speed | ✅ Fast (cache) | ⚠️ Slower | Monorepo |
| Team size | ✅ Small (2-5) | ✅ Large (20+) | Monorepo |
| Independent releases | ❌ Harder | ✅ Easy | Multi-repo |
| Our choice | ✅ Selected | ❌ Not used | **Monorepo** |

**Conclusion:** Monorepo is the right choice for Wallai (small team, shared code, rapid iteration).

---

## Repository Setup

### Initial Configuration (Monorepo)

```bash
# Clone monorepo
git clone https://github.com/PDAC95/12w.git
cd 12w

# Install root dependencies (Turborepo)
npm install

# Install web app dependencies
cd apps/wallai-web
npm install
cd ../..

# Install Python backend dependencies
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development servers
npm run dev  # Runs both web and api
```

### Repository Already Configured ✅

- Remote: https://github.com/PDAC95/12w.git
- Branch: main
- Turborepo: Configured with npm workspaces
- Workspaces: apps/api, apps/wallai-web

### Branch Structure (All Repositories)

```
main (production)
  ├── develop (staging)
  │   ├── feature/auth-system
  │   ├── feature/space-management
  │   ├── feature/ai-integration
  │   ├── bugfix/expense-calculation
  │   ├── bugfix/rls-policies
  │   └── chore/update-dependencies
  └── hotfix/critical-security-fix
```

---

## Git Configuration Files

### Root .gitignore (Already Configured ✅)

The monorepo has a unified `.gitignore` at the root that covers all workspaces.

### Legacy: Backend .gitignore (for reference only)

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
.venv
pip-log.txt
pip-delete-this-directory.txt
.pytest_cache/
.coverage
htmlcov/
.tox/
*.egg-info/
dist/
build/

# FastAPI
*.db
*.sqlite3
instance/
.webassets-cache

# Environment
.env
.env.local
.env.*.local
*.env

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
logs/
*.log

# Testing
coverage.xml
*.cover
.hypothesis/

# Database
*.db
*.sqlite
migrations/versions/*

# Uploads
uploads/
media/
static/collected/
```

### Web .gitignore (wweb)

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
build/
.next/
out/

# Testing
coverage/
.nyc_output

# Environment
.env
.env.local
.env.*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Vite
dist-ssr
*.local

# TypeScript
*.tsbuildinfo

# PWA
public/sw.js
public/workbox-*.js
```

### Mobile .gitignore (wmobile)

```gitignore
# Expo
.expo/
dist/
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# Dependencies
node_modules/

# Environment
.env
.env.local
.env.*.local

# macOS
.DS_Store
*.pem

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# IDEs
.vscode/
.idea/

# Testing
coverage/

# Temporary files
*.log
.cache/
```

### .gitattributes (All Repositories)

```gitattributes
# Auto detect text files and perform LF normalization
* text=auto eol=lf

# JS/TS
*.js text
*.jsx text
*.ts text
*.tsx text
*.json text

# Python
*.py text
*.pyw text
*.pyx text
*.pyi text

# Web
*.html text
*.css text
*.scss text
*.sass text

# Config
*.yml text
*.yaml text
*.toml text
*.ini text
*.cfg text

# Documentation
*.md text
*.txt text
README text
LICENSE text

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.pdf binary
*.woff binary
*.woff2 binary
```

---

## Commit Conventions

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Code formatting (no logic change)
- **refactor**: Code restructuring
- **perf**: Performance improvement
- **test**: Adding tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature commits
feat(auth): implement Supabase authentication
feat(expenses): add AI categorization service
feat(spaces): create invitation system with 6-char codes

# Bug fixes
fix(rls): correct space member access policies
fix(ai): handle Anthropic rate limiting with retry logic
fix(pwa): resolve service worker update issues

# Documentation
docs(api): update endpoint documentation for expenses
docs(readme): add installation instructions

# Chores
chore(deps): update React to v18.2.0
chore(ci): configure GitHub Actions for deployment
```

---

## GitHub Actions Workflows

### Monorepo CI/CD (.github/workflows/ci.yml)

**Note:** For monorepo, we use a single workflow that tests all apps using Turborepo's caching and task orchestration.

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: "18"

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint all apps
        run: npm run lint

      - name: Build all apps
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Run tests
        run: npm run test

  deploy-web-production:
    needs: test-and-build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./apps/wallai-web
          vercel-args: "--prod"

  deploy-api-production:
    needs: test-and-build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          cd apps/api
          railway up --service wallai-api
```

### Legacy: Backend CI/CD (.github/workflows/backend-ci.yml - for reference)

```yaml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  PYTHON_VERSION: "3.11"

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: wallai_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Cache pip packages
        uses: actions/cache@v3
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest pytest-cov black ruff

      - name: Lint with Ruff
        run: ruff check .

      - name: Format check with Black
        run: black --check .

      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/wallai_test
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          pytest --cov=src --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway Staging
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN_STAGING }}
        run: |
          npm install -g @railway/cli
          railway up --service backend-staging

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway Production
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN_PRODUCTION }}
        run: |
          npm install -g @railway/cli
          railway up --service backend-production
```

### Web CI/CD (.github/workflows/web-ci.yml)

```yaml
name: Web CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: "18"
  PNPM_VERSION: "8"

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm tsc --noEmit

      - name: Test
        run: pnpm test:ci

      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: pnpm build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy-preview:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
          working-directory: ./
```

### Mobile CI/CD (.github/workflows/mobile-ci.yml)

```yaml
name: Mobile CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test -- --coverage

      - name: Type check
        run: npm run type-check

  build-preview:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - uses: actions/checkout@v3

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build preview
        run: eas build --platform all --profile preview --non-interactive

  build-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build production
        run: eas build --platform all --profile production --non-interactive
```

### Dependabot Configuration (.github/dependabot.yml)

```yaml
version: 2
updates:
  # Backend dependencies
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    reviewers:
      - "PDAC95"

  # Frontend dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    reviewers:
      - "PDAC95"
    ignore:
      # Ignore major version updates for critical packages
      - dependency-name: "react"
        update-types: ["version-update:semver-major"]
      - dependency-name: "react-native"
        update-types: ["version-update:semver-major"]

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

## Repository Secrets

### Backend Secrets (wbackend)

```yaml
# Supabase
SUPABASE_URL: https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY: eyJhbGciOiJIUzI1NiIs...

# AI Services
ANTHROPIC_API_KEY: sk-ant-xxxxx

# Banking (Future)
PLAID_CLIENT_ID: xxxxx
PLAID_SECRET: xxxxx

# Deployment
RAILWAY_TOKEN_STAGING: xxxxx
RAILWAY_TOKEN_PRODUCTION: xxxxx

# Monitoring
SENTRY_DSN: https://xxxxx@sentry.io/xxxxx
```

### Web Secrets (wweb)

```yaml
# Supabase (Public)
VITE_SUPABASE_URL: https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIs...

# Deployment
VERCEL_TOKEN: xxxxx
VERCEL_ORG_ID: xxxxx
VERCEL_PROJECT_ID: xxxxx

# Analytics
VITE_POSTHOG_KEY: xxxxx
```

### Mobile Secrets (wmobile)

```yaml
# Expo
EXPO_TOKEN: xxxxx

# Supabase
EXPO_PUBLIC_SUPABASE_URL: https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIs...

# App Store (Future)
APP_STORE_CONNECT_API_KEY: xxxxx
GOOGLE_PLAY_SERVICE_ACCOUNT: xxxxx
```

---

## Development Workflow

### Daily Workflow

```bash
# 1. Start your day - sync with latest
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/expense-charts

# 3. Make changes and commit regularly
git add .
git commit -m "feat(dashboard): add expense pie chart"

# 4. Push your branch
git push origin feature/expense-charts

# 5. Create Pull Request via GitHub UI
# Go to repository → Pull requests → New pull request

# 6. After PR approval and merge
git checkout develop
git pull origin develop
git branch -d feature/expense-charts
```

### Pull Request Template (.github/pull_request_template.md)

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change)
- [ ] ✨ New feature (non-breaking change)
- [ ] 💥 Breaking change (fix or feature with breaking changes)
- [ ] 📝 Documentation update
- [ ] 🧹 Code refactor
- [ ] 🎨 Style update

## Testing

- [ ] Unit tests pass locally
- [ ] Integration tests pass
- [ ] Tested on mobile devices (if applicable)
- [ ] Tested in different browsers (if web)

## Checklist

- [ ] My code follows the project style guidelines
- [ ] I have performed a self-review
- [ ] I have commented complex code sections
- [ ] I have updated documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged

## Screenshots (if applicable)

Add screenshots here for UI changes.

## Related Issues

Closes #(issue number)
```

### Bug Report Template (.github/ISSUE_TEMPLATE/bug_report.yml)

```yaml
name: Bug Report
description: Report a bug in Wallai
title: "[BUG] "
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for reporting a bug! Please fill out the sections below.

  - type: dropdown
    id: repository
    attributes:
      label: Which repository?
      options:
        - wbackend
        - wweb
        - wmobile
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: A clear description of the bug
    validations:
      required: true

  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: Steps to reproduce the behavior
      value: |
        1. Go to '...'
        2. Click on '...'
        3. See error
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What you expected to happen
    validations:
      required: true
```

---

## Branch Protection Rules

### Main Branch

- **Require pull request reviews:** 1 review required
- **Dismiss stale reviews:** Yes
- **Require status checks:**
  - CI/CD tests must pass
  - Build must succeed
- **Require branches to be up to date:** Yes
- **Include administrators:** No
- **Restrict push access:** Only maintainers

### Develop Branch

- **Require pull request reviews:** 1 review required
- **Require status checks:**
  - Linting must pass
  - Tests must pass
- **Allow force pushes:** No
- **Allow deletions:** No

---

## Release Strategy

### Versioning (Semantic Versioning)

- **MAJOR.MINOR.PATCH** (e.g., 1.2.3)
- **MAJOR:** Breaking changes
- **MINOR:** New features (backwards compatible)
- **PATCH:** Bug fixes

### Example Progression

```
1.0.0 - Initial release
1.0.1 - Fix login bug
1.1.0 - Add expense categories
1.1.1 - Fix category display
2.0.0 - New AI integration (breaking API changes)
```

### Release Process

1. Ensure all features for release are merged to `develop`
2. Create release branch: `git checkout -b release/1.1.0`
3. Update version numbers in package.json/pyproject.toml
4. Update CHANGELOG.md
5. Create PR from release branch to `main`
6. After approval, merge to `main`
7. Tag release: `git tag -a v1.1.0 -m "Release version 1.1.0"`
8. Push tag: `git push origin v1.1.0`
9. Create GitHub Release with changelog

---

## Monitoring & Alerts

### Error Tracking

- **Sentry Integration:** All repositories
- **Alert channels:** Email + Slack
- **Error rate threshold:** >1% triggers alert

### CI/CD Notifications

- **Success:** Green checkmark in PR
- **Failure:** Red X with details
- **Deployment:** Slack notification

### Dependency Alerts

- **Dependabot:** Weekly PR creation
- **Security alerts:** Immediate notification
- **Auto-merge:** Patch updates only

---

## README.md Template (Example for wbackend)

````markdown
# Wallai Backend

AI-powered personal finance management API built with FastAPI and Supabase.

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL (or Supabase account)
- Redis (for caching)

### Installation

1. Clone the repository

```bash
git clone https://github.com/PDAC95/wbackend.git
cd wbackend
```
````

2. Create virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your credentials
```

5. Run the server

```bash
uvicorn main:app --reload
```

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs)
- [Project Wiki](https://github.com/PDAC95/wbackend/wiki)
- [Contributing Guide](CONTRIBUTING.md)

## 🛠️ Tech Stack

- **Framework:** FastAPI
- **Database:** PostgreSQL (Supabase)
- **Cache:** Redis
- **AI:** Anthropic Claude
- **Authentication:** Supabase Auth

## 🗺️ Roadmap

- [x] Authentication system
- [x] Space management
- [ ] Budget system
- [ ] AI integration
- [ ] Banking connections

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

```

---

## 📌 Document Information

**Last Updated:** 2025-10-06
**Version:** 2.0.0 (Monorepo Edition)
**Architecture:** Turborepo Monorepo
**Repository:** https://github.com/PDAC95/12w
**Branch:** main
**Maintained by:** Wallai Development Team

### Changelog

- **v2.0.0 (2025-10-06):** Migrated to Turborepo monorepo architecture
- **v1.0.0 (2025-10-03):** Initial multi-repo documentation (deprecated)

---

**For questions about monorepo setup, see the top of this document.**
```
