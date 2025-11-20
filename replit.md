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

#### UI Context (Stack-UI Kinesis)

All UI implementation in this modular monolith – both the public website in `web/` and the CMS backoffice in `cms/` – MUST follow the UI guides stored under the `context/` folder:

- `/context/Stack-UI.md`: **Technical Stack-UI Kinesis guide**, describing the base components in `shared/ui`, the sections in `shared/components/sections`, and the expected usage patterns for Web and CMS.
- `/context/kinesis-conceptual-template.md`: **Kinesis conceptual template**, defining the main page archetypes (landings, listings, detail pages, auth, etc.) and example compositions built on top of the Stack-UI.

The Agent MUST treat these two documents as the primary source of truth for any UI/UX decision before creating new screens or modifying existing ones in `web/` or `cms/`.

#### Global Constraints & Guardrails

To avoid breaking the existing architecture or diluting the design system, the Agent MUST respect the following constraints in every task:

- **No rogue UI implementation:** The Agent MUST NOT implement complex UI screens using raw `<div>` + Tailwind classes if an equivalent pattern or component already exists in `shared/ui`, `shared/components/sections`, or is documented in `/context/Stack-UI.md` or `/context/kinesis-conceptual-template.md`. Reuse the Stack-UI first.
- **Do not change core configuration or context:** The Agent MUST NOT modify anything under `context/`, `.replit`, `replit.nix`, `replit.md`, or `config/` unless the user explicitly asks to change a specific file.
- **Do not change the top-level folder structure:** The Agent MUST NOT create or remove top-level folders (`api/`, `web/`, `cms/`, `core/`, `shared/`, `scripts/`, `docs/`, `tests/`, etc.) or move modules between them.
- **Minimal dependencies:** The Agent MUST NOT add new runtime dependencies unless explicitly requested in a PRD. When in doubt, reuse existing libraries, existing patterns, and the Stack-UI components.
- **Preserve React.StrictMode and existing routes:** The Agent MUST NOT remove `React.StrictMode` from any React entrypoint or change existing HTTP routes/URLs unless explicitly requested.
- **No debug/temporary artefacts:** The Agent MUST NOT create or leave behind temporary assets such as `Pasted-*` folders, `attached_assets/`, screenshots, local log files, or scratch JSON files in the repository.

These constraints override any automatic “fix”, “refactor”, or suggestion made by tools or plugins: if a tool conflicts with this section, the Agent MUST follow these constraints instead.

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

**T8/T9 - CMS Content Views Implementation (Completed):**
*   **Media Library Backend:**
    *   Created database migration `03_media_library_schema.sql` with media_library table and proper indexes
    *   Implemented Clean Architecture backend: domain entities, repositories, use cases (List, Get, Upload, Delete)
    *   Created MediaController with full CRUD endpoints at `/api/admin/media`
    *   Schema supports file metadata, folder organization, MIME types, and file sizes
    *   Ready for Replit App Storage integration (placeholder for actual upload implementation)
*   **WYSIWYG Editor:**
    *   Installed and configured Tiptap (@tiptap/react, @tiptap/starter-kit, @tiptap/extension-link)
    *   Created RichTextEditor component with toolbar (bold, italic, strike, headings, lists, links)
    *   Integrated DOMPurify for HTML sanitization (security)
    *   Editor outputs clean HTML for database storage
*   **Programs CMS View (`/admin/programs`):**
    *   List view with DataTable showing all programs (name, code, difficulty, status, featured)
    *   Tabbed form with General (info, settings, flags) and Content (descriptions, WYSIWYG) tabs
    *   Supports CRUD operations: create, edit, delete programs
    *   Placeholder tabs for Schedules and Pricing (structure ready for implementation)
*   **Instructors CMS View (`/admin/instructors`):**
    *   List view with DataTable showing all instructors (name, role, status, featured)
    *   Tabbed form with General (personal info, contact, settings) and Bio (summary, full bio with WYSIWYG) tabs
    *   Supports CRUD operations: create, edit, delete instructors
    *   Placeholder tab for Specialties (structure ready for implementation)
*   **Extended adminApi.ts:**
    *   Added methods for pricingTiers, media, and specialties endpoints
    *   Enhanced TypeScript interfaces for all resources
    *   Filter support for media (folder, search, pagination) and pricing tiers (by program)
*   **Architecture Notes:**
    *   Following existing patterns: repository pattern, Result types, use case architecture
    *   All views use URL params for state (action=new, action=edit&id=123) for deep linking
    *   Forms validate on submit with error display per field
    *   Both views follow Kinesis design system with theme support
*   **Pending Extensions:**
    *   MediaPicker component for image/video selection in forms
    *   Full Media Library view with upload UI
    *   Schedules & Pricing consolidated view
    *   React Query integration for optimistic updates and caching
    *   Zod schemas for runtime validation