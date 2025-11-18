# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - T7: Dashboard y Estructura Base del CMS (November 2025)

#### Overview
Implemented a comprehensive dashboard for the CMS with KPI visualizations and lead metrics, along with a reusable UI component library in `shared/ui/`. The navigation system was refactored to use configuration-based routing, and branding now dynamically loads from the settings API with fallbacks.

#### Shared UI Components (`shared/ui/`)

**DataTable Component**:
- Generic TypeScript component with full typing support `<TData>`
- Features: Column sorting, pagination, row selection, empty states
- Configurable columns with custom render functions
- Loading skeleton states
- Responsive design with mobile support
- Minimum row height of 44px for accessibility
- Theme-aware styling using admin design tokens

**FilterSidebar Component**:
- Supports multiple filter types: checkboxes, radios, date ranges
- Desktop: Fixed sidebar panel
- Mobile: Slide-out drawer with overlay
- Apply and reset filter actions
- Theme-aware styling with smooth transitions

**Form Components**:
- `Form`: Wrapper with title, description, and column layout (1 or 2 columns)
- `FormField`: Label, input wrapper, error display, required indicator
- `FormActions`: Primary and secondary buttons with loading states
- Consistent styling across all form elements

#### Navigation Configuration

**Navigation System**:
- Centralized configuration in `cms/src/app/config/navigation.ts`
- Structure: Groups > Items with enabled/disabled flags
- Each item: id, label, path, icon, section, isEnabled
- AdminLayout now reads from config instead of hardcoded values
- Easy to extend and maintain navigation structure

**Navigation Groups**:
- Panel: Dashboard
- Contenido: Programas, Instructores, Modelos de Negocio, Páginas, FAQs
- Operación: Leads
- Configuración: Ajustes

#### Dynamic Branding

**Branding Features**:
- Fetches settings from `/api/admin/settings` on layout mount
- Displays site name and CMS logo from settings
- Fallback to "Kinesis" name and initials badge if settings unavailable
- Logo displayed as 32x32px image or accent-colored initial badge
- Subtitle "CMS" below brand name
- Error handling with graceful fallbacks

#### Dashboard Implementation

**KPIs Displayed**:
1. **Leads nuevos (últimos 7 días)**: Count of leads with status 'new' from last 7 days
2. **Leads por tipo (últimos 30 días)**: Breakdown by lead_type (contact, pre_enrollment, elite_booking)
3. **Embudo de conversión**: Visual funnel showing lead status distribution (new, contacted, qualified, converted, lost)

**Dashboard Features**:
- 4 KPI cards with icons and color coding
- Conversion funnel with horizontal progress bars and percentages
- Recent leads table using DataTable component (15 leads per page)
- Table columns: Fecha, Nombre, Tipo, Estado, Origen
- Status badges with color coding
- Real-time data loading with skeleton states
- Error handling without breaking UI
- Pagination support

**Data Loading**:
- Parallel API calls for efficiency (3 simultaneous requests)
- Filters leads by date ranges for KPIs
- Aggregates data client-side for funnel visualization
- Automatic refresh on component mount
- Loading states during data fetch

#### API Enhancements

**Extended adminApi.ts**:
- Added TypeScript types: `Lead`, `LeadType`, `LeadStatus`, `Settings`
- Added `LeadsFilters` interface for filtering support
- Extended leads methods with filter parameters
- Enhanced settings methods with proper typing
- Support for pagination, date filtering, status filtering

**Filter Parameters**:
- lead_type: Filter by type (contact, pre_enrollment, elite_booking)
- lead_status: Filter by status (new, contacted, qualified, converted, lost)
- created_after/before: Date range filtering
- source: Filter by lead source
- page/pageSize: Pagination

#### TypeScript Configuration

**Shared Library**:
- Created `shared/tsconfig.json` for UI component library
- Enabled JSX support with "react-jsx"
- Strict mode enabled for type safety
- Includes UI components and config files

#### Accessibility & Design

**Accessibility Features**:
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states with purple outline (2px offset)
- Semantic HTML elements
- Screen reader friendly status badges
- Minimum touch target sizes (44px)

**Theme Support**:
- All components use admin theme tokens
- Supports Light and Dark modes
- Smooth transitions between theme changes
- Consistent color palette across dashboard and tables

#### Files Created/Modified

**New Files**:
- `shared/ui/data-table/DataTable.tsx`
- `shared/ui/data-table/types.ts`
- `shared/ui/filter-sidebar/FilterSidebar.tsx`
- `shared/ui/filter-sidebar/types.ts`
- `shared/ui/form/Form.tsx`
- `shared/ui/form/FormField.tsx`
- `shared/ui/form/FormActions.tsx`
- `shared/ui/form/types.ts`
- `shared/ui/index.ts`
- `shared/tsconfig.json`
- `cms/src/app/config/navigation.ts`

**Modified Files**:
- `cms/src/app/layout/AdminLayout.tsx`: Navigation config + branding
- `cms/src/app/routes/DashboardRoute.tsx`: Full dashboard implementation
- `cms/src/app/api/adminApi.ts`: Extended with types and filter support

#### Architecture Decisions

**Component Library**:
- Placed in `shared/ui/` for future reuse across web and cms
- Generic components with TypeScript generics
- Props-based configuration for flexibility
- No business logic in UI components (pure presentation)

**Configuration Pattern**:
- Navigation defined as data structure (not JSX)
- Easy to enable/disable menu items
- Supports future dynamic menu generation
- Clear separation of routing config and component logic

**Data Fetching Strategy**:
- Load dashboard data on component mount
- Parallel API calls for performance
- Client-side aggregation for derived metrics
- Error boundaries prevent UI breakage
- Optimistic loading states

#### Business Rules

**Dashboard KPIs**:
- "Leads nuevos" counts only status='new' from last 7 days
- Type breakdown uses last 30 days of data
- Conversion funnel shows all-time status distribution
- Recent table shows latest leads regardless of status

**Navigation**:
- Only enabled items (isEnabled=true) are displayed
- Active route highlighted with accent color
- Mobile menu automatically closes on navigation
- Logout button always at bottom of sidebar

#### Future Enhancements

**Components**:
- Add DataTable column filtering
- Add DataTable export to CSV functionality
- Add DateRangePicker component
- Add Select and MultiSelect form components
- Add Toast notification system

**Dashboard**:
- Add date range selector for KPIs
- Add lead source breakdown chart
- Add conversion rate trends over time
- Add quick actions (create lead, export data)
- Add real-time updates via WebSocket

---

### Added - T5: Legal Pages, Settings, and Leads Management API (November 2025)

#### Overview
Implemented comprehensive CRUD operations for legal pages management, site settings configuration, and leads administration with public POST-only endpoints for lead capture forms. This milestone extends T2-T4 functionality with versioned legal documents, flexible JSON settings storage, and complete lead lifecycle management.

#### Domain Layer
- **Extended LegalPage Entity**: Added `updateLegalPage` function for version management
- **New Setting Entity**: Created with JSON value storage and type categorization (site, email, social, analytics)
- **Reused Lead Entity**: No modifications needed, existing entity supports all required use cases

#### Application Layer
- **Extended ILegalPageRepository**:
  - Added CRUD methods: `create`, `update`, `delete`, `list`, `findById`, `findByType`
  - Automatic current version management
  - Standard page type protection
  
- **New ISettingsRepository**:
  - Methods: `create`, `updateByKey`, `findByKey`, `list`
  - Flexible JSON value storage
  - Type-based filtering
  
- **Extended LeadsRepository**:
  - Admin methods: `listWithFilters`, `getLeadById`, `updateStatus`, `updateNotes`
  - Multi-criteria filtering (type, status, date range, source, campaign)
  - Pagination support

#### Infrastructure Layer
- **PostgresLegalPageRepository**:
  - Full CRUD implementation
  - Automatic `isCurrent` flag management (sets previous versions to false)
  - Protection for standard types (legal, privacy, cookies, terms)
  - Version control support
  
- **PostgresSettingsRepository**:
  - Key-based CRUD operations
  - JSON value storage with JSONB column type
  - Type-based filtering
  - Update tracking (updatedAt, updatedBy)
  
- **PostgresLeadsRepository**:
  - Advanced filtering with dynamic SQL building
  - Status workflow tracking
  - Notes and contact management
  - Pagination implementation

#### API Endpoints

**Admin Legal Pages** (`/api/admin/legal-pages`):
- `GET /legal-pages` - List with optional type filter
- `GET /legal-pages/:id` - Get by ID
- `GET /legal-pages/type/:pageType` - Get latest by type
- `POST /legal-pages` - Create (auto-manages isCurrent flag)
- `PUT /legal-pages/:id` - Update
- `DELETE /legal-pages/:id` - Delete (protected for standard types)

**Admin Settings** (`/api/admin/settings`):
- `GET /settings` - List with optional type filter
- `GET /settings/:key` - Get by key
- `POST /settings` - Create
- `PUT /settings/:key` - Update value

**Admin Leads** (`/api/admin/leads`):
- `GET /leads` - List with filters (type, status, dates, source, campaign, pagination)
- `GET /leads/:id` - Get by ID
- `PATCH /leads/:id/status` - Update status with notes and contact tracking
- `PATCH /leads/:id/notes` - Update notes

**Public Lead Capture** (`/api/public/leads/*`):
- `POST /leads/contact` - General contact form
- `POST /leads/pre-enrollment` - Student enrollment inquiries
- `POST /leads/elite-booking` - Premium session bookings
- `POST /leads/wedding` - Wedding choreography requests

#### Data Tracking & Security

**Automatic Capture on Public Endpoints**:
- IP address (for fraud prevention)
- User agent (device/browser information)
- UTM parameters (source, medium, campaign, term, content)
- Source tagged as 'web'
- Initial status set to 'new'

**Lead Status Workflow**:
- `new` → `contacted` → `qualified` → `converted` or `lost`
- Each status update tracked with timestamp
- Optional notes and contactedBy tracking

**Protection Rules**:
- Cannot delete standard legal page types (create new versions instead)
- All admin endpoints require `X-Admin-Secret` header
- Public endpoints are POST-only (no data exposure via GET)
- Input validation via Zod schemas on all endpoints

#### Validation & Schemas

**Zod Schemas Created**:
- `legalPageSchemas.ts`: Create/Update validation with date transformation
- `settingSchemas.ts`: Create/Update validation with JSON value support
- `leadSchemas.ts`: Admin filtering and update validation
- `leads.schemas.ts`: Public form validation (contact, pre-enrollment, elite-booking, wedding)

**Validation Features**:
- Email format validation
- Phone number format
- Time format (HH:MM) for bookings
- Age constraints (3-100) for pre-enrollment
- Required field enforcement
- UTM parameter optional capture

#### Controllers

**Admin Controllers**:
- `LegalPagesController`: CRUD operations with version control
- `SettingsController`: Key-based configuration management
- `LeadsController`: Lead lifecycle management

**Public Controllers**:
- `LeadsController` (public): Form submissions with auto-tagging and tracking

#### Tests

**Domain Tests** (3 test suites, 32 tests):
- `LegalPage.test.ts`: 13 tests for create/update functions
- `Setting.test.ts`: 13 tests for create/update with JSON values
- `Lead.test.ts`: 6 tests for lead creation with various types

**Integration Tests** (4 test suites, 45+ tests):
- `admin-legal-pages.test.ts`: Full CRUD + version control + protection
- `admin-settings.test.ts`: CRUD + JSON value handling + type filtering
- `admin-leads.test.ts`: Listing, filtering, status workflow, notes management
- `public-leads.test.ts`: All form types, validation, UTM tracking

**Test Coverage**:
- Full CRUD operations for all resources
- Version control and isCurrent flag management
- Standard type protection
- Status workflow lifecycle
- Multi-criteria filtering
- JSON value storage and retrieval
- Input validation and error handling
- UTM parameter capture

#### Business Rules

**Legal Pages**:
- Only one page can be `isCurrent=true` per page type
- Creating/updating with `isCurrent=true` automatically unsets others
- Standard types (legal, privacy, cookies, terms) cannot be deleted
- Version history maintained for compliance

**Settings**:
- JSON values allow flexible configuration storage
- Settings organized by type (site, email, social, analytics)
- Update tracking for audit trail

**Leads**:
- All new leads start with status 'new'
- Status progression: new → contacted → qualified → converted/lost
- Notes append to existing notes for activity history
- Contact tracking (contactedAt, contactedBy) for follow-up management

#### Routes Integration

**Admin Routes** (`api/interfaces/http/admin/routes/index.ts`):
- Registered `registerLegalPagesRoutes`
- Registered `registerSettingsRoutes`
- Registered `registerLeadsRoutes`

**Public Routes** (`api/interfaces/http/public/routes/index.ts`):
- Registered `leadsRoutes` under `/leads` prefix

#### Documentation

**Updated Documentation**:
- `docs/api-admin-endpoints.md`: Added T5 admin endpoints (legal pages, settings, leads)
- `docs/api-public-endpoints.md`: Added lead capture forms documentation
- `docs/CHANGELOG.md`: Comprehensive T5 implementation details
- `replit.md`: Updated with T5 architecture summary

**Documentation Includes**:
- Complete endpoint specifications
- Request/response examples
- Validation rules
- Business logic explanations
- Error handling
- Security considerations

#### Architecture Highlights

- **Hexagonal Architecture**: Maintained clean separation across all layers
- **Domain Purity**: Extended existing entities without breaking changes
- **Repository Pattern**: Consistent interface implementations
- **Result Type Pattern**: Comprehensive error handling
- **Zod Validation**: Type-safe request validation
- **Dependency Injection**: Constructor-based injection throughout

#### Backward Compatibility

- **Zero Breaking Changes**: All T2/T3/T4 endpoints unchanged
- **No Schema Modifications**: Reused existing database tables
- **Extended Repositories**: Added methods without modifying existing ones
- **Preserved Behaviors**: All existing functionality works identically
- **API Compatibility**: Public API remains fully backward compatible

#### Future Enhancements (T6 Considerations)

- JWT-based authentication for admin endpoints
- Role-based access control (RBAC)
- Lead assignment and ownership
- Automated lead scoring
- Email notifications for lead events
- Legal page approval workflow
- Settings versioning and rollback
- Bulk lead operations

---

### Added - T4: Admin API for Business Models, Pages, and FAQs

#### Overview
Implemented complete CRUD operations for Business Models, Page Content, and FAQs through the admin API with content protection rules and backward compatibility with T2 public API.

#### Domain Layer
- Extended existing domain entities:
  - `BusinessModel`: Already existed from T2
  - `PageContent`: Already existed from T1
  - `FAQ`: Already existed from T2

#### Application Layer
- **Extended Repository Interfaces**:
  - `IBusinessModelRepository`: Added `create`, `update`, `delete`, `findById`, `listAll` methods
  - `IPageContentRepository`: Added `create`, `update`, `delete`, `findById`, `findByPageKey`, `listAll` methods
  - `IFAQRepository`: Added `create`, `update`, `delete`, `findById`, `listAll` methods

- **Use Cases** (18 new use cases):
  - **Business Models**: `CreateBusinessModel`, `UpdateBusinessModel`, `DeleteBusinessModel`, `ListBusinessModelsForAdmin`, `GetBusinessModelById`
  - **Page Content**: `CreatePageContent`, `UpdatePageContent`, `DeletePageContent`, `ListPagesForAdmin`, `GetPageContentById`, `GetPageContentByKey`
  - **FAQs**: `CreateFaq`, `UpdateFaq`, `DeleteFaq`, `ListFaqsForAdmin`, `GetFaqById`

#### Infrastructure Layer
- **Extended PostgreSQL Repositories** with business rule enforcement:
  - `PostgresBusinessModelRepository`:
    - Full CRUD implementation
    - **Protection**: Cannot delete critical business models (`elite_on_demand`, `ritmo_constante`, `generacion_dance`, `si_quiero_bailar`)
    - Suggestion: Use `isActive=false` or `showOnWeb=false` instead of deletion
  
  - `PostgresContentRepository`:
    - Full CRUD implementation
    - **Protection**: Cannot delete critical pages (`home`, `about-us`, `business-models`)
    - Suggestion: Use `status='draft'` or `status='archived'` instead of deletion
  
  - `PostgresFAQRepository`:
    - Full CRUD implementation
    - No deletion protection (no critical FAQs)

#### API Endpoints
All endpoints under `/api/admin` prefix with `X-Admin-Secret` authentication:

**Business Models:**
- `GET /api/admin/business-models` - List all business models with filters (isActive, showOnWeb, pagination)
- `GET /api/admin/business-models/:id` - Get business model by ID
- `POST /api/admin/business-models` - Create new business model (requires: internalCode, name, description, slug)
- `PUT /api/admin/business-models/:id` - Update business model (all fields optional)
- `DELETE /api/admin/business-models/:id` - Delete business model (protected for critical models)

**Page Content:**
- `GET /api/admin/pages` - List all pages with filters (status, pageKey, pagination)
- `GET /api/admin/pages/:id` - Get page by ID
- `GET /api/admin/pages/by-key/:pageKey` - Get page by pageKey
- `POST /api/admin/pages` - Create new page (requires: pageKey, pageTitle, slug)
- `PUT /api/admin/pages/:id` - Update page (all fields optional)
- `DELETE /api/admin/pages/:id` - Delete page (protected for critical pages)

**FAQs:**
- `GET /api/admin/faqs` - List all FAQs with filters (category, isActive, pagination)
- `GET /api/admin/faqs/:id` - Get FAQ by ID
- `POST /api/admin/faqs` - Create new FAQ (requires: question, answer)
- `PUT /api/admin/faqs/:id` - Update FAQ (all fields optional)
- `DELETE /api/admin/faqs/:id` - Delete FAQ

#### Validation & Security
- Zod validation schemas for all endpoints:
  - `businessModelSchemas.ts`: Create and update validation
  - `pageContentSchemas.ts`: Create and update validation
  - `faqSchemas.ts`: Create and update validation
- Slug field is **required** for Business Models and Pages (important for SEO)
- Content protection at repository level (prevents accidental deletion of critical content)
- All endpoints protected with `X-Admin-Secret` header authentication

#### Controllers
- `BusinessModelsController`: Handles all business model admin operations
- `PageContentController`: Handles all page content admin operations
- `FaqsController`: Handles all FAQ admin operations

#### Tests
- **Domain Tests** (15 tests, all passing):
  - `PostgresBusinessModelRepository.test.ts`: Tests for critical model protection and CRUD operations
  - `PostgresContentRepository.test.ts`: Tests for critical page protection and CRUD operations
- **Integration Tests** (3 test suites):
  - `admin-business-models.test.ts`: Complete CRUD flow + public API compatibility
  - `admin-page-content.test.ts`: Complete CRUD flow + public API compatibility
  - `admin-faqs.test.ts`: Complete CRUD flow + public API compatibility
- All tests verify that public API (`/api/public/**`) continues working after admin operations

#### Business Rules & Content Protection
1. **Critical Business Models Protection**:
   - Models with codes `elite_on_demand`, `ritmo_constante`, `generacion_dance`, `si_quiero_bailar` cannot be deleted
   - Alternative: Set `isActive=false` or `showOnWeb=false`
   - Error message clearly explains the restriction and suggests alternatives

2. **Critical Pages Protection**:
   - Pages with keys `home`, `about-us`, `business-models` cannot be deleted
   - Alternative: Set `status='draft'` or `status='archived'`
   - Error message clearly explains the restriction and suggests alternatives

3. **Public API Compatibility**:
   - Business models with `isActive=true` and `showOnWeb=true` appear in public API
   - Pages with `status='published'` appear in public API
   - FAQs with `isActive=true` appear in public API

#### Documentation
- Updated `docs/api-admin-endpoints.md` with T4 endpoints
- Added "Content Protection Rules" section explaining critical content
- All endpoint formats, request/response examples, and error cases documented
- Updated `docs/CHANGELOG.md` with T4 implementation details

#### Architecture
- Follows hexagonal architecture: Domain → Application → Infrastructure → Interfaces
- Repository pattern with extended interfaces
- Use case pattern for business logic
- Result type pattern for consistent error handling
- Dependency injection via constructors
- Separation of concerns maintained throughout

#### Backward Compatibility
- **Zero breaking changes** to existing T2 public API
- **No modifications** to existing database schema (only added methods to repositories)
- Extended repositories without modifying existing public methods
- Preserved all existing domain entities and behaviors
- Public API continues to function exactly as before

#### Notes
- Slug field changed from optional to required in CreateBusinessModelInput and CreatePageContentInput (important for SEO and URL generation)
- Content protection is enforced at repository level, not controller level (deeper in the architecture for better security)
- Admin authentication remains basic (X-Admin-Secret header) - production-grade JWT auth planned for T6

---

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
