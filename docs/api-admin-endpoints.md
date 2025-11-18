# Admin API Endpoints Documentation

This document describes the internal admin API endpoints for the Kinesis CMS. All endpoints require authentication via the `X-Admin-Secret` header.

## Authentication

All admin endpoints require the `X-Admin-Secret` header:

```bash
X-Admin-Secret: <your-admin-secret>
```

The admin secret is configured via the `ADMIN_SECRET` environment variable (default: `change-me-in-production`).

## Base URL

All admin endpoints are mounted under: `/api/admin`

## Specialties

### List All Specialties
```
GET /api/admin/specialties?isActive=true&category=sports&page=1&limit=20
```

**Query Parameters:**
- `isActive` (optional): Filter by active status (true/false)
- `category` (optional): Filter by category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "BASKETBALL",
      "name": "Basketball",
      "description": "Learn basketball fundamentals",
      "category": "sports",
      "icon": "🏀",
      "color": "#FF6B35",
      "imageUrl": "https://...",
      "isActive": true,
      "displayOrder": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 20
}
```

### Get Specialty by ID
```
GET /api/admin/specialties/:id
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "code": "BASKETBALL",
    "name": "Basketball",
    ...
  }
}
```

### Create Specialty
```
POST /api/admin/specialties
```

**Request Body:**
```json
{
  "code": "BASKETBALL",
  "name": "Basketball",
  "description": "Learn basketball fundamentals",
  "category": "sports",
  "icon": "🏀",
  "color": "#FF6B35",
  "imageUrl": "https://...",
  "isActive": true,
  "displayOrder": 1
}
```

**Response:** 201 Created
```json
{
  "data": {
    "id": "uuid",
    "code": "BASKETBALL",
    ...
  }
}
```

### Update Specialty
```
PUT /api/admin/specialties/:id
```

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Basketball Name",
  "isActive": false
}
```

**Response:** 200 OK

### Delete Specialty
```
DELETE /api/admin/specialties/:id
```

**Response:** 204 No Content

**Note:** Cannot delete a specialty that is assigned to active programs or instructors.

## Instructors

### List All Instructors
```
GET /api/admin/instructors?isActive=true&showOnWeb=true&page=1&limit=20
```

**Query Parameters:**
- `isActive` (optional): Filter by active status
- `showOnWeb` (optional): Filter by web visibility
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get Instructor by ID
```
GET /api/admin/instructors/:id
```

### Create Instructor
```
POST /api/admin/instructors
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "displayName": "Coach John",
  "email": "john@example.com",
  "role": "Head Coach",
  "tagline": "Professional basketball coach",
  "bioSummary": "Brief bio...",
  "bioFull": "Full biography...",
  "achievements": ["Achievement 1", "Achievement 2"],
  "education": ["Degree 1", "Degree 2"],
  "showOnWeb": true,
  "isActive": true
}
```

### Update Instructor
```
PUT /api/admin/instructors/:id
```

### Delete Instructor
```
DELETE /api/admin/instructors/:id
```

**Note:** Cannot delete an instructor assigned to active programs.

## Programs

### List All Programs
```
GET /api/admin/programs?businessModelId=uuid&specialtyId=uuid&isActive=true&page=1&limit=20
```

**Query Parameters:**
- `businessModelId` (optional): Filter by business model
- `specialtyId` (optional): Filter by specialty
- `isActive` (optional): Filter by active status
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get Program by ID
```
GET /api/admin/programs/:id
```

### Create Program
```
POST /api/admin/programs
```

**Request Body:**
```json
{
  "code": "BBALL-101",
  "name": "Basketball Fundamentals",
  "subtitle": "Learn the basics",
  "descriptionShort": "Short description",
  "descriptionFull": "Full description",
  "businessModelId": "uuid",
  "specialtyId": "uuid",
  "durationMinutes": 60,
  "sessionsPerWeek": 2,
  "minStudents": 5,
  "maxStudents": 15,
  "minAge": 8,
  "maxAge": 12,
  "difficultyLevel": "beginner",
  "pricePerSession": 25.00,
  "priceMonthly": 200.00,
  "isActive": true,
  "showOnWeb": true
}
```

**Difficulty Levels:** `beginner`, `intermediate`, `advanced`, `professional`

### Update Program
```
PUT /api/admin/programs/:id
```

### Delete Program
```
DELETE /api/admin/programs/:id
```

## Pricing Tiers

### List All Pricing Tiers
```
GET /api/admin/pricing-tiers?programId=uuid&isActive=true&page=1&limit=20
```

**Query Parameters:**
- `programId` (optional): Filter by program
- `isActive` (optional): Filter by active status
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get Pricing Tier by ID
```
GET /api/admin/pricing-tiers/:id
```

### Create Pricing Tier
```
POST /api/admin/pricing-tiers
```

**Request Body:**
```json
{
  "programId": "uuid",
  "name": "Monthly Plan",
  "description": "Pay monthly",
  "price": 200.00,
  "originalPrice": 250.00,
  "sessionsIncluded": 8,
  "validityDays": 30,
  "maxStudents": 15,
  "conditions": ["Valid for 30 days", "No refunds"],
  "isActive": true,
  "isFeatured": false
}
```

### Update Pricing Tier
```
PUT /api/admin/pricing-tiers/:id
```

### Delete Pricing Tier
```
DELETE /api/admin/pricing-tiers/:id
```

## Error Responses

All endpoints return standard error responses:

**400 Bad Request:**
```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized - Invalid or missing X-Admin-Secret header"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## Business Rules

### Specialty Deletion
- Cannot delete a specialty that is assigned to active programs
- Cannot delete a specialty that is assigned to instructors

### Instructor Deletion
- Cannot delete an instructor assigned to active programs
- Deleting an instructor removes their specialty assignments

### Unique Constraints
- Specialty codes must be unique
- Program codes must be unique (enforced at database level)

---

## Business Models (T4)

### List All Business Models
```
GET /api/admin/business-models?isActive=true&showOnWeb=true&page=1&limit=20
```

**Query Parameters:**
- `isActive` (optional): Filter by active status
- `showOnWeb` (optional): Filter by web visibility
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "businessModels": [
    {
      "id": "uuid",
      "internalCode": "elite_on_demand",
      "name": "Elite On Demand",
      "subtitle": "Entrena cuando quieras",
      "description": "...",
      "slug": "elite-on-demand",
      "isActive": true,
      "showOnWeb": true,
      "displayOrder": 1,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "total": 10
}
```

### Get Business Model by ID
```
GET /api/admin/business-models/:id
```

### Create Business Model
```
POST /api/admin/business-models
```

**Request Body:**
```json
{
  "internalCode": "nuevo_modelo",
  "name": "Nuevo Modelo",
  "description": "Descripción",
  "slug": "nuevo-modelo",
  "isActive": true,
  "showOnWeb": true
}
```

**Required fields**: `internalCode`, `name`, `description`, `slug`

### Update Business Model
```
PUT /api/admin/business-models/:id
```

### Delete Business Model
```
DELETE /api/admin/business-models/:id
```

**⚠️ Protected Business Models**: Cannot delete critical models (`elite_on_demand`, `ritmo_constante`, `generacion_dance`, `si_quiero_bailar`). Use `isActive=false` instead.

---

## Page Content (T4)

### List All Pages
```
GET /api/admin/pages?status=published&pageKey=home&page=1&limit=20
```

**Query Parameters:**
- `status` (optional): Filter by status (`published`, `draft`, `archived`)
- `pageKey` (optional): Filter by page key
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get Page by ID
```
GET /api/admin/pages/:id
```

### Get Page by PageKey
```
GET /api/admin/pages/by-key/:pageKey
```

### Create Page
```
POST /api/admin/pages
```

**Request Body:**
```json
{
  "pageKey": "nueva-pagina",
  "pageTitle": "Nueva Página",
  "slug": "nueva-pagina",
  "contentHtml": "<h1>Contenido</h1>",
  "status": "draft"
}
```

**Required fields**: `pageKey`, `pageTitle`, `slug`

### Update Page
```
PUT /api/admin/pages/:id
```

### Delete Page
```
DELETE /api/admin/pages/:id
```

**⚠️ Protected Pages**: Cannot delete critical pages (`home`, `about-us`, `business-models`). Use `status='draft'` or `status='archived'` instead.

---

## FAQs (T4)

### List All FAQs
```
GET /api/admin/faqs?category=horarios&isActive=true&page=1&limit=20
```

**Query Parameters:**
- `category` (optional): Filter by category
- `isActive` (optional): Filter by active status
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get FAQ by ID
```
GET /api/admin/faqs/:id
```

### Create FAQ
```
POST /api/admin/faqs
```

**Request Body:**
```json
{
  "question": "¿Cuáles son los horarios?",
  "answer": "Lunes a Viernes de 6:00 a 21:00",
  "category": "horarios",
  "isActive": true
}
```

**Required fields**: `question`, `answer`

### Update FAQ
```
PUT /api/admin/faqs/:id
```

### Delete FAQ
```
DELETE /api/admin/faqs/:id
```

---

## Content Protection Rules (T4)

### Critical Business Models
The following business models **CANNOT** be deleted:
- `elite_on_demand`
- `ritmo_constante`
- `generacion_dance`
- `si_quiero_bailar`

**Alternative**: Set `isActive=false` or `showOnWeb=false` to hide them.

### Critical Pages
The following pages **CANNOT** be deleted:
- `home`
- `about-us`
- `business-models`

**Alternative**: Set `status='draft'` or `status='archived'` to hide them.

---

## Legal Pages (T5)

### List All Legal Pages
```
GET /api/admin/legal-pages?pageType=privacy
```

**Query Parameters:**
- `pageType` (optional): Filter by page type

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "pageType": "privacy",
      "title": "Privacy Policy",
      "content": "Policy content in HTML or Markdown",
      "version": "2.0",
      "effectiveDate": "2025-01-01T00:00:00.000Z",
      "isCurrent": true,
      "slug": "privacy-policy-v2",
      "createdAt": "2024-12-01T00:00:00.000Z",
      "approvedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "count": 10
}
```

### Get Legal Page by ID
```
GET /api/admin/legal-pages/:id
```

### Get Legal Page by Type
```
GET /api/admin/legal-pages/type/:pageType
```

Returns the most recent legal page for a given type (prioritizes current, then by creation date).

### Create Legal Page
```
POST /api/admin/legal-pages
```

**Request Body:**
```json
{
  "pageType": "privacy",
  "title": "Privacy Policy v2.0",
  "content": "Complete policy content...",
  "version": "2.0",
  "effectiveDate": "2025-01-01",
  "isCurrent": true,
  "slug": "privacy-policy-v2"
}
```

**Required fields**: `pageType`, `title`, `content`, `version`, `effectiveDate`

**Note**: When `isCurrent=true`, all other pages of the same type will automatically be set to `isCurrent=false`.

### Update Legal Page
```
PUT /api/admin/legal-pages/:id
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Privacy Policy Title",
  "content": "Updated content...",
  "version": "2.1",
  "isCurrent": true
}
```

### Delete Legal Page
```
DELETE /api/admin/legal-pages/:id
```

**⚠️ Protected Legal Page Types**: Cannot delete standard legal page types (`legal`, `privacy`, `cookies`, `terms`). Create new versions instead.

---

## Settings (T5)

### List All Settings
```
GET /api/admin/settings?type=site
```

**Query Parameters:**
- `type` (optional): Filter by setting type (`site`, `email`, `social`, `analytics`)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "settingKey": "site.title",
      "settingValue": {
        "en": "Kinesis Dance Studio",
        "es": "Estudio de Danza Kinesis"
      },
      "settingType": "site",
      "description": "Website title for SEO and branding",
      "updatedAt": "2025-01-15T00:00:00.000Z",
      "updatedBy": "admin-user-id"
    }
  ],
  "count": 15
}
```

### Get Setting by Key
```
GET /api/admin/settings/:key
```

**Example**: `GET /api/admin/settings/site.title`

### Create Setting
```
POST /api/admin/settings
```

**Request Body:**
```json
{
  "settingKey": "analytics.google_id",
  "settingValue": {
    "id": "GA-123456789",
    "enabled": true
  },
  "settingType": "analytics",
  "description": "Google Analytics tracking ID"
}
```

**Required fields**: `settingKey`, `settingValue`, `settingType`

**Setting Types**: `site`, `email`, `social`, `analytics`

**Note**: `settingValue` is a JSON object that can hold any structure.

### Update Setting
```
PUT /api/admin/settings/:key
```

**Request Body:**
```json
{
  "settingValue": {
    "id": "GA-987654321",
    "enabled": false
  },
  "description": "Updated Google Analytics configuration"
}
```

**Required fields**: `settingValue`

---

## Leads Management (T5)

### List All Leads
```
GET /api/admin/leads?leadType=contact&status=new&page=1&limit=50
```

**Query Parameters:**
- `leadType` (optional): Filter by type (`contact`, `pre_enrollment`, `elite_booking`, `newsletter`)
- `status` (optional): Filter by status (`new`, `contacted`, `qualified`, `converted`, `lost`)
- `from` (optional): Filter by creation date (start)
- `to` (optional): Filter by creation date (end)
- `source` (optional): Filter by source
- `campaign` (optional): Filter by campaign
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 50, max: 100): Items per page

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "leadType": "contact",
      "leadStatus": "new",
      "source": "web",
      "campaign": "summer_2025",
      "message": "I'm interested in salsa classes",
      "acceptsMarketing": true,
      "utmSource": "facebook",
      "utmMedium": "social",
      "ipAddress": "192.168.1.100",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 50,
  "pages": 3
}
```

### Get Lead by ID
```
GET /api/admin/leads/:id
```

Returns complete lead information including all captured data, UTM parameters, and tracking metadata.

### Update Lead Status
```
PATCH /api/admin/leads/:id/status
```

**Request Body:**
```json
{
  "leadStatus": "contacted",
  "notes": "Called customer, interested in trial class",
  "contactedBy": "admin-user-uuid"
}
```

**Required fields**: `leadStatus`

**Valid statuses**: `new`, `contacted`, `qualified`, `converted`, `lost`

**Response:**
```json
{
  "id": "uuid",
  "leadStatus": "contacted",
  "notes": "Called customer, interested in trial class",
  "contactedAt": "2025-01-15T14:30:00.000Z",
  "contactedBy": "admin-user-uuid",
  "updatedAt": "2025-01-15T14:30:00.000Z"
}
```

### Update Lead Notes
```
PATCH /api/admin/leads/:id/notes
```

**Request Body:**
```json
{
  "notes": "Follow-up scheduled for next week"
}
```

**Required fields**: `notes`

---

## Future Enhancements (T6)

The current authentication mechanism (`X-Admin-Secret` header) is a placeholder. Future enhancements will include:
- JWT-based authentication
- Role-based access control (RBAC)
- User management
- Audit logging
- Content versioning and rollback
