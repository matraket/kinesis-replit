# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - T3: Admin API for CMS CRUD Operations

#### Domain Entities
- `Specialty`: New domain entity for dance specialties with factory function
  - Properties: code, name, description, category, icon, color, imageUrl, isActive, displayOrder
  - Business rules: Unique codes, prevent deletion when assigned to programs/instructors

#### Application Layer
- **Repository Interfaces** (extended/created):
  - `ISpecialtyRepository`: Full CRUD operations for specialties
  - Extended `IInstructorRepository`: Added create, update, delete, findById, listAll methods
  - Extended `ProgramsRepository`: Added create, update, delete, listAll methods
  - Extended `IPricingTierRepository`: Added create, update, delete, findById, listAll methods
  
- **Use Cases** for admin operations:
  - Specialties: Create, Update, Delete, List, GetById
  - Instructors: Create, Update, Delete, List, GetById
  - Programs: Create, Update, Delete, List, GetById
  - Pricing Tiers: Create, Update, Delete, List, GetById

#### Infrastructure Layer
- PostgreSQL repositories with full CRUD implementations:
  - `PostgresSpecialtyRepository`: Complete implementation with dependency checking
  - Extended `PostgresInstructorRepository`: CRUD operations + specialty assignments
  - Extended `PostgresProgramsRepository`: CRUD operations + relationship handling
  - Extended `PostgresPricingTierRepository`: CRUD operations
  
- Business rule enforcement:
  - Prevent specialty deletion if assigned to active programs or instructors
  - Prevent instructor deletion if assigned to active programs
  - Unique code validation for specialties
  - Referential integrity checks before deletions

#### API Endpoints
All endpoints under `/api/admin` prefix with `X-Admin-Secret` authentication:

**Specialties:**
- `GET /api/admin/specialties` - List all specialties with filters
- `GET /api/admin/specialties/:id` - Get specialty by ID
- `POST /api/admin/specialties` - Create new specialty
- `PUT /api/admin/specialties/:id` - Update specialty
- `DELETE /api/admin/specialties/:id` - Delete specialty

**Instructors:**
- `GET /api/admin/instructors` - List all instructors with filters
- `GET /api/admin/instructors/:id` - Get instructor by ID
- `POST /api/admin/instructors` - Create new instructor
- `PUT /api/admin/instructors/:id` - Update instructor
- `DELETE /api/admin/instructors/:id` - Delete instructor

**Programs:**
- `GET /api/admin/programs` - List all programs with filters
- `GET /api/admin/programs/:id` - Get program by ID
- `POST /api/admin/programs` - Create new program
- `PUT /api/admin/programs/:id` - Update program
- `DELETE /api/admin/programs/:id` - Delete program

**Pricing Tiers:**
- `GET /api/admin/pricing-tiers` - List all pricing tiers with filters
- `GET /api/admin/pricing-tiers/:id` - Get pricing tier by ID
- `POST /api/admin/pricing-tiers` - Create new pricing tier
- `PUT /api/admin/pricing-tiers/:id` - Update pricing tier
- `DELETE /api/admin/pricing-tiers/:id` - Delete pricing tier

#### Validation & Security
- Zod schemas for all admin endpoints with comprehensive validation
- Request body validation for create/update operations
- Query parameter validation with type coercion
- Basic authentication via `X-Admin-Secret` header (placeholder for T6)
- Environment variable: `ADMIN_SECRET` (default: "change-me-in-production")

#### Architecture
- Follows Clean Architecture principles
- Separation of concerns: Domain → Application → Infrastructure → Interfaces
- Repository pattern for data access abstraction
- Use case pattern for business logic encapsulation
- Dependency injection via constructor parameters
- Result type pattern for error handling

#### Documentation
- Created `docs/api-admin-endpoints.md` with complete API documentation
- Includes authentication requirements, request/response examples
- Documents business rules and error responses
- Notes for future enhancements (T6: JWT auth, RBAC)

#### Backward Compatibility
- **No modifications** to existing T2 public API endpoints
- **No breaking changes** to database schema
- Extended existing repositories without modifying public methods
- Preserved all existing domain entities and DTOs

#### Notes
- Admin authentication is basic (X-Admin-Secret header) - production-grade auth planned for T6
- Many-to-many relationship handling (program_specialties, instructor_specialties) implemented
- Relationship assignment methods (assignSpecialties, assignInstructors) ready for future use

### Added - T2: Public API for Read-Only Endpoints

#### Database Schema
- Created SQL migration `scripts/sql/02_public_api_schema.sql` with tables:
  - `business_models`: Business model definitions
  - `specialties`: Dance specialties
  - `instructors`: Instructor profiles
  - `instructor_specialties`: M:M relationship table
  - `pricing_tiers`: Pricing options for programs
  - `faqs`: Frequently asked questions
  - `legal_pages`: Legal documentation pages
- Added foreign key constraints to `programs` table for `business_model_id` and `specialty_id`

#### Domain Entities
- `BusinessModel`: Business model entity with content sections
- `Instructor`: Instructor profiles with bio and media
- `PricingTier`: Pricing tier options for programs
- `FAQ`: FAQ entity with categorization
- `LegalPage`: Legal page entity with versioning

#### Application Layer
- Repository interfaces for all new entities
- Use cases for public API:
  - Business Models: List and get by slug
  - Programs: List with filters (businessModelSlug, specialtyCode, difficulty) and pagination
  - Instructors: List with filters (featured, specialtyCode) and pagination
  - Pricing Tiers: List with filters (businessModelSlug, programSlug)
  - Page Content: Get by slug
  - FAQs: List with filters (category, businessModelSlug) and pagination
  - Legal Pages: List and get by slug

#### Infrastructure Layer
- PostgreSQL repositories for all entities:
  - `PostgresBusinessModelRepository`
  - `PostgresInstructorRepository`
  - `PostgresPricingTierRepository`
  - `PostgresFAQRepository`
  - `PostgresLegalPageRepository`
- Extended `PostgresProgramsRepository` with filtering and pagination
- Extended `PostgresContentRepository` to implement `IPageContentRepository`

#### API Endpoints
All endpoints under `/api/public` prefix:
- `GET /api/public/business-models` - List business models
- `GET /api/public/business-models/:slug` - Get business model by slug
- `GET /api/public/programs` - List programs with filters and pagination
- `GET /api/public/programs/:slug` - Get program by slug
- `GET /api/public/instructors` - List instructors with filters and pagination
- `GET /api/public/instructors/:slug` - Get instructor by slug
- `GET /api/public/pricing-tiers` - List pricing tiers with filters
- `GET /api/public/pages/:slug` - Get page content by slug
- `GET /api/public/faqs` - List FAQs with filters and pagination
- `GET /api/public/legal-pages` - List current legal pages
- `GET /api/public/legal-pages/:slug` - Get legal page by slug

#### Validation & DTOs
- Zod schemas for all endpoints with request validation
- Response DTOs for clean data serialization
- Query parameter validation with proper error messages

#### Tests
- Unit tests:
  - `ListBusinessModelsForPublicSite` use case
  - `GetProgramBySlug` use case
- Integration tests:
  - Business Models endpoint
  - Programs endpoint with filters
  - Instructors endpoint with pagination

#### Documentation
- `docs/api-public-endpoints.md`: Complete API documentation
- Query parameters, response formats, and error handling documented

#### Features
- Read-only public endpoints (GET only)
- Filter by published/active content only
- Pagination support with default limits
- Clean architecture with proper layer separation
- Comprehensive error handling with HTTP status codes
- No exposure of sensitive data or internal fields

### Technical Details
- Package added: `zod` for schema validation
- All endpoints follow REST conventions
- Database queries optimized with proper JOIN operations
- Consistent error response format across all endpoints
- Type-safe implementations with TypeScript

---

## Notes

This is the initial CHANGELOG for the Kinesis project. Future changes will be documented following this format.
