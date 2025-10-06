# GITHUB.md - Wallai Version Control & CI/CD Guide

## Repository Structure

- **Backend Repository:** github.com/PDAC95/wbackend
- **Web Repository:** github.com/PDAC95/wweb
- **Mobile Repository:** github.com/PDAC95/wmobile
- **Owner:** PDAC95
- **Visibility:** Private
- **Tech Stack:**
  - Backend: FastAPI + Python 3.11
  - Web: React 18 + TypeScript + Vite
  - Mobile: React Native + Expo
  - Database: PostgreSQL (Supabase)
- **Deployment Platforms:**
  - Backend: Railway
  - Web: Vercel
  - Mobile: EAS (Expo Application Services)
- **Team Size:** Small team (2-5 developers)

---

## Repository Setup

### Initial Configuration for Each Repository

```bash
# Backend Repository (wbackend)
cd C:\dev\wallai\wbackend
git init
git remote add origin https://github.com/PDAC95/wbackend.git
git branch -M main
echo "# Wallai Backend" >> README.md
git add .
git commit -m "chore: initial backend setup"
git push -u origin main

# Web Repository (wweb)
cd C:\dev\wallai\wweb
git init
git remote add origin https://github.com/PDAC95/wweb.git
git branch -M main
echo "# Wallai Web" >> README.md
git add .
git commit -m "chore: initial web setup"
git push -u origin main

# Mobile Repository (wmobile)
cd C:\dev\wallai\wmobile
git init
git remote add origin https://github.com/PDAC95/wmobile.git
git branch -M main
echo "# Wallai Mobile" >> README.md
git add .
git commit -m "chore: initial mobile setup"
git push -u origin main
```

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

### Backend .gitignore (wbackend)

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

### Backend CI/CD (.github/workflows/backend-ci.yml)

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

**Last Updated:** 2025-10-03
**Version:** 1.0.0
**Maintained by:** Wallai Development Team
```
