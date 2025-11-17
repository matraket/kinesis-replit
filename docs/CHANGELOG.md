# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
