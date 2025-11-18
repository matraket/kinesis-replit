# Public API Endpoints Documentation

## Overview

The Public API provides read-only access to content for the Kinesis public website. All endpoints are under the `/api/public` prefix and return JSON responses.

**Base URL:** `/api/public`

## General Rules

- **Read-only**: All endpoints use HTTP GET method
- **Published content only**: Only returns active and published content
- **Error responses**: Return JSON with `error` and `message` fields
- **HTTP Status Codes**: 
  - `200`: Success
  - `400`: Bad Request (invalid parameters)
  - `404`: Not Found
  - `500`: Internal Server Error

---

## Business Models

### List Business Models

`GET /api/public/business-models`

Returns all published business models ordered by display order.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "internalCode": "string",
      "name": "string",
      "subtitle": "string",
      "description": "string",
      "scheduleInfo": "string",
      "targetAudience": "string",
      "format": "string",
      "featureTitle": "string",
      "featureContent": "string",
      "advantageTitle": "string",
      "advantageContent": "string",
      "benefitTitle": "string",
      "benefitContent": "string",
      "displayOrder": 0,
      "metaTitle": "string",
      "metaDescription": "string",
      "slug": "string"
    }
  ],
  "count": 0
}
```

### Get Business Model by Slug

`GET /api/public/business-models/:slug`

Returns a single business model by its slug.

**Parameters:**
- `slug` (path): Business model slug

**Response:** Single business model object or 404 if not found.

---

## Programs

### List Programs

`GET /api/public/programs`

Returns paginated list of programs with optional filters.

**Query Parameters:**
- `businessModelSlug` (optional): Filter by business model slug
- `specialtyCode` (optional): Filter by specialty code
- `difficulty` (optional): Filter by difficulty level (`beginner`, `intermediate`, `advanced`, `professional`)
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "string",
      "name": "string",
      "subtitle": "string",
      "descriptionShort": "string",
      "descriptionFull": "string",
      "businessModelId": "uuid",
      "specialtyId": "uuid",
      "durationMinutes": 0,
      "sessionsPerWeek": 0,
      "minStudents": 1,
      "maxStudents": 20,
      "minAge": 0,
      "maxAge": 0,
      "difficultyLevel": "beginner",
      "pricePerSession": 0.00,
      "priceMonthly": 0.00,
      "priceQuarterly": 0.00,
      "scheduleDescription": "string",
      "featuredImageUrl": "string",
      "displayOrder": 0,
      "slug": "string",
      "metaTitle": "string",
      "metaDescription": "string"
    }
  ],
  "total": 0,
  "page": 1,
  "limit": 20,
  "pages": 0
}
```

### Get Program by Slug

`GET /api/public/programs/:slug`

Returns a single program by its slug.

---

## Instructors

### List Instructors

`GET /api/public/instructors`

Returns paginated list of instructors ordered by seniority level.

**Query Parameters:**
- `featured` (optional): Filter featured instructors (`true` or `false`)
- `specialtyCode` (optional): Filter by specialty code
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "string",
      "lastName": "string",
      "displayName": "string",
      "role": "string",
      "tagline": "string",
      "bioSummary": "string",
      "bioFull": "string",
      "achievements": ["string"],
      "education": ["string"],
      "profileImageUrl": "string",
      "heroImageUrl": "string",
      "videoUrl": "string",
      "seniorityLevel": 0,
      "slug": "string",
      "metaTitle": "string",
      "metaDescription": "string"
    }
  ],
  "total": 0,
  "page": 1,
  "limit": 20,
  "pages": 0
}
```

### Get Instructor by Slug

`GET /api/public/instructors/:slug`

Returns a single instructor by their slug.

---

## Pricing Tiers

### List Pricing Tiers

`GET /api/public/pricing-tiers`

Returns pricing tiers with optional filters.

**Query Parameters:**
- `businessModelSlug` (optional): Filter by business model slug
- `programSlug` (optional): Filter by program slug

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "programId": "uuid",
      "name": "string",
      "description": "string",
      "price": 0.00,
      "originalPrice": 0.00,
      "sessionsIncluded": 0,
      "validityDays": 0,
      "maxStudents": 0,
      "conditions": ["string"],
      "displayOrder": 0,
      "isFeatured": false
    }
  ],
  "count": 0
}
```

---

## Page Content

### Get Page by Slug

`GET /api/public/pages/:slug`

Returns static page content by slug (e.g., `about-us`, `business-models`).

**Response:**
```json
{
  "id": "uuid",
  "pageKey": "string",
  "pageTitle": "string",
  "contentHtml": "string",
  "contentJson": {},
  "sections": {},
  "heroImageUrl": "string",
  "galleryImages": ["string"],
  "videoUrl": "string",
  "slug": "string",
  "metaTitle": "string",
  "metaDescription": "string",
  "ogImageUrl": "string"
}
```

---

## FAQs

### List FAQs

`GET /api/public/faqs`

Returns paginated list of frequently asked questions.

**Query Parameters:**
- `category` (optional): Filter by category
- `businessModelSlug` (optional): Filter by business model slug
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "question": "string",
      "answer": "string",
      "category": "string",
      "tags": ["string"],
      "displayOrder": 0,
      "isFeatured": false
    }
  ],
  "total": 0,
  "page": 1,
  "limit": 20,
  "pages": 0
}
```

---

## Legal Pages

### List Legal Pages

`GET /api/public/legal-pages`

Returns all current legal pages.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "pageType": "string",
      "title": "string",
      "content": "string",
      "version": "string",
      "effectiveDate": "ISO8601",
      "slug": "string"
    }
  ],
  "count": 0
}
```

### Get Legal Page by Slug

`GET /api/public/legal-pages/:slug`

Returns a single legal page by slug (e.g., `aviso-legal`, `privacidad`, `cookies`).

---

## Lead Capture Forms (T5)

The public API provides POST-only endpoints for lead capture forms. These endpoints automatically track client information (IP address, user agent) and UTM parameters for analytics.

**Note**: These are the only POST endpoints in the public API. All other public endpoints are GET-only.

### Contact Form

`POST /api/public/leads/contact`

Submit a general contact inquiry.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in learning salsa",
  "acceptsMarketing": true,
  "utmSource": "facebook",
  "utmMedium": "social",
  "utmCampaign": "summer_2025",
  "utmTerm": "dance_classes",
  "utmContent": "ad_variation_a"
}
```

**Required Fields**: `firstName`, `lastName`, `email`, `message`

**Optional Fields**: `phone`, `acceptsMarketing`, UTM parameters

**Response:** 201 Created
```json
{
  "message": "Contact form submitted successfully",
  "id": "uuid"
}
```

### Pre-Enrollment Form

`POST /api/public/leads/pre-enrollment`

Submit a student enrollment inquiry with student information.

**Request Body:**
```json
{
  "firstName": "Maria",
  "lastName": "Garcia",
  "email": "maria@example.com",
  "phone": "+1234567890",
  "studentName": "Sofia Garcia",
  "studentAge": 8,
  "previousExperience": "None, complete beginner",
  "interestedInPrograms": ["ballet", "contemporary"],
  "preferredSchedule": "Weekday afternoons",
  "acceptsMarketing": true,
  "utmSource": "google",
  "utmCampaign": "enrollment_2025"
}
```

**Required Fields**: `firstName`, `lastName`, `email`, `studentName`, `studentAge`

**Optional Fields**: `phone`, `message`, `previousExperience`, `interestedInPrograms`, `preferredSchedule`, `acceptsMarketing`, UTM parameters

**Age Constraints**: `studentAge` must be between 3 and 100

**Response:** 201 Created
```json
{
  "message": "Pre-enrollment form submitted successfully",
  "id": "uuid"
}
```

### Elite Booking Form

`POST /api/public/leads/elite-booking`

Submit a request for premium/elite session booking.

**Request Body:**
```json
{
  "firstName": "Carlos",
  "lastName": "Rodriguez",
  "email": "carlos@example.com",
  "phone": "+1234567890",
  "preferredDate": "2025-12-15",
  "preferredTime": "18:00",
  "sessionType": "individual",
  "message": "Preparing for competition",
  "acceptsMarketing": false,
  "utmSource": "instagram"
}
```

**Required Fields**: `firstName`, `lastName`, `email`, `preferredDate`, `preferredTime`

**Optional Fields**: `phone`, `sessionType`, `message`, `acceptsMarketing`, UTM parameters

**Session Types**: `individual`, `couple`, `group`

**Time Format**: HH:MM (24-hour format, e.g., "18:00")

**Response:** 201 Created
```json
{
  "message": "Elite booking request submitted successfully",
  "id": "uuid"
}
```

### Wedding Choreography Form

`POST /api/public/leads/wedding`

Submit a request for wedding dance choreography (specialized elite booking).

**Request Body:**
```json
{
  "firstName": "Bride",
  "lastName": "Groom",
  "email": "wedding@example.com",
  "phone": "+1234567890",
  "preferredDate": "2026-06-15",
  "preferredTime": "14:00",
  "message": "First dance choreography for outdoor wedding",
  "acceptsMarketing": true,
  "utmSource": "google",
  "utmCampaign": "wedding_season"
}
```

**Required Fields**: `firstName`, `lastName`, `email`, `preferredDate`, `preferredTime`

**Optional Fields**: `phone`, `message`, `acceptsMarketing`, UTM parameters

**Special Behavior**: Automatically tagged as `sessionType: 'couple'` and adds `'wedding-choreography'` to interested programs

**Response:** 201 Created
```json
{
  "message": "Wedding choreography request submitted successfully",
  "id": "uuid"
}
```

### Data Capture & Tracking

All lead capture endpoints automatically capture:

**Client Information:**
- IP address (from request)
- User agent (browser/device information)
- Source set to `'web'`

**UTM Parameters** (optional):
- `utmSource`: Campaign source (e.g., `'facebook'`, `'google'`)
- `utmMedium`: Campaign medium (e.g., `'social'`, `'email'`)
- `utmCampaign`: Campaign name (e.g., `'summer_2025'`)
- `utmTerm`: Search terms
- `utmContent`: Ad variation identifier

**Lead Status:**
- All new leads are created with status `'new'`
- Admin can update status via admin API to `'contacted'`, `'qualified'`, `'converted'`, or `'lost'`

---

## Error Response Format

All error responses follow this structure:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": {}
}
```

**Common Error Types:**
- `Bad Request`: Invalid query parameters or request format
- `Not Found`: Resource not found
- `Internal Server Error`: Server-side error

**Validation Errors (400):**
Lead capture endpoints will return validation errors with details about which fields failed validation:

```json
{
  "error": "Validation failed",
  "message": "Invalid input data",
  "details": {
    "email": "Invalid email format",
    "studentAge": "Must be between 3 and 100"
  }
}
```

---

## Architecture Notes

- **Clean Architecture**: Controllers → Use Cases → Repositories → Database
- **Data Validation**: All requests validated with Zod schemas
- **No Sensitive Data**: API never exposes internal fields or credentials
- **Performance**: Efficient database queries with proper indexing
- **Caching**: Consider implementing HTTP caching headers for production
- **Security**: Lead capture endpoints use POST-only to prevent data exposure
- **Privacy**: IP addresses and user agents are captured for fraud prevention and analytics only
