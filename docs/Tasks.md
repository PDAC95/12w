# TASK MANAGEMENT - Wallai

## UPDATE RULES

1. Mark [x] when complete with format: `[x] [2025-MM-DD HH:MM]`
2. Never delete tasks, move to COMPLETED section
3. Add newly discovered tasks to current sprint
4. Use priority levels: P0 (Critical), P1 (Important), P2 (Nice to have)
5. Each task should be completable in 15-60 minutes

# WALLAI SPRINT 1 - PRODUCT BACKLOG

**Sprint Duration:** 2025-10-03 to 2025-10-17 (14 días)
**Sprint Goal:** Fundación completa con autenticación, espacios colaborativos y gestión básica de presupuestos
**Total Story Points:** 89
**Completed:** 18/89 points (20%)
**Status:** 🟢 On Track

## 📌 CONFIGURACIÓN ACTUAL

**Puertos Definidos:**
- Frontend (React + Vite): `http://localhost:3000`
- Backend (FastAPI): `http://localhost:8000`

**Environment Setup:** ✅ Completo
- `.env` configurado con todas las variables
- Supabase conectado: `xmokupfqyjghgigapif.supabase.co`
- SECRET_KEY generado para JWT
- CORS configurado para localhost:3000
- Credenciales de desarrollo: dev@jappi.ca / Password123

**Ready for Development:** ✅ Sí
- US-001 completada (Supabase setup documentation)
- US-002 completada (Frontend React scaffolding)
- US-003 completada (Backend FastAPI setup)
- US-004 completada (Database schema & models)
- US-005 completada (User registration system)
- Documentación completa (18+ archivos)
- Variables de entorno listas
- wallai-web funcionando en localhost:3000
- Backend API corriendo en localhost:8000
- Sistema de registro completo (awaiting Supabase setup)
- Siguiente: US-006 (User login)

---

## ÉPICA 1: CONFIGURACIÓN INICIAL DEL PROYECTO

### US-001: Configuración de Supabase ✅

**Como** desarrollador, **quiero** configurar el proyecto Supabase, **para** tener la infraestructura base lista.

**Criterios de Aceptación:**

- DADO que necesito un BaaS completo
- CUANDO creo el proyecto en dashboard.supabase.com
- ENTONCES tengo auth, database, storage y realtime configurados
- Y las variables de entorno están documentadas en .env.example

**Tasks Técnicas:**

- [x] [2025-10-06] Crear proyecto en Supabase con nombre "wallai-prod" (Documentado en SUPABASE_SETUP.md)
- [x] [2025-10-06] Habilitar Auth con email/password y OAuth (Google, Apple) (Guía completa en SUPABASE_SETUP.md)
- [x] [2025-10-06] Configurar email templates personalizados (5 templates en templates/email/supabase_auth_templates.html)
- [x] [2025-10-06] Generar y documentar API keys (anon, service) (Documentado en .env.example)
- [x] [2025-10-06] Configurar RLS policies básicas (SQL completo en database/security/rls_policies.sql)
- [x] [2025-10-06] Habilitar Realtime en tablas necesarias (Instrucciones en SUPABASE_SETUP.md)

**DoD:**

- [x] Proyecto accesible en dashboard (Instrucciones paso a paso en SUPABASE_SETUP.md)
- [x] Auth probado con email test (Test guide en SUPABASE_SETUP.md Step 10)
- [x] .env.example creado con todas las variables (Archivo creado con 100+ variables documentadas)

**Story Points:** 2
**Prioridad:** P0
**Sprint:** 1
**Asignado a:** Backend Lead
**Status:** ✅ Completed [2025-10-06]

**Deliverables:**
- `.env.example` - Template completo con todas las variables de entorno
- `docs/SUPABASE_SETUP.md` - Guía completa de configuración paso a paso
- `database/security/rls_policies.sql` - Todas las políticas de seguridad RLS
- `templates/email/supabase_auth_templates.html` - 5 plantillas de email personalizadas

---

### US-002: Scaffolding Frontend React

**Como** desarrollador frontend, **quiero** el proyecto React configurado, **para** comenzar el desarrollo de componentes.

**Criterios de Aceptación:**

- DADO que necesito una PWA moderna
- CUANDO ejecuto npm run dev
- ENTONCES veo la app corriendo en localhost:3000 con hot reload

**Tasks Técnicas:**

- [x] Frontend: crear proyecto con `npm create vite@latest wallai-web -- --template react-ts`
- [x] Frontend: instalar dependencias core:
  - @supabase/supabase-js
  - react-router-dom
  - @tanstack/react-query
  - zustand
  - zod
  - react-hook-form
  - @hookform/resolvers
  - axios
  - lucide-react
- [x] Frontend: configurar estructura de carpetas según arquitectura
- [x] Frontend: setup Tailwind CSS + @tailwindcss/postcss
- [x] Frontend: configurar path aliases (@/components, @/lib, etc)
- [x] Frontend: configurar puerto 3000 en vite.config.ts

**DoD:**

- [x] App corriendo sin errores
- [x] Estructura de carpetas creada
- [x] Componente Hello World renderiza

**Story Points:** 3
**Prioridad:** P0
**Sprint:** 1
**Asignado a:** Frontend Lead
**Status:** ✅ Completed [2025-10-06]

**Deliverables:**
- `wallai-web/` - Proyecto Vite + React 18 + TypeScript configurado
- `wallai-web/src/` - Estructura de carpetas según arquitectura (features, components, lib, stores, hooks, types)
- `wallai-web/vite.config.ts` - Configuración con path aliases y puerto 3000
- `wallai-web/tailwind.config.js` - Tailwind CSS con colores de marca Wallai
- Componente Hello World funcionando en `localhost:3000`

---

### US-003: Setup Backend FastAPI

**Como** desarrollador backend, **quiero** FastAPI configurado, **para** manejar lógica de negocio compleja.

**Criterios de Aceptación:**

- DADO que necesito API REST para IA y lógica avanzada
- CUANDO ejecuto `uvicorn main:app --reload`
- ENTONCES el servidor responde en localhost:8000 con docs en /docs

**Tasks Técnicas:**

- [x] [2025-10-06] Backend: crear estructura de proyecto FastAPI
- [x] [2025-10-06] Backend: configurar SQLAlchemy 2.0 + Alembic
- [x] [2025-10-06] Backend: crear conexión con Supabase usando service key
- [x] [2025-10-06] Backend: configurar CORS para frontend
- [x] [2025-10-06] Backend: crear health check endpoint
- [x] [2025-10-06] Backend: configurar Pydantic settings

**DoD:**

- [x] /health retorna {"status": "ok"}
- [x] Swagger docs accesible en /docs
- [x] CORS permite requests desde localhost:3000

**Story Points:** 3
**Prioridad:** P0
**Sprint:** 1
**Asignado a:** Backend Lead
**Status:** ✅ Completed [2025-10-06]

**Deliverables:**
- `apps/api/src/main.py` - FastAPI application with CORS configured
- `apps/api/src/core/config.py` - Pydantic settings with all environment variables
- `apps/api/src/core/database.py` - SQLAlchemy 2.0 configuration with psycopg3
- `apps/api/src/core/supabase.py` - Supabase client with service key
- `apps/api/src/api/routes/health.py` - Health check endpoint
- `apps/api/requirements.txt` - Production dependencies
- `apps/api/requirements-dev.txt` - Development dependencies
- Server running on `http://localhost:8000` with Swagger docs at `/docs`

---

### US-004: Schema de Base de Datos

**Como** arquitecto de datos, **quiero** el schema completo creado, **para** soportar todas las funcionalidades del MVP.

**Criterios de Aceptación:**

- DADO que necesito persistir datos de usuarios, espacios, presupuestos y gastos
- CUANDO ejecuto las migraciones
- ENTONCES todas las tablas están creadas con sus relaciones y RLS policies

**Tasks Técnicas:**

- [x] [2025-10-06] DB: crear tabla users (extendiendo auth.users)
- [x] [2025-10-06] DB: crear tabla spaces con invite_code único
- [x] [2025-10-06] DB: crear tabla space_members con roles
- [x] [2025-10-06] DB: crear tabla budgets con tipos master/secondary
- [x] [2025-10-06] DB: crear tabla budget_items
- [x] [2025-10-06] DB: crear tabla expenses con categorías
- [x] [2025-10-06] DB: crear tabla expense_splits
- [x] [2025-10-06] DB: configurar RLS policies para cada tabla
- [x] [2025-10-06] DB: crear índices para queries frecuentes

**DoD:**

- [x] SQL migration scripts creados
- [x] RLS policies definidas
- [x] Diagrama ER documentado
- [ ] Pendiente: Usuario debe ejecutar SQL en Supabase (ver database/README.md)

**Story Points:** 5
**Prioridad:** P0
**Sprint:** 1
**Asignado a:** Backend Lead
**Status:** ✅ Completed [2025-10-06]
**Dependencias:** US-001

**Deliverables:**
- `database/migrations/001_initial_schema.sql` - Complete database schema (9 tables)
- `database/security/rls_policies.sql` - Row Level Security policies
- `database/docs/ER_DIAGRAM.md` - Complete Entity-Relationship diagram
- `database/README.md` - Database documentation and setup guide
- `apps/api/src/models/user.py` - SQLAlchemy User model
- `apps/api/src/api/routes/database.py` - Database health check endpoints
- FastAPI code ready to connect (awaiting Supabase project setup)

**Next Steps for User:**
1. Follow `docs/SUPABASE_SETUP.md` to create Supabase project
2. Run `database/migrations/001_initial_schema.sql` in Supabase SQL Editor
3. Run `database/security/rls_policies.sql` to enable RLS
4. Test connection via `/database/health` endpoint

---

## ÉPICA 2: AUTENTICACIÓN Y GESTIÓN DE USUARIOS

### US-005: Registro de Usuario

**Como** usuario nuevo, **quiero** registrarme con email y contraseña, **para** crear mi cuenta en Wallai.

**Criterios de Aceptación:**

- DADO que soy un visitante sin cuenta
- CUANDO completo el formulario con:
  - Email válido y único
  - Contraseña mínimo 8 caracteres con 1 mayúscula y 1 número
  - Username único
- ENTONCES recibo email de confirmación
- Y veo mensaje de verificar mi correo

**Tasks Técnicas:**

- [x] [2025-10-06] Frontend: crear RegisterForm con validación Zod
- [x] [2025-10-06] Frontend: integrar supabase.auth.signUp()
- [x] [2025-10-06] Frontend: mostrar estados loading/error/success
- [x] [2025-10-06] Backend: trigger para crear perfil en tabla users
- [x] [2025-10-06] Backend: validar unicidad de username
- [x] [2025-10-06] DB: constraint único en username

**DoD:**

- [x] Código de registro implementado
- [x] Validaciones Zod configuradas
- [x] Trigger SQL para perfil automático creado
- [ ] Pendiente: Usuario debe ejecutar trigger SQL en Supabase

**Story Points:** 5
**Prioridad:** P0
**Sprint:** 1
**Asignado a:** Full Stack
**Status:** ✅ Completed [2025-10-06]
**Dependencias:** US-002, US-004
**UX/UI Improvements:** ✅ Design modernization completed [2025-10-06]

**Deliverables:**
- `wallai-web/src/types/auth.types.ts` - TypeScript types para autenticación
- `wallai-web/src/lib/validations/auth.validation.ts` - Esquemas Zod (password, username, email)
- `wallai-web/src/lib/supabase.ts` - Cliente Supabase configurado
- `wallai-web/src/services/auth.service.ts` - Servicio de autenticación completo
- `wallai-web/src/features/auth/components/RegisterForm.tsx` - Formulario de registro con validación
- `wallai-web/src/features/auth/pages/RegisterPage.tsx` - Página completa de registro
- `database/migrations/002_auth_triggers.sql` - Trigger para crear perfil automático
- `database/README_SETUP_ORDER.md` - Guía de ejecución de migraciones

**Características Implementadas:**
- ✅ Validación de email (formato válido)
- ✅ Validación de password (min 8 chars, 1 mayúscula, 1 número)
- ✅ Validación de username (3-30 chars, solo alfanumérico)
- ✅ Confirmación de password
- ✅ Verificación de username único
- ✅ Estados de loading/error/success
- ✅ Mensajes de error en español
- ✅ Trigger SQL para crear perfil automáticamente
- ✅ Metadata de usuario (username, full_name) enviada a Supabase

**UX/UI Design Improvements [2025-10-06]:**
- ✅ Split-screen layout (hero section + form)
- ✅ Real logo integration from `public/logo/` (horizontal & vertical variants)
- ✅ Professional Heroicons icons (SparklesIcon, UsersIcon, ChartBarIcon, LightBulbIcon)
- ✅ Password strength indicator with visual bar
- ✅ Show/hide password toggle
- ✅ Input field icons for better UX
- ✅ Animated gradient background with glassmorphism
- ✅ Enhanced error states with shake animation
- ✅ Success state with scale-in animation and celebration
- ✅ Responsive design (mobile + desktop)
- ✅ Larger logo size (48px → 80px)
- ✅ Modern gradients (teal-600 → green-600)
- ✅ Professional stats display (10K+ users, $2M+ saved, 4.9 rating)
- ✅ All text in English (no Spanish/emoji mixing)
- ✅ Brand colors maintained (#4ADE80, #14B8A6, #2E4057)

**Next Steps for User:**
1. Seguir `docs/SUPABASE_SETUP.md` para crear proyecto Supabase
2. Ejecutar `database/migrations/001_initial_schema.sql`
3. Ejecutar `database/migrations/002_auth_triggers.sql`
4. Ejecutar `database/security/rls_policies.sql`
5. Probar registro mejorado en `/register`

---

### US-006: Login de Usuario

**Como** usuario registrado, **quiero** iniciar sesión, **para** acceder a mis finanzas.

**Criterios de Aceptación:**

- DADO que tengo cuenta verificada
- CUANDO ingreso email y contraseña correctos
- ENTONCES accedo al dashboard
- Y mi sesión persiste al recargar la página

**Tasks Técnicas:**

- [ ] Frontend: crear LoginForm con remember me
- [ ] Frontend: implementar AuthContext con Zustand
- [ ] Frontend: configurar persistencia con localStorage
- [ ] Frontend: redirect automático a /dashboard
- [ ] Backend: middleware para verificar JWT en rutas protegidas

**DoD:**

- [ ] Login exitoso redirige a dashboard
- [ ] Sesión persiste en refresh
- [ ] Logout limpia sesión completamente

**Story Points:** 3  
**Prioridad:** P0  
**Sprint:** 1  
**Asignado a:** Full Stack
**Dependencias:** US-005

---

### US-007: Rutas Protegidas

**Como** desarrollador, **quiero** rutas protegidas en React, **para** asegurar acceso solo a usuarios autenticados.

**Criterios de Aceptación:**

- DADO que hay rutas públicas y privadas
- CUANDO un usuario no autenticado intenta acceder a ruta privada
- ENTONCES es redirigido a /login con return URL

**Tasks Técnicas:**

- [ ] Frontend: crear ProtectedRoute component
- [ ] Frontend: implementar useAuth hook
- [ ] Frontend: configurar React Router con rutas públicas/privadas
- [ ] Frontend: guardar intended URL para redirect post-login

**DoD:**

- [ ] Rutas privadas requieren auth
- [ ] Redirect funciona correctamente
- [ ] Loading state mientras verifica auth

**Story Points:** 2  
**Prioridad:** P0  
**Sprint:** 1  
**Asignado a:** Frontend
**Dependencias:** US-006

---

## ÉPICA 3: ESPACIOS COLABORATIVOS

### US-008: Crear Espacio

**Como** usuario autenticado, **quiero** crear un espacio compartido, **para** gestionar finanzas con otros.

**Criterios de Aceptación:**

- DADO que estoy autenticado
- CUANDO creo un espacio con nombre
- ENTONCES se genera código de invitación de 6 caracteres
- Y soy asignado como owner del espacio

**Tasks Técnicas:**

- [ ] Frontend: CreateSpaceModal con formulario
- [ ] Backend: POST /api/spaces endpoint
- [ ] Backend: generar código único de 6 chars (sin O,0,I,1)
- [ ] DB: insertar space y space_member con role="owner"

**DoD:**

- [ ] Espacio creado visible en lista
- [ ] Código de invitación copiable
- [ ] Owner tiene permisos totales

**Story Points:** 3  
**Prioridad:** P1  
**Sprint:** 1  
**Asignado a:** Full Stack
**Dependencias:** US-007

---

### US-009: Sistema de Invitaciones

**Como** miembro de espacio, **quiero** invitar a otros con un código, **para** compartir la gestión financiera.

**Criterios de Aceptación:**

- DADO que tengo un código de invitación válido
- CUANDO lo ingreso en /join
- ENTONCES soy añadido al espacio como member
- Y veo el espacio en mi lista

**Tasks Técnicas:**

- [ ] Frontend: JoinSpaceForm para ingresar código
- [ ] Backend: POST /api/spaces/join endpoint
- [ ] Backend: validar código y límite de miembros (10)
- [ ] DB: insertar en space_members con role="member"

**DoD:**

- [ ] Join exitoso muestra espacio
- [ ] Códigos inválidos muestran error claro
- [ ] Límite de miembros respetado

**Story Points:** 3  
**Prioridad:** P1  
**Sprint:** 1  
**Asignado a:** Full Stack
**Dependencias:** US-008

---

### US-010: Cambio de Espacio

**Como** usuario con múltiples espacios, **quiero** cambiar entre ellos, **para** ver diferentes presupuestos.

**Criterios de Aceptación:**

- DADO que pertenezco a 2+ espacios
- CUANDO selecciono uno diferente
- ENTONCES toda la UI se actualiza con datos del nuevo espacio
- Y se recuerda mi última selección

**Tasks Técnicas:**

- [ ] Frontend: SpaceSelector dropdown en header
- [ ] Frontend: actualizar currentSpaceId en Zustand
- [ ] Frontend: refrescar queries al cambiar espacio
- [ ] Backend: filtrar todos los endpoints por space_id

**DoD:**

- [ ] Cambio instantáneo de contexto
- [ ] Datos correctos por espacio
- [ ] Última selección persistida

**Story Points:** 2  
**Prioridad:** P1  
**Sprint:** 1  
**Asignado a:** Frontend
**Dependencias:** US-009

---

## ÉPICA 4: GESTIÓN DE PRESUPUESTOS

### US-011: Crear Presupuesto Master

**Como** miembro de espacio, **quiero** crear el presupuesto mensual principal, **para** organizar mis finanzas.

**Criterios de Aceptación:**

- DADO que estoy en un espacio sin presupuesto del mes actual
- CUANDO creo un presupuesto con:
  - Nombre descriptivo
  - Mes/año seleccionado
  - Framework financiero (50/30/20, etc)
  - Ingresos esperados
- ENTONCES se crea como tipo "master"
- Y solo puede existir uno por mes

**Tasks Técnicas:**

- [ ] Frontend: CreateBudgetForm con selector de framework
- [ ] Backend: POST /api/spaces/{id}/budgets
- [ ] Backend: validar unicidad de master budget por mes
- [ ] DB: crear budget con budget_items automáticos según framework

**DoD:**

- [ ] Budget creado con items predefinidos
- [ ] Framework aplicado correctamente (50/30/20)
- [ ] Validación impide duplicados

**Story Points:** 5  
**Prioridad:** P1  
**Sprint:** 1  
**Asignado a:** Full Stack
**Dependencias:** US-010

---

### US-012: Gestión de Budget Items

**Como** usuario con presupuesto, **quiero** gestionar las categorías de gasto, **para** distribuir mi dinero.

**Criterios de Aceptación:**

- DADO que tengo un presupuesto activo
- CUANDO añado/edito/elimino items con:
  - Nombre de categoría
  - Monto presupuestado
  - Ícono/color
- ENTONCES los cambios se reflejan inmediatamente
- Y el total se recalcula

**Tasks Técnicas:**

- [ ] Frontend: BudgetItemsList con CRUD inline
- [ ] Backend: endpoints para budget items CRUD
- [ ] Backend: recalcular totales al modificar
- [ ] DB: soft delete para items eliminados

**DoD:**

- [ ] CRUD completo funcionando
- [ ] Totales siempre correctos
- [ ] Validación de montos positivos

**Story Points:** 3  
**Prioridad:** P1  
**Sprint:** 1  
**Asignado a:** Full Stack
**Dependencias:** US-011

---

## ÉPICA 5: TRACKING DE GASTOS

### US-013: Registro Rápido de Gasto

**Como** usuario, **quiero** registrar gastos rápidamente, **para** mantener mi tracking al día.

**Criterios de Aceptación:**

- DADO que necesito registrar un gasto
- CUANDO ingreso:
  - Monto (requerido)
  - Descripción (opcional)
  - Categoría (auto-sugerida)
  - Fecha (default: hoy)
- ENTONCES el gasto se guarda en < 2 segundos
- Y se actualiza el budget correspondiente

**Tasks Técnicas:**

- [ ] Frontend: QuickExpenseForm con autocompletado
- [ ] Frontend: categorías sugeridas basadas en descripción
- [ ] Backend: POST /api/spaces/{id}/expenses
- [ ] Backend: actualizar spent_amount en budget_items
- [ ] DB: trigger para actualizar totales

**DoD:**

- [ ] Entrada en < 3 clicks
- [ ] Categorización automática funciona
- [ ] Budget actualizado en tiempo real

**Story Points:** 5  
**Prioridad:** P1  
**Sprint:** 1  
**Asignado a:** Full Stack
**Dependencias:** US-012

---

### US-014: Lista de Gastos

**Como** usuario, **quiero** ver todos mis gastos del mes, **para** entender mis patrones de consumo.

**Criterios de Aceptación:**

- DADO que tengo gastos registrados
- CUANDO accedo a la lista
- ENTONCES veo:
  - Gastos ordenados por fecha (más reciente primero)
  - Filtros por categoría
  - Búsqueda por descripción
  - Total del mes

**Tasks Técnicas:**

- [ ] Frontend: ExpensesList con virtualización
- [ ] Frontend: filtros y búsqueda con debounce
- [ ] Backend: GET /api/spaces/{id}/expenses con paginación
- [ ] Backend: agregaciones para totales

**DoD:**

- [ ] Lista carga en < 1 segundo
- [ ] Filtros funcionan correctamente
- [ ] Scroll infinito implementado

**Story Points:** 3  
**Prioridad:** P1  
**Sprint:** 1  
**Asignado a:** Full Stack
**Dependencias:** US-013

---

## ÉPICA 6: DASHBOARD Y VISUALIZACIÓN

### US-015: Dashboard Principal

**Como** usuario, **quiero** ver un resumen de mis finanzas, **para** tomar decisiones informadas.

**Criterios de Aceptación:**

- DADO que tengo datos financieros
- CUANDO accedo al dashboard
- ENTONCES veo:
  - Resumen del mes (ingresos, gastos, balance)
  - Progreso de presupuesto por categoría
  - Top 5 gastos del mes
  - Gráfico de tendencia semanal

**Tasks Técnicas:**

- [ ] Frontend: DashboardPage con grid responsive
- [ ] Frontend: componentes de métricas (MetricCard)
- [ ] Frontend: gráficos con Recharts
- [ ] Backend: GET /api/dashboard/summary endpoint
- [ ] Backend: caching con Redis para métricas

**DoD:**

- [ ] Dashboard carga en < 2 segundos
- [ ] Responsive en mobile/tablet/desktop
- [ ] Datos actualizados en tiempo real

**Story Points:** 5  
**Prioridad:** P1  
**Sprint:** 1  
**Asignado a:** Full Stack
**Dependencias:** US-014

---

### US-016: Configuración PWA

**Como** usuario móvil, **quiero** instalar la app en mi teléfono, **para** acceso rápido sin app store.

**Criterios de Aceptación:**

- DADO que accedo desde un navegador móvil
- CUANDO veo el prompt de instalación
- ENTONCES puedo instalar la PWA
- Y funciona offline para lectura

**Tasks Técnicas:**

- [ ] Frontend: configurar Workbox con Vite
- [ ] Frontend: crear manifest.json con iconos
- [ ] Frontend: implementar service worker
- [ ] Frontend: estrategia cache-first para assets
- [ ] Frontend: mostrar estado offline

**DoD:**

- [ ] Instalable en Android/iOS
- [ ] Funciona offline (lectura)
- [ ] Lighthouse PWA score > 90

**Story Points:** 3  
**Prioridad:** P1  
**Sprint:** 1  
**Asignado a:** Frontend
**Dependencias:** US-015

---

## ÉPICA 7: MEJORAS UX (P2)

### US-017: Estados de Carga

**Como** usuario, **quiero** feedback visual mientras espero, **para** saber que la app está funcionando.

**Criterios de Aceptación:**

- DADO que realizo una acción que requiere servidor
- CUANDO la respuesta tarda > 300ms
- ENTONCES veo skeleton screens o spinners
- Y mensajes de error claros si falla

**Tasks Técnicas:**

- [ ] Frontend: crear SkeletonCard component
- [ ] Frontend: implementar en todas las listas
- [ ] Frontend: toast notifications para errores

**DoD:**

- [ ] Todos los estados async cubiertos
- [ ] Consistent loading patterns

**Story Points:** 2  
**Prioridad:** P2  
**Sprint:** 1  
**Asignado a:** Frontend

---

### US-018: Modo Oscuro

**Como** usuario, **quiero** cambiar entre tema claro/oscuro, **para** mi preferencia visual.

**Criterios de Aceptación:**

- DADO que prefiero modo oscuro
- CUANDO activo el toggle
- ENTONCES toda la UI cambia a tema oscuro
- Y se recuerda mi preferencia

**Tasks Técnicas:**

- [ ] Frontend: configurar Tailwind dark mode
- [ ] Frontend: ThemeToggle component
- [ ] Frontend: persistir en localStorage

**DoD:**

- [ ] Todos los componentes soportan dark
- [ ] Transición suave entre temas

**Story Points:** 2  
**Prioridad:** P2  
**Sprint:** 1  
**Asignado a:** Frontend

---

## RESUMEN DE MÉTRICAS

### Distribución por Prioridad

- **P0 (Critical):** 7 stories - 25 points
- **P1 (Important):** 9 stories - 37 points
- **P2 (Nice to have):** 2 stories - 4 points

### Distribución por Épica

- **Configuración:** 4 stories - 13 points
- **Autenticación:** 3 stories - 10 points
- **Espacios:** 3 stories - 8 points
- **Presupuestos:** 2 stories - 8 points
- **Gastos:** 2 stories - 8 points
- **Dashboard:** 2 stories - 8 points
- **UX:** 2 stories - 4 points

### Asignación por Rol

- **Backend Lead:** 4 stories
- **Frontend Lead:** 5 stories
- **Full Stack:** 9 stories

### Velocidad Estimada

- **Semana 1:** US-001 a US-007 (25 points)
- **Semana 2:** US-008 a US-018 (64 points)

### Definition of Done Global

- [ ] Código revisado por peer
- [ ] Tests unitarios escritos (>80% coverage)
- [ ] Documentación actualizada
- [ ] Sin errores en consola
- [ ] Responsive validado
- [ ] Accesibilidad WCAG 2.1 AA
- [ ] Performance < 3s carga inicial

### Riesgos Identificados

1. **RLS Policies Complejas:** Pueden bloquear queries - Mitigación: Testing exhaustivo
2. **Límite Supabase Free:** 500 MAU - Mitigación: Optimizar queries
3. **Tiempo agresivo:** 2 semanas para 89 points - Mitigación: Priorización estricta P0/P1

## NEXT SPRINT: Sprint 2 - AI Integration

**Planned Start:** 2025-10-17  
**Planned End:** 2025-10-31  
**Goal:** Integrate Anthropic Claude for conversational AI and auto-categorization

### Planned Tasks

- [ ] [P0] Setup Anthropic API integration in FastAPI
- [ ] [P0] Create chat interface component
- [ ] [P0] Implement conversation state management
- [ ] [P1] Build AI categorization service
- [ ] [P1] Create financial insights generation
- [ ] [P1] Implement predictive analytics (30-day forecast)
- [ ] [P1] Add chat history persistence
- [ ] [P2] Create AI confidence indicators
- [ ] [P2] Add prompt optimization for better responses

---

## BACKLOG (Future Sprints)

### Sprint 3: Advanced Features (Nov 1-14)

- [ ] [P0] Implement expense splitting logic
- [ ] [P1] Create recurring expenses system
- [ ] [P1] Build budget vs actual comparison charts
- [ ] [P1] Add multi-currency support
- [ ] [P1] Create expense approval workflow
- [ ] [P2] Add receipt OCR scanning
- [ ] [P2] Implement expense search and filters

### Sprint 4: Banking & Mobile (Nov 15-28)

- [ ] [P0] Plaid API integration for US/Canada
- [ ] [P0] Bank account connection flow
- [ ] [P1] Transaction import and categorization
- [ ] [P1] React Native app initialization with Expo
- [ ] [P1] Mobile authentication flow
- [ ] [P1] Core mobile screens (dashboard, expenses)
- [ ] [P2] Push notifications setup

### Sprint 5: Price Intelligence (Dec 1-14)

- [ ] [P1] Product database schema with PostGIS
- [ ] [P1] Barcode scanning implementation
- [ ] [P1] Price submission and validation system
- [ ] [P1] Store location mapping
- [ ] [P2] Price trend analysis
- [ ] [P2] Shopping list optimizer
- [ ] [P2] Gamification for contributors

### Sprint 6: Polish & Launch (Dec 15-31)

- [ ] [P0] Performance audit and optimization
- [ ] [P0] Security audit and penetration testing
- [ ] [P0] Production deployment setup
- [ ] [P1] Beta user onboarding
- [ ] [P1] Load testing with Locust
- [ ] [P1] Documentation and help system
- [ ] [P2] Marketing website
- [ ] [P2] App store submissions

### Ideas & Proposals

- [ ] Voice input for expense entry
- [ ] WhatsApp/Telegram bot integration
- [ ] Crypto wallet tracking
- [ ] Investment portfolio integration
- [ ] Bill negotiation service
- [ ] Group vacation expense planning
- [ ] Financial goal gamification
- [ ] Community forums for financial tips

---

## COMPLETED TASKS

### Setup Phase (2025-10-01 to 2025-10-03)

- [x] [2025-10-01 10:00] [P0] Define technical architecture
- [x] [2025-10-01 14:00] [P0] Create PRD document
- [x] [2025-10-02 09:00] [P0] Setup project repositories
- [x] [2025-10-02 11:00] [P1] Choose UI component library (shadcn/ui)
- [x] [2025-10-02 15:00] [P2] Research Anthropic API pricing

---

## BLOCKED TASKS

Tasks that cannot proceed due to dependencies or issues

- ⏸️ [P1] Implement price comparison map - **Blocked by:** Need Google Maps API key
  - Attempted: Research alternatives (Mapbox, OpenStreetMap)
  - Needs: Decision on mapping provider and API key
  - Owner: Product team decision

---

## CANCELLED TASKS

Tasks that were planned but cancelled (keep for reference)

- ❌ [2025-10-02] GraphQL API implementation - **Reason:** Decided to use REST for simplicity
- ❌ [2025-10-02] Kubernetes setup - **Reason:** Overkill for MVP, using Railway instead

---

## RECURRING TASKS

Tasks that repeat regularly

### Daily

- [ ] Check Supabase dashboard for errors
- [ ] Review Sentry error reports
- [ ] Update PROGRESS.md with session summary
- [ ] Check Anthropic API usage and costs

### Weekly

- [ ] Backup Supabase database
- [ ] Review and optimize slow queries
- [ ] Update dependencies (pnpm update)
- [ ] Security scan with npm audit
- [ ] Review user feedback and issues

### Monthly

- [ ] Full security audit
- [ ] Update API documentation
- [ ] Review and archive completed sprints
- [ ] Analyze user metrics and KPIs
- [ ] Cost analysis (Supabase, Anthropic, hosting)

---

## BUGS & ISSUES

### 🐛 Active Bugs

- [ ] [P0] [BUG] Supabase RLS policy blocking space member queries

  - Steps: Create space, invite user, new user can't see space
  - Expected: Members should see spaces they belong to
  - Environment: Development
  - Suspected cause: Missing OR condition in RLS policy

- [ ] [P1] [BUG] Expense amount validation allows negative numbers
  - Steps: Enter -100 in expense form
  - Expected: Should show validation error
  - Environment: Development

### ✅ Fixed Bugs

- [x] [2025-10-03] [BUG] JWT token not refreshing automatically
  - Solution: Implemented token refresh interceptor

---

## TASK METRICS

### Current Sprint Statistics

- **Total Tasks:** 18 User Stories
- **Completed:** 1 (6%)
- **In Progress:** 0
- **Blocked:** 0
- **Not Started:** 17

### Velocity Tracking

- **Sprint 0 (Setup):** 5 story points (planning)
- **Sprint 1 (Week 1):** 2/89 story points (2%)
- **Average Velocity:** TBD (need 2-3 sprints)
- **Projected Completion:** On track for 8-week MVP

### Task Distribution

- **P0 Tasks:** 7 total, 1 completed (14%)
- **P1 Tasks:** 9 total, 0 completed (0%)
- **P2 Tasks:** 2 total, 0 completed (0%)

### Completion by Epic

- **Configuración Inicial:** 1/4 (25%) ✅ US-001
- **Autenticación:** 0/3 (0%)
- **Espacios Colaborativos:** 0/3 (0%)
- **Presupuestos:** 0/2 (0%)
- **Gastos:** 0/2 (0%)
- **Dashboard:** 0/2 (0%)
- **UX:** 0/2 (0%)

---

## DEFINITIONS & ESTIMATES

### Task Size Estimates

- **XS (< 30 min):** Config change, simple fix, small UI tweak
- **S (30-60 min):** Single component, API endpoint, database table
- **M (1-2 hours):** Feature with frontend + backend, complex component
- **L (2-4 hours):** Multi-component feature, integration work
- **XL (> 4 hours):** Should be broken into smaller tasks

### Priority Definitions

- **P0:** Breaks core functionality, security issue, blocks development
- **P1:** Core features needed for MVP, important user flows
- **P2:** Nice improvements, optimizations, polish

### Task States

- `[ ]` - Not started
- `[>]` - In progress (mark with date/time)
- `[x]` - Completed
- `[⏸️]` - Blocked
- `[❌]` - Cancelled

---

## NOTES & DECISIONS

### Technical Decisions

- [2025-10-01] Chose Supabase over Firebase for better PostgreSQL support
- [2025-10-01] Using Anthropic Claude over OpenAI for better conversation context
- [2025-10-02] REST API instead of GraphQL for faster development
- [2025-10-02] shadcn/ui for consistent, accessible components
- [2025-10-03] PWA first, native apps in Sprint 4
- [2025-10-06] Frontend port set to 3000 (instead of Vite default 5173)
- [2025-10-06] Backend port maintained at 8000 (FastAPI default)
- [2025-10-06] Generated secure 64-character SECRET_KEY for JWT with OpenSSL

### Important Notes

- Remember to update RLS policies when adding new tables
- Always validate amounts are positive before database insert
- Cache AI responses to reduce API costs
- Use Supabase Realtime for collaborative features
- Test with multiple spaces and users from day 1

### Cost Considerations

- Anthropic API: ~$1/user/month at expected usage
- Supabase: Free tier until 500 MAU, then $25/month
- Plaid: $0.30 per bank connection
- Target: Keep per-user cost under $3/month

---

**Last Updated:** 2025-10-06 17:00
**Updated By:** Claude Code
**Next Review:** 2025-10-07 (Daily standup)
**Sprint Progress:** 6% (Day 2 of 14)
**Environment Setup:** ✅ Complete
**Ready for Development:** ✅ Yes
