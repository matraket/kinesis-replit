### Kinesis Web + CMS Project Guide for Replit Agent

#### Overview
This project is a **modular monolith** combining a public-facing website (`web/`), a Content Management System (CMS) backoffice (`cms/`), and a unified API (`api/`), all built in **TypeScript**. The architecture is designed for future transition to microservices. The project aims to reflect Kinesis's business philosophy of precision, innovation, and structured flows through a professional and clean technical implementation.

#### User Preferences
The Agent's actions are governed by the following rules:

| Folder Access | Rule | Purpose |
| :--- | :--- | :--- |
| **Writable** | `core/`, `web/`, `cms/`, `api/`, `shared/`, `scripts/`, `docs/`, `tests/` | Creation, modification, and deletion are allowed. |
| **Read-Only** | `context/`, `config/`, `.replit`, `replit.nix` | **Do not modify or delete files in `context/`** (business documentation) or core configuration files, unless explicitly instructed. |

**`replit.md` is the contract for this project. You MAY only append new notes or sections that keep it consistent and up to date. You MUST NOT delete sections, rename sections, or refactor this file globally unless explicitly requested by the user.**

**Architectural Enforcement:**
*   Do not mix layers (e.g., no domain logic in presentation, no direct database calls in `domain/`).
*   `web/` and `cms/` must only communicate with `api/` via HTTP; they must **not** be coupled directly.
*   All significant changes (new modules, major refactors, API contract updates) **must be documented** in `docs/CHANGELOG.md`.

**Coding Conventions & Naming Standards**:
*   **Classes, Interfaces, Types, React Components**: **PascalCase**
*   **Functions, Variables, Properties, Methods**: **camelCase**
*   **Constants, Environment Variables**: **UPPER_SNAKE_CASE**
*   **Files and Routes**: **kebab-case**
*   **Database Fields/External Schemas**: **snake_case** (only when mapping to external schemes; map to internal `camelCase` models in `infrastructure/`)

**Style Guidelines:**
*   Use TypeScript with explicit typing at all borders.
*   Prefer functional React components with hooks.

**Testing & Quality Assurance:**
*   **Do not introduce new significant features without creating or updating related tests**.
*   If existing tests are deleted (only allowed if functionality is entirely removed), this change **must be documented in `docs/CHANGELOG.md`**.

#### System Architecture
The project adheres to Clean Architecture and Domain-Driven Design principles:
*   **`domain/`**: Pure OO + DDD, containing Entities, Value Objects, Aggregates, business logic, and Domain Events. Framework-agnostic.
*   **`application/`**: Orchestrates Use Cases, defines interfaces (Ports) for repositories and external services, and publishes events.
*   **`infrastructure/`**: Implements repository interfaces, adapts Replit services, and handles model-to-schema mapping.
*   **`presentation/` (web/cms) & `interfaces/` (api)**: Manages UI, routes, HTTP controllers, and **Zod validation** for DTOs, orchestrating UI logic by calling Use Cases.

**UI/UX Decisions:**
*   **Styling:** Primarily **Tailwind CSS**, with **shadcn/ui** for components.
*   **Component Structure:** `shared/ui` for reusable components across `web/` and `cms/`.
*   **Mobile:** **Mobile First** approach with responsive design.

**Execution & Deployment Flow:**
*   Runs as a modular monolith within a single Replit instance.
*   The `.replit` file uses the `dev` script as the main Run command and should not be changed without explicit instruction.
*   The Node.js server in `api/` must serve both the **API** (`/api/**` routes) and static assets for `web/` and `cms/` from a **single public port** (`process.env.PORT`).
*   **Development (`dev` script):** Starts backend and frontends in development mode via a single Node server.
*   **Production (`start` script):** Generates static bundles and then starts the Node server to serve API and static bundles.
*   **Environment Variables:** `process.env.PORT` must be used.

**Testing Scope:**
*   **Unit Tests:** Required for key Use Cases in `api/domain/` and `api/application/`.
*   **Integration Tests:** Must cover critical flows like lead creation and main CMS workflows.
*   **Test Location:** Unit tests near code or in `__tests__`; Integration/E2E tests in `/tests`.

#### External Dependencies
All external infrastructure access is encapsulated within `api/infrastructure/`.
*   **Database:** Replit's integrated **SQL Database (PostgreSQL serverless)**. The conceptual data model is `context/kinesis-database-schema.sql`.
*   **Authentication:** Replit Auth (with `X-Admin-Secret` placeholder for admin access).
*   **File Storage:** Replit App Storage for assets.
*   **Secrets:** Replit Secrets environment variables (e.g., `DATABASE_URL`, `ADMIN_SECRET`).

#### Development Status Notes

**T6 - CMS Bootstrap y Autenticación (Completed):**
*   Created React + Vite + Tailwind + TypeScript CMS in `cms/` directory
*   Implemented authentication system using `X-Admin-Secret` header with localStorage persistence
*   Set up HTTP client with automatic header injection for `/api/admin` endpoints and 401 handling
*   Configured React Router with protected routes: `/admin/login`, `/admin`, and content management routes
*   Created base layout with sidebar navigation, topbar, and mobile-responsive design
*   Implemented login page and dashboard with placeholder pages for: programs, instructors, business models, pages, FAQs, leads, and settings
*   Development workflow: CMS runs on port 5173 (Vite dev server), API runs on port 5000
*   Note: Full CRUD views for content management will be implemented in T7-T9

**T6.1 - Aplicar Sistema de Diseño Kinesis al CMS (Completed):**
*   Applied Kinesis design system (Admin color palette) to CMS visual layer
*   Configured Tailwind with Admin Navy, Surface, Accent Pink, and semantic colors
*   Integrated Google Fonts: Montserrat (display) + Inter (body) for typography
*   Created reusable UI components: Button (primary/secondary/ghost), Card, Input
*   Styled AdminLayout with dark sidebar, topbar, active states, and accent markers
*   Redesigned LoginRoute, DashboardRoute, and PlaceholderRoute with design tokens
*   Responsive design maintained, focus states accessible (purple outline)
*   CMS now reflects Kinesis brand identity while maintaining T6 functionality

**T6.2 - Theme Toggle + Light Mode para el CMS (Completed):**
*   Implemented theme toggle system (Dark/Light mode) with CSS variables for both themes
*   Created ThemeProvider with React Context for theme state management and localStorage persistence
*   Added theme toggle button in AdminLayout topbar with Sun/Moon icons (lucide-react)
*   Dark mode remains default; light mode uses gray palette for backgrounds and surfaces
*   Theme preference persists in localStorage with key `kinesis-admin-theme`
*   All existing components use theme tokens (CSS variables) for dynamic theming

**T7 - Dashboard y Estructura Base del CMS (Completed):**
*   Created reusable UI component library in `shared/ui/`: DataTable, FilterSidebar, Form components
*   Implemented comprehensive Dashboard at `/admin` with lead KPIs and metrics visualization
*   Dashboard shows: new leads (7 days), leads by type (30 days), conversion funnel, recent leads table
*   Refactored navigation to configuration-based system (`cms/src/app/config/navigation.ts`)
*   AdminLayout now reads navigation from config instead of hardcoded structure
*   Added dynamic branding: fetches site name and logo from settings API with fallbacks
*   Extended adminApi with TypeScript types and filter support for leads and settings
*   DataTable: generic component with sorting, pagination, custom columns, loading states
*   All components support Light/Dark theme toggle and follow Kinesis design system
*   Dashboard loads data in parallel for performance, handles errors gracefully