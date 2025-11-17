# Kinesis Web + CMS Project Guide for Replit Agent

## Overview
This project is a modular monolith combining a public-facing website (`web/`), a Content Management System (CMS) backoffice (`cms/`), and a unified API (`api/`) for Kinesis. The primary goal is to build a clean, modular application within a single Replit instance, designed for future extraction of modules (especially the API) into microservices with minimal impact. The business domain (Kinesis) is thoroughly documented in `/context/*.md` files, which must be consulted for any business logic modifications.

## User Preferences
*   You can create, modify, and delete files in these folders: `core/`, `web/`, `cms/`, `api/`, `shared/`, `scripts/`, `docs/`, `tests/`.
*   You must treat as read-only (unless explicitly instructed): `context/`, sensitive configurations in `config/`, and deployment files (`.replit`, `replit.nix`), unless asked to modify them.
*   For large changes (new modules, major refactors, changes in API contracts), add an entry in `docs/CHANGELOG.md` with: Date, brief description of the change, and affected modules.
*   Do not mix layers (do not put domain logic in `presentation`, nor direct DB calls in `domain`).
*   Do not couple `web` and `cms` with each other: both must only communicate with `api` via HTTP.
*   Do not create new “mini APIs” outside of `api/`.
*   Whenever working on business logic, review the corresponding `/context` files and maintain consistency in terms, flows, and the data model.
*   Do not add new significant features without creating or updating related tests.
*   Use a single test command (e.g., `pnpm test`). If possible, execute it mentally/implicitly when designing changes, and respect the defined structure.
*   Do not delete existing tests unless there is a clear reason (e.g., an entire functionality is removed) and document the change in the `CHANGELOG`.

## System Architecture

### General Architecture
The project follows a modular monolith pattern with three decoupled areas: `web/` (public frontend), `cms/` (backoffice frontend), and `api/` (backend). Communication between domain modules occurs via in-process Event-Driven Architecture (EDA) using a central event bus in `core/`. The `api/` folder is designed to be migratable to a microservice with minimal changes to its `domain/` and `application/` layers.

### Directory Structure
The project adheres to a strict directory structure:
*   `core/`: In-process EDA (event bus, shared kernels).
*   `web/`: Public frontend (domain, application, infrastructure, presentation).
*   `cms/`: CMS backoffice frontend (domain, application, infrastructure, presentation).
*   `api/`: Backend, designed for DDD (domain, application, infrastructure, interfaces for HTTP, jobs, subscribers).
*   `shared/`: Reusable code across `web`/`cms`/`api` (UI, utils, shared types).
*   `config/`: Environment and application configurations.
*   `scripts/`: Seeds, migrations, tooling.
*   `docs/`: Functional/technical documentation, ADRs, CHANGELOG.
*   `tests/`: E2E / cross-module integration tests.
*   `context/`: Read-only functional context and business documentation.

### Technology Stack
*   **Language:** TypeScript across the entire project.
*   **Backend (`/api`):**
    *   Runtime: Node.js.
    *   HTTP Framework: Fastify (Express acceptable).
    *   Validation: Zod for DTOs.
    *   Data Access: Adapters in `api/infrastructure/db`.
    *   EDA: In-process event bus in `core/bus`.
*   **Frontends (`/web`, `/cms`):**
    *   Library: React.
    *   Bundler: Vite.
    *   Routing: React Router.
    *   Styling: Tailwind CSS (and optionally shadcn/ui).
    *   Remote State: React Query.
    *   Forms/Validation: React Hook Form + Zod.
*   **Testing:** Vitest for unit and integration tests.

### Design Patterns and Layer Responsibilities
*   **`domain/`:** Object-Oriented DDD, containing entities, value objects, aggregates, pure business logic, and domain events. Uses result types to avoid exceptions.
*   **`application/`:** Functional/light-imperative, orchestrates use cases, publishes domain events via `core/bus`, defines repository and external service interfaces (ports).
*   **`infrastructure/`:** Imperative, implements interfaces from `application/`, adapts Replit services (DB, Auth, App Storage), maps domain models to persistence schemas.
*   **`presentation/` (web/cms) & `interfaces/` (api):**
    *   `web/presentation` and `cms/presentation`: UI components, pages, routes, orchestrate UI logic by calling `application/` use cases.
    *   `api/interfaces/http`: HTTP controllers, DTOs, Zod validation.
    *   `api/interfaces/jobs` and `api/interfaces/subscribers`: Scheduled jobs, event subscribers.

### UI/UX Decisions
*   **Styling:** Tailwind CSS is the primary styling framework, with `shadcn/ui` as an optional component library. This ensures a consistent and modern aesthetic.
*   **Component Reusability:** The `shared/ui` folder is designated for eventually housing shared UI components, promoting consistency across `web` and `cms`.
*   **User Flows:** Functional specifications and implementation guides in `/context` detail user flows, navigation, and content presentation for both the public website and the CMS.

### Project Ambitions
The project aims for a scalable, maintainable application with clear separation of concerns, ready for future evolution into a microservices architecture. It leverages Replit's integrated tools while maintaining portability through careful abstraction of infrastructure concerns.

## External Dependencies

*   **Database:** Replit's integrated SQL Database (PostgreSQL serverless). The schema is defined in `context/kinesis-database-schema.sql`.
*   **Authentication:** Replit Auth.
*   **File Storage:** Replit App Storage for files (images, generated assets).
*   **Runtime Environment:** Node.js.