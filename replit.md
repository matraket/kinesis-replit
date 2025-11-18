### Kinesis Web + CMS Project Guide for Replit Agent
This guide defines the conventions, architecture, and constraints for the Kinesis Web + CMS modular monolith project, currently running on Replit. The Agent **must** adhere strictly to these rules.

#### Overview
This project is a **modular monolith** combining a public-facing website (`web/`), a Content Management System (CMS) backoffice (`cms/`), and a unified API (`api/`). It is built entirely in **TypeScript**. The architecture is designed for future transition to microservices (especially the `api/` module) with minimal changes to the core domain logic.

The core business philosophy of Kinesis (precision, innovation, structured flows) should be reflected in the professional and clean technical implementation.

#### User Preferences & Constraints
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

#### Coding Conventions & Naming Standards
**Adhere strictly to the following conventions for all new or modified code**:

| Element | Convention | Examples |
| :--- | :--- | :--- |
| **Classes, Interfaces, Types, React Components** | **PascalCase** | `User`, `CourseLead`, `MainLayout`, `LeadForm`, `PricingTier` |
| **Functions, Variables, Properties, Methods** | **camelCase** | `createLead`, `handleSubmit`, `userRepository`, `isActive`, `calculatePrice` |
| **Constants, Environment Variables** | **UPPER_SNAKE_CASE** | `MAX_RETRY_COUNT`, `REPLIT_DB_URL`, `APP_ENV` |
| **Files and Routes** | **kebab-case** | `create-lead.tsx`, `course-detail.ts`, `/course-list`, `/admin/courses` |
| **Database Fields/External Schemas** | **snake_case** | **Only** when mapping to external schemes (e.g., PostgreSQL table fields or external APIs). Map these to internal `camelCase` models in `infrastructure/`. |

**Style Guidelines:**
*   Use TypeScript with explicit typing at all borders (HTTP interfaces, repositories, events).
*   Prefer functional React components with hooks over class components.

#### System Architecture
##### Design Patterns and Layer Responsibilities
The project is built using Clean Architecture principles combined with Domain-Driven Design (DDD):
*   **`domain/`**: Pure **OO + DDD**. Contains Entities, Value Objects, Aggregates, pure business logic, and Domain Events. Must be framework-agnostic.
*   **`application/`**: Functional/light-imperative. Orchestrates Use Cases, defines interfaces (Ports) for repositories and external services, and publishes events to `core/bus`.
*   **`infrastructure/`**: Imperative. Implements the Repository interfaces defined in `application/`, adapts Replit services, and handles mapping between domain models and persistence schemas.
*   **`presentation/` (web/cms) & `interfaces/` (api)**: Handles UI, routes, HTTP controllers, and **Zod validation** for DTOs. Orchestrates UI logic by calling Use Cases in `application/`.

##### UI/UX Decisions
*   **Styling:** **Tailwind CSS** is primary. **shadcn/ui** is acceptable for components.
*   **Component Structure:** The `shared/ui` folder is reserved for reusable UI components used across `web/` and `cms/`.
*   **Mobile:** The approach must be **Mobile First**. Implement responsive design using breakpoints and specific adaptations for mobile (e.g., full-screen modals, hamburger menus).

#### External Dependencies
All access to external infrastructure **must be encapsulated in `api/infrastructure/`**.
*   **Database:** Replit's integrated **SQL Database (PostgreSQL serverless)**. The data model reference is `context/kinesis-database-schema.sql` (Note: this is a conceptual schema, not an active migration file).
*   **Authentication:** Replit Auth.
*   **File Storage:** Replit App Storage for assets.
*   **Secrets:** Never hard-code sensitive data. Use **Replit Secrets** environment variables (e.g., `DATABASE_URL`).

#### Execution & Deployment Flow
The entire application must run as a modular monolith within a single Replit instance.

The `.replit` file must use the `dev` script as the main Run command and must not be changed unless explicitly instructed by the user.

**Critical Constraint:** The Node.js server in `api/` must serve both the **API** (`/api/**` routes) and the **static assets** for both `web/` and `cms/` from a **single public port** (`process.env.PORT`).

*   **Development (`dev` script):** Must start the backend in `api/` and the frontends (`web`, `cms`) in development mode, using a single Node server that exposes `/api/**` and serves the assets of `web` and `cms`.
*   **Production (`start` script):** Must generate the static bundles (`build` script) and then start the Node server in `api/` to serve `/api/**` and the static bundles (e.g., `/` for public web and `/admin` for the CMS).
*   **Environment Variables:** Must use `process.env.PORT` to start the server.

#### Testing & Quality Assurance
**Minimum Testing Scope (Obligatory)**:
*   **Unit Tests:** Must be implemented for key Use Cases in `api/domain/` and `api/application/`.
*   **Integration Tests:** Must cover critical flows, such as:
    *   Lead creation via the API (HTTP request through to DB persistence and event emission).
    *   Main login and core flows of the CMS.

**Test Location:**
*   Unit tests can be placed near the code (`*.spec.ts` / `*.test.ts`) or in `__tests__` subfolders.
*   Integration and E2E tests belong in the root `/tests` folder.

**Agent's Rule on Testing:**
*   **Do not introduce new significant features without creating or updating related tests**.
*   If existing tests are deleted (only allowed if functionality is entirely removed), this change **must be documented in `docs/CHANGELOG.md`**.

#### Recent Changes

##### Public Read-Only API (T2) - November 2025
**Implementation Status:** Complete - Database provisioned and migrations executed successfully

A comprehensive public API has been implemented following Clean Architecture principles with 7 resource endpoints under `/api/public`:

**Resources Implemented:**
1. Business Models - List and get by slug
2. Programs - List with filters (businessModelSlug, specialtyCode, difficulty) and pagination
3. Instructors - List with filters (featured, specialtyCode) and pagination
4. Pricing Tiers - List with filters (businessModelSlug, programSlug)
5. Page Content - Get by slug
6. FAQs - List with filters (category, businessModelSlug) and pagination
7. Legal Pages - List and get by slug

**Architecture:**
- Clean Architecture: Domain → Application → Infrastructure → Interfaces
- All endpoints validated with Zod schemas
- Read-only (GET only), returns published/active content only
- Error handling with Result type pattern (no exceptions)
- Unit tests (2) and integration tests (3) implemented

**Database Setup (Completed - November 17, 2025):**
- PostgreSQL database provisioned using Replit's integrated Neon database
- Extensions enabled: uuid-ossp, pgcrypto
- Migrations executed successfully:
  - `scripts/sql/01_init_core_schema.sql` - Core tables (programs, schedules, page_content, leads)
  - `scripts/sql/02_public_api_schema.sql` - Public API tables (business_models, specialties, instructors, pricing_tiers, faqs, legal_pages)
- Database connection verified via `/health` endpoint
- All 11 tables created with proper indexes and triggers

**Documentation:**
- API endpoints: `docs/api-public-endpoints.md`
- Change history: `docs/CHANGELOG.md`
- Migration files: `scripts/sql/01_init_core_schema.sql`, `scripts/sql/02_public_api_schema.sql`

##### Admin API for CMS CRUD Operations (T3) - November 2025
**Implementation Status:** Complete - Admin endpoints fully functional

A comprehensive admin API has been implemented following Clean Architecture principles with full CRUD operations under `/api/admin`:

**Resources Implemented:**
1. Specialties - Full CRUD operations for dance specialties management
2. Instructors - Full CRUD operations for instructor profiles with specialty assignments
3. Programs - Full CRUD operations for program management with relationship handling
4. Pricing Tiers - Full CRUD operations for pricing tier management

**Architecture:**
- Clean Architecture maintained: Domain → Application → Infrastructure → Interfaces
- All endpoints validated with Zod schemas
- CRUD operations (Create, Read, Update, Delete) with business rule enforcement
- Error handling with Result type pattern
- Basic authentication via X-Admin-Secret header (placeholder for T6)

**Key Features:**
- Business rule enforcement: Prevent deletion of resources with dependencies
- Unique code validation for specialties
- Referential integrity checks before deletions
- Pagination and filtering support on all list endpoints
- Comprehensive validation using Zod schemas

**Authentication:**
- Header-based authentication using `X-Admin-Secret`
- Environment variable: `ADMIN_SECRET` (default: "change-me-in-production")
- Note: Basic auth is a placeholder - production-grade JWT/RBAC planned for T6

**Documentation:**
- API endpoints: `docs/api-admin-endpoints.md`
- Comprehensive changelog: `docs/CHANGELOG.md`
- All endpoints include request/response examples and error handling documentation

**Backward Compatibility:**
- No modifications to existing T2 public API endpoints
- No breaking changes to database schema
- Extended existing repositories without modifying public methods

##### T5 API Extensions - Admin CRUD for Legal Pages, Settings, and Leads Management (November 2025)
**Implementation Status:** Complete - All endpoints functional and integrated

This milestone extends the admin API with comprehensive CRUD operations for legal pages, settings management, and leads administration, plus public POST-only endpoints for lead capture forms.

**Admin Endpoints Implemented:**

1. **Legal Pages Admin** (`/api/admin/legal-pages`)
   - List all legal pages with optional filtering by type
   - Get legal page by ID
   - Get latest legal page by type
   - Create new legal page version (auto-versioning)
   - Update existing legal page
   - Delete legal page (protected for standard types)
   - Features: Version control, current flag management, protected standard types

2. **Settings Admin** (`/api/admin/settings`)
   - List all settings with optional filtering by type
   - Get setting by key
   - Create new setting
   - Update setting value by key
   - Features: JSON value storage, type categorization (site, email, social, analytics)

3. **Leads Admin** (`/api/admin/leads`)
   - List all leads with comprehensive filtering (type, status, date range, source, campaign)
   - Get lead by ID with full details
   - Update lead status with notes and contact tracking
   - Update lead notes independently
   - Features: Pagination, multi-criteria filtering, status workflow tracking

**Public Lead Capture Endpoints:**

1. **Contact Form** (`POST /api/public/leads/contact`)
   - General contact inquiries
   - Required: firstName, lastName, email, message
   - Optional: phone, marketing consent, UTM tracking

2. **Pre-Enrollment Form** (`POST /api/public/leads/pre-enrollment`)
   - Student enrollment inquiries
   - Required: firstName, lastName, email, studentName, studentAge
   - Optional: previousExperience, interestedInPrograms, preferredSchedule, UTM tracking

3. **Elite Booking Form** (`POST /api/public/leads/elite-booking`)
   - Premium session booking requests
   - Required: firstName, lastName, email, preferredDate, preferredTime
   - Optional: sessionType (individual/couple/group), message, UTM tracking

4. **Wedding Choreography** (`POST /api/public/leads/wedding`)
   - Specialized wedding dance inquiries
   - Required: firstName, lastName, email, preferredDate, preferredTime
   - Optional: message, UTM tracking
   - Auto-tags as 'couple' sessionType and adds 'wedding-choreography' to programs

**Architecture Details:**

Domain Layer:
- Extended `LegalPage` entity with update functions
- Created `Setting` entity with JSON value handling
- Reused existing `Lead` domain entity (no modifications needed)

Application Layer:
- Extended `ILegalPageRepository` with full CRUD methods
- Created `ISettingsRepository` interface
- Extended `LeadsRepository` with admin query methods

Infrastructure Layer:
- Extended `PostgresLegalPageRepository` with CRUD operations
- Implemented `PostgresSettingsRepository`
- Extended `PostgresLeadsRepository` with filtering and admin features

Interface Layer:
- Zod schemas for all admin and public endpoints
- Controllers: `LegalPagesController`, `SettingsController`, `LeadsController` (admin + public)
- Routes registered under `/api/admin/*` and `/api/public/leads/*`

**Data Tracking Features:**
- All public lead submissions capture: IP address, user agent, UTM parameters
- Automatic source tagging as 'web' for public submissions
- Lead status workflow: new → contacted → qualified → converted/lost
- Notes and contact tracking for admin follow-up

**Security:**
- All admin endpoints protected by `X-Admin-Secret` header middleware
- Public endpoints are POST-only to prevent data exposure
- Input validation via Zod schemas on all endpoints
- SQL injection protection through parameterized queries

**Backward Compatibility:**
- No modifications to existing T2/T3/T4 endpoints
- No new database tables (reuses existing `legal_pages`, `settings`, `leads`)
- Extended existing repositories without breaking changes
- All existing functionality preserved and tested

**Documentation:**
- Admin endpoints documented in `docs/api-admin-endpoints.md`
- Public endpoints documented in `docs/api-public-endpoints.md`
- Changes tracked in `docs/CHANGELOG.md`
