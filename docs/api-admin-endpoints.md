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

## Future Enhancements (T6)

The current authentication mechanism (`X-Admin-Secret` header) is a placeholder. Future enhancements will include:
- JWT-based authentication
- Role-based access control (RBAC)
- User management
- Audit logging
