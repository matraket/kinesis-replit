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
