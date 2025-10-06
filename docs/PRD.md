# Product Requirements Document (PRD)

## Wallai - Asistente Financiero Personal con IA

**Version:** 1.0  
**Date:** Octubre 2025  
**Author:** Wallai Product Team  
**Status:** Active Development

---

## Executive Summary

Wallai es una aplicación de gestión financiera personal impulsada por inteligencia artificial que transforma la manera en que las personas, parejas y grupos manejan sus finanzas. A través de un asistente conversacional basado en Anthropic Claude, Wallai ofrece asesoría financiera personalizada, análisis predictivo y recomendaciones proactivas en tiempo real.

El producto resuelve la complejidad de la gestión financiera moderna, donde los usuarios luchan con múltiples cuentas bancarias, gastos compartidos, presupuestos desorganizados y la falta de visibilidad sobre sus patrones de gasto. Wallai se diferencia por su capacidad de entender preguntas financieras complejas en lenguaje natural y proporcionar respuestas contextualizadas basadas en el historial financiero del usuario.

El mercado objetivo incluye millennials y Gen Z en Estados Unidos y Canadá, con un enfoque particular en parejas jóvenes, roommates y familias que buscan una solución colaborativa para gestionar finanzas compartidas. El 68% de las parejas reportan que el dinero es una fuente principal de estrés en sus relaciones, y Wallai aborda directamente este problema.

La característica diferenciadora clave es la combinación de IA conversacional con un sistema de inteligencia de precios comunitario similar a Waze, donde los usuarios contribuyen y se benefician de información de precios en tiempo real. Esto, junto con espacios colaborativos para gestión multi-usuario, posiciona a Wallai como una solución única en el mercado.

Actualmente en fase de desarrollo activo, Wallai apunta a capturar 10,000 usuarios activos mensuales en el primer año, con un modelo de negocio SaaS que incluye un tier gratuito y suscripciones desde $9.99/mes, proyectando un ARR de $200k para el final del año 1.

## Problem Statement

### Identified Problems

- **Problem 1: Gestión Manual Ineficiente**  
  Los usuarios pasan 2-3 horas mensuales actualizando spreadsheets de Excel para rastrear gastos compartidos, con alta probabilidad de errores y falta de sincronización entre múltiples usuarios.

- **Problem 2: Falta de Inteligencia Financiera**  
  Las apps existentes solo registran transacciones sin proporcionar insights accionables, predicciones o recomendaciones personalizadas basadas en patrones de comportamiento.

- **Problem 3: Ausencia de Colaboración Real**  
  No existe una solución efectiva para parejas y grupos que necesitan transparencia total, división justa de gastos y aprobaciones multi-usuario para decisiones financieras importantes.

### Problem Impact

- El hogar promedio pierde $1,200 anuales debido a mal tracking de gastos y presupuestos no cumplidos
- 73% de los adultos reportan estrés financiero como su principal fuente de ansiedad
- Las parejas gastan 5+ horas mensuales discutiendo sobre finanzas sin datos claros
- 45% de los roommates tienen conflictos por gastos compartidos mal documentados

## Target Users

### Primary User: Parejas Jóvenes (25-35 años)

**Profile:** Dual income, viviendo juntos, tech-savvy, $80-150k ingreso combinado

- **Needs:** Visibilidad clara de gastos compartidos, división justa, automatización
- **Frustrations:** Excel manual, no saber quién pagó qué, calcular balances mensuales
- **Technology:** Apps móviles diarias, preferencia por soluciones integradas
- **Behavior:** Revisan finanzas semanalmente, pagan bills mensualmente, buscan transparencia

### Secondary User: Individuos Conscientes (22-40 años)

**Profile:** Profesionales, estudiantes, freelancers buscando control financiero

- **Needs:** Tracking simple, categorización automática, insights de ahorro
- **Frustrations:** Apps complicadas, suscripciones caras, falta de predicciones
- **Technology:** Mobile-first, buscan eficiencia y simplicidad
- **Behavior:** Entrada rápida de gastos, revisión mensual, metas de ahorro

### Tertiary User: Grupos/Roommates (20-30 años)

**Profile:** 2-4 personas compartiendo vivienda, gastos comunes

- **Needs:** División transparente, tracking de deudas, liquidación fácil
- **Frustrations:** Perseguir pagos, cálculos manuales, falta de historial
- **Technology:** Familiarizados con apps de pago (Venmo, Zelle)
- **Behavior:** Gastos frecuentes compartidos, liquidación mensual

## User Stories

### Gestión de Espacios y Colaboración

1. **As a new user**, I want to create a shared space with my partner so that we can manage household finances together
2. **As a space member**, I want to invite my roommates via a simple code so that they can join without friction
3. **As a space owner**, I want to set permissions for members so that I control who can modify budgets
4. **As a user**, I want to switch between personal and shared spaces so that I keep finances separate

### Presupuestos y Planificación

5. **As a user**, I want to set monthly budgets by category so that I can control spending
6. **As a user**, I want budgets to auto-replicate each month so that I don't recreate them
7. **As a couple**, we want to assign budget responsibilities so that we know who manages what
8. **As a user**, I want to choose financial frameworks (50/30/20) so that I follow proven methods

### Tracking de Gastos e IA

9. **As a user**, I want to ask my expenses in natural language so that I get instant answers
10. **As a user**, I want automatic categorization so that I don't manually classify each expense
11. **As a user**, I want to scan receipts with my camera so that I quickly log expenses
12. **As a user**, I want predictive alerts so that I avoid overspending

### División de Gastos

13. **As roommates**, we want to split expenses equally so that everyone pays fairly
14. **As a couple**, we want to split by income percentage so that it's proportional
15. **As users**, we want to track who owes whom so that we settle debts easily
16. **As a user**, I want expense approval workflows so that large purchases need consensus

### Inteligencia de Precios Comunitaria

17. **As a shopper**, I want to scan barcodes so that I see price comparisons
18. **As a user**, I want to contribute prices so that I help the community
19. **As a user**, I want price drop alerts so that I buy at the best time
20. **As a user**, I want shopping list optimization so that I know where to buy each item

## Functional Requirements

### Authentication & User Management

- Email/password registration with verification
- OAuth login (Google, Apple)
- Multi-factor authentication optional
- Profile management with preferences
- Password reset functionality
- Session management across devices

### Space Management

- Create up to 10 spaces per user (free tier: 1)
- Generate 6-character alphanumeric invite codes
- Role-based permissions (owner, admin, member, viewer)
- Maximum 10 members per space (configurable by tier)
- Space settings and customization
- Leave/delete space functionality

### Budget System

- Master budget (1 per space per month)
- Secondary budgets for projects
- Budget items with custom categories
- Income tracking (expected vs received)
- Financial frameworks (50/30/20, 60/20/20, zero-based, custom)
- Automatic monthly replication
- Budget vs actual tracking
- Multi-currency support

### Expense Management

- Manual expense entry with amount, date, description
- AI-powered categorization with confidence scores
- Receipt scanning via camera (OCR)
- Expense splitting (equal, percentage, fixed amount, by income)
- Recurring expenses setup
- Expense search and filtering
- Bulk operations (edit, delete, recategorize)
- Bank transaction import (Plaid integration)

### AI Assistant (Anthropic Claude)

- Natural language chat interface
- Financial Q&A ("How much did I spend on food last month?")
- Predictive analytics (30/60/90 day projections)
- Anomaly detection for unusual spending
- Personalized recommendations
- Bill payment prioritization
- Debt payoff strategies
- Savings opportunities identification

### Community Price Intelligence

- Barcode scanning for products
- Price submission with location
- Price history and trends
- Store comparison maps
- Price drop notifications
- Shopping list optimizer
- Crowd validation system
- Gamification for contributors

### Dashboard & Analytics

- Financial health score (0-100)
- Monthly/yearly overview
- Category breakdown charts
- Spending trends analysis
- Budget progress bars
- Member balance calculations
- Custom date ranges
- Export to CSV/PDF

### Notifications & Alerts

- Upcoming bill reminders
- Budget threshold alerts (80%, 100%)
- Unusual transaction alerts
- Price drop notifications
- Weekly/monthly summaries
- Custom alert preferences

## Non-Functional Requirements

### Performance

- Page load time < 2 seconds on 3G
- API response < 200ms p95
- Support for 10,000 concurrent users
- Real-time sync across devices < 1 second
- Offline functionality for core features
- Background sync when online

### Security

- TLS 1.3 encryption for all communications
- AES-256 encryption for sensitive data at rest
- JWT tokens with 15-minute expiry
- Supabase Row Level Security (RLS)
- OAuth 2.0 for banking connections
- OWASP compliance
- Regular security audits

### Scalability

- Microservices-ready architecture
- Horizontal scaling capability
- Database read replicas
- Redis caching layer
- CDN for static assets
- Queue system for async tasks

### Usability

- Mobile-first responsive design
- WCAG 2.1 AA accessibility
- Multi-language support (English, Spanish initially)
- Learning curve < 10 minutes
- In-app onboarding tour
- Context-sensitive help

### Availability

- 99.9% uptime SLA
- Daily automated backups
- Point-in-time recovery (30 days)
- Disaster recovery < 4 hours
- Maintenance window: Sunday 2-4 AM EST
- Graceful degradation for service outages

## Technology Stack

### Frontend

- **Framework:** React 18 + TypeScript / React Native + Expo
- **Styling:** Tailwind CSS / NativeWind
- **State Management:** TanStack Query + Zustand
- **Build Tools:** Vite (web) / EAS (mobile)
- **PWA:** Workbox + vite-plugin-pwa

### Backend

- **Runtime:** Python 3.11+
- **Framework:** FastAPI
- **Database:** PostgreSQL 15+ (Supabase)
- **Authentication:** Supabase Auth
- **AI Integration:** Anthropic Claude API
- **Banking:** Plaid API

### Infrastructure

- **Hosting:** Vercel (web) / Railway (API)
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry
- **CDN:** Cloudflare
- **Storage:** Supabase Storage
- **Cache:** Redis

### External Integrations

- **Anthropic:** AI conversational assistant
- **Plaid:** Bank account connections
- **OCR:** Receipt scanning
- **SendGrid:** Email notifications
- **PostHog:** Analytics

## Success Metrics

### Adoption Metrics

- **Target Users:** 10,000 MAU by month 12
- **Registration Rate:** 40% of landing visitors
- **Activation Rate:** 60% create first budget within 7 days
- **Viral Coefficient:** 0.5 (each user invites 0.5 new users)

### Engagement Metrics

- **Session Duration:** Average 5+ minutes
- **Return Rate:** 70% weekly active users
- **Actions per Session:** 5+ (view dashboard, add expense, check budget)
- **AI Interactions:** 15+ queries per user per month

### Business Metrics

- **Revenue Target:** $200k ARR year 1
- **Conversion Rate:** 6-8% free to paid
- **Churn:** < 5% monthly
- **CAC:** < $25
- **LTV:CAC Ratio:** > 3:1

### Technical Metrics

- **Performance:** 95% requests < 200ms
- **Error Rate:** < 0.1%
- **Uptime:** 99.9% monthly
- **AI Accuracy:** > 90% categorization
- **Mobile Rating:** 4.5+ stars

## MVP vs Full Version

### MVP (Minimum Viable Product)

**Timeline:** 8 weeks

**Included Features:**

- User authentication (Supabase)
- Space creation and member invitation
- Basic budget management
- Manual expense tracking
- Simple expense splitting
- Basic dashboard
- PWA functionality
- AI chat (limited queries)

**Excluded Features:**

- Bank integration
- Receipt scanning
- Price comparison
- Advanced analytics
- Recurring expenses
- Investment tracking
- Multi-currency

### Full Version

**Timeline:** 6 months

**Additional Features:**

- All MVP features plus:
- Plaid bank integration
- OCR receipt scanning
- Community price intelligence
- Advanced AI predictions
- Recurring transactions
- Debt tracking
- Investment portfolio
- Multi-currency support
- White-label options

## Data Model Specification

### Core Entities

```javascript
// User (extended from Supabase Auth)
{
  id: UUID,
  email: String,
  username: String,
  preferred_language: Enum['en', 'es'],
  settings: JSON,
  created_at: Timestamp
}

// Space
{
  id: UUID,
  name: String,
  invite_code: String(6),
  created_by: User.id,
  settings: JSON,
  is_active: Boolean,
  created_at: Timestamp
}

// Budget
{
  id: UUID,
  space_id: Space.id,
  name: String,
  type: Enum['master', 'secondary'],
  month_period: String, // YYYY-MM
  framework: Enum['50_30_20', '60_20_20', 'zero_based', 'custom'],
  total_income: Decimal,
  created_by: User.id,
  created_at: Timestamp
}

// Expense
{
  id: UUID,
  space_id: Space.id,
  amount: Decimal,
  description: String,
  category: String,
  date: Date,
  receipt_url: String,
  ai_confidence: Float,
  created_by: User.id,
  bank_transaction_id: String,
  created_at: Timestamp
}

// AI Conversation
{
  id: UUID,
  user_id: User.id,
  space_id: Space.id,
  thread_id: String, // Anthropic thread
  messages: Array,
  created_at: Timestamp
}
```

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Load Balancer                     │
└─────────────────┬───────────────────────────────────┘
                  │
    ┌─────────────┴─────────────┬─────────────────┐
    ▼                           ▼                 ▼
┌─────────┐            ┌─────────────┐    ┌──────────┐
│   Web   │            │   Mobile    │    │   API    │
│  (PWA)  │            │    Apps     │    │ Gateway  │
└─────────┘            └─────────────┘    └────┬─────┘
                                                │
                        ┌───────────────────────┴──────┐
                        ▼                              ▼
                ┌──────────────┐            ┌──────────────┐
                │   Supabase   │            │   FastAPI    │
                │   (BaaS)     │            │   Backend    │
                └──────┬───────┘            └──────┬───────┘
                       │                           │
                       ▼                           ▼
                ┌──────────────┐            ┌──────────────┐
                │  PostgreSQL  │            │  Anthropic   │
                │   Database   │            │   Claude     │
                └──────────────┘            └──────────────┘
```

## API Specification

### Authentication Endpoints

#### POST /api/auth/register

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "username": "johndoe",
  "preferred_language": "en"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe"
    },
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

### AI Chat Endpoints

#### POST /api/ai/chat

**Request:**

```json
{
  "message": "How much did I spend on restaurants last month?",
  "space_id": "uuid",
  "context": {
    "include_predictions": true
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "response": "You spent $487 on restaurants last month...",
    "insights": [
      {
        "type": "trend",
        "message": "Your restaurant spending increased 65%"
      }
    ],
    "suggestions": ["Consider meal prep to save $200/month"]
  }
}
```

## Risks and Mitigations

### Technical Risks

**Risk:** AI API costs exceeding budget

- **Probability:** Medium
- **Impact:** High
- **Mitigation:** Rate limiting, token optimization, caching responses, tiered usage limits

**Risk:** Bank integration complexity

- **Probability:** Medium
- **Impact:** Medium
- **Mitigation:** Start with Plaid only, gradual rollout, manual entry fallback

### Business Risks

**Risk:** Low free-to-paid conversion

- **Probability:** Medium
- **Impact:** High
- **Mitigation:** Limited free tier, value-driven onboarding, trial periods

**Risk:** High customer acquisition cost

- **Probability:** High
- **Impact:** Medium
- **Mitigation:** Viral features, referral program, content marketing

### Security Risks

**Risk:** Financial data breach

- **Probability:** Low
- **Impact:** Critical
- **Mitigation:** End-to-end encryption, regular audits, compliance certifications, insurance

## Timeline

### Phase 1: Foundation (Weeks 1-4)

- Week 1: Environment setup, Supabase configuration
- Week 2: Authentication, user management
- Week 3: Space creation, member invitations
- Week 4: Basic budget CRUD operations

### Phase 2: Core Features (Weeks 5-8)

- Week 5: Expense tracking, manual entry
- Week 6: AI integration (Anthropic)
- Week 7: Basic dashboard, analytics
- Week 8: PWA setup, offline support

### Phase 3: Advanced Features (Weeks 9-12)

- Week 9: Expense splitting logic
- Week 10: Mobile app development
- Week 11: Bank integration (Plaid)
- Week 12: Testing, bug fixes

### Phase 4: Polish & Launch (Weeks 13-16)

- Week 13: Performance optimization
- Week 14: Security audit
- Week 15: Beta testing
- Week 16: Production launch

## Next Steps

1. **Technical Setup**

   - Initialize repositories
   - Configure Supabase project
   - Set up CI/CD pipeline
   - Timeline: Week 1
   - Owner: Development Team

2. **Design System Creation**

   - Component library setup
   - Design tokens definition
   - Prototype key flows
   - Timeline: Week 1-2
   - Owner: Design Team

3. **AI Integration Planning**
   - Anthropic API setup
   - Prompt engineering
   - Cost optimization strategy
   - Timeline: Week 2
   - Owner: AI Team

---

**Document Control:**

- Last Updated: October 2025
- Next Review: November 2025
- Owner: Product Team
- Stakeholders: Development, Design, Marketing, Leadership
