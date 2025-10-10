# Wallai - AI-Powered Personal Finance Platform 🚀

venv\Scripts\activate
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

> Your intelligent financial assistant powered by Anthropic Claude

[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-blueviolet)](https://turbo.build)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-green)](https://fastapi.tiangolo.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase-success)](https://supabase.com)

## 🏗️ Monorepo Structure

This is a Turborepo monorepo containing all Wallai applications and packages.

```
wallai/
├── apps/
│   ├── api/           # FastAPI Backend (Python 3.11+)
│   └── wallai-web/    # React Web App (Vite + TypeScript)
├── packages/          # Shared packages (future)
│   ├── ui/           # Shared UI components
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared configs
├── database/          # Database migrations & schemas
├── docs/              # Project documentation
└── templates/         # Email & other templates
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Python** 3.11+
- **Supabase** account (or PostgreSQL)
- **Redis** (optional, for caching)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/PDAC95/12w.git
cd 12w
```

2. **Install dependencies**

```bash
# Install root dependencies (Turborepo)
npm install

# Install web dependencies
cd apps/wallai-web && npm install && cd ../..

# Install Python dependencies
cd apps/api && python -m venv venv && source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

3. **Set up environment variables**

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# - Supabase URL and keys
# - Anthropic API key
# - Database credentials
```

4. **Run development servers**

```bash
# Run everything (Web + API)
npm run dev

# Or run individually
npm run web:dev   # Frontend only (port 3000)
npm run api:dev   # Backend only (port 8000)
```

## 🎬 Starting the Application Step-by-Step

### Option 1: Run Everything at Once (Recommended)

```bash
# From the root directory
npm run dev
```

This will start both frontend (port 3000) and backend (port 8000) simultaneously using Turborepo.

### Option 2: Run Frontend and Backend Separately

#### Starting the Frontend (React + Vite)

1. **Open a terminal** and navigate to the web app directory:

   ```bash
   cd apps/wallai-web
   ```

2. **Install dependencies** (if not done already):

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Access the app**:
   - Open your browser at: `http://localhost:3000`
   - Hot reload is enabled - changes reflect automatically

5. **Available pages**:
   - `/` - Landing page
   - `/register` - User registration
   - `/login` - User login
   - `/dashboard` - Dashboard (requires authentication)

#### Starting the Backend (FastAPI)

1. **Open a NEW terminal** and navigate to the API directory:

   ```bash
   cd apps/api
   ```

2. **Activate the Python virtual environment**:

   **Windows:**

   ```bash
   venv\Scripts\activate
   ```

   **Linux/Mac:**

   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies** (if not done already):

   ```bash
   pip install -r requirements.txt
   ```

4. **Verify environment variables**:
   - Check that `.env` file exists in `apps/api/` directory
   - Or copy from root: `cp ../../.env .env`

5. **Start the FastAPI server**:

   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access the API**:
   - API Root: `http://localhost:8000`
   - Swagger Docs: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`
   - Health Check: `http://localhost:8000/health`

### Option 3: Using Turborepo Commands from Root

```bash
# Frontend only
npm run web:dev

# Backend only
npm run api:dev

# Both at the same time
npm run dev
```

### Troubleshooting Startup Issues

#### Port Already in Use

**Frontend (3000):**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Backend (8000):**

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

#### Environment Variables Not Loaded

```bash
# Make sure .env exists in root and apps/api/
ls -la .env
ls -la apps/api/.env

# Copy if missing
cp .env apps/api/.env
```

#### Python Virtual Environment Issues

```bash
# Delete and recreate venv
cd apps/api
rm -rf venv  # or rmdir /s venv on Windows
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

#### Supabase Connection Errors

1. Check `.env` has correct Supabase credentials
2. Verify Supabase project is running
3. Test connection at: `http://localhost:8000/health`

## 📦 Available Scripts

### Root Level (Turborepo)

```bash
npm run dev          # Run all apps in development mode
npm run build        # Build all apps for production
npm run test         # Run tests across all apps
npm run lint         # Lint all apps
npm run format       # Format code with Prettier
npm run clean        # Clean all node_modules and build artifacts
```

### Individual Apps

```bash
npm run web:dev      # Run web app only
npm run web:build    # Build web app
npm run api:dev      # Run API server only
npm run api:build    # Validate Python backend
```

## 🗃️ Database Setup

Follow the complete guide in `docs/SUPABASE_SETUP.md`

**Quick setup:**

1. Create Supabase project
2. Run migrations in order:
   - `database/migrations/001_initial_schema.sql`
   - `database/migrations/002_auth_triggers.sql`
   - `database/security/rls_policies.sql`
3. Update `.env` with Supabase credentials

## 🏗️ Tech Stack

### Frontend (wallai-web)

- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router v7
- **State:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod
- **Auth:** Supabase Auth

### Backend (api)

- **Framework:** FastAPI
- **Language:** Python 3.11+
- **Database:** PostgreSQL (Supabase)
- **ORM:** SQLAlchemy 2.0
- **Auth:** Supabase (JWT)
- **AI:** Anthropic Claude API
- **Cache:** Redis (optional)

### Database

- **Primary:** PostgreSQL 15+ (Supabase)
- **Migrations:** SQL scripts
- **Security:** Row Level Security (RLS)
- **Storage:** Supabase Storage (receipts, avatars)

## 📚 Documentation

- **[PRD](docs/PRD.md)** - Product Requirements
- **[Planning](docs/Planning.md)** - Technical Architecture
- **[Tasks](docs/Tasks.md)** - Sprint Planning & User Stories
- **[Progress](docs/Progress.md)** - Development Progress
- **[Supabase Setup](docs/SUPABASE_SETUP.md)** - Database Configuration
- **[Design System](docs/Dessign.md)** - UI/UX Guidelines
- **[Claude Framework](docs/Claude.md)** - Development Rules

## 🎯 Project Status

- **Sprint:** Sprint 1 - Foundation & Setup
- **Progress:** 28% (5/18 tasks completed)
- **Story Points:** 18/89 (20%)
- **Target MVP:** 2025-11-28 (8 weeks)

### Completed ✅

- ✅ Project documentation suite
- ✅ Supabase configuration
- ✅ Frontend React setup (Vite + TypeScript)
- ✅ Backend FastAPI setup
- ✅ Database schema with RLS policies
- ✅ User registration with modern UI

### In Progress 🚧

- 🚧 User login system
- 🚧 Protected routes
- 🚧 Dashboard MVP

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Run tests: `npm run test`
4. Format code: `npm run format`
5. Create Pull Request

See full guidelines in `docs/Github.md`

## 📄 License

MIT License - see LICENSE for details

## 🛟 Support

- **Documentation:** `/docs`
- **Issues:** [GitHub Issues](https://github.com/PDAC95/12w/issues)
- **Email:** dev@jappi.ca

---

**Built with ❤️ using Turborepo, React, FastAPI, and Supabase**

🤖 **AI-Powered Development** with [Claude Code](https://claude.com/claude-code)
