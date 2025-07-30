# API Documentation - Step Sciences Scheduler

This document details all API endpoints available in the Step Sciences Scheduler platform for managing automotive plant appointment configurations.

## 🔐 Authentication

### Admin Authentication
Admin operations require authentication via JWT tokens obtained through the login endpoint.

**Admin Login**
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@stepsciences.com",
  "password": "your-secure-password"
}
```

**Response:**
```json
{
  "user": {
    "id": "admin-dev",
    "email": "admin@stepsciences.com", 
    "role": "admin"
  },
  "token": "admin-1234567890",
  "message": "Login successful"
}
```

**Error Response:**
```json
{
  "error": "Invalid credentials"
}
```

## 🏭 Companies API

Base URL: `/api/companies`

### Get All Companies
Retrieve all active plant configurations.

```http
GET /api/companies
```

**Response:**
```json
[
  {
    "id": "gm-oshawa",
    "name": "GM Oshawa",
    "fullName": "General Motors Oshawa Assembly Plant",
    "primaryColor": "#000000",
    "secondaryColor": "#D4AF37",
    "logo": "/logos/gm-logo.png",
    "calendarUrl": "https://calendar.google.com/calendar/u/0/appointments/schedules/...",
    "intakeFormUrl": "https://step-sciences.web.app/intake/gm/oshawa",
    "contactEmail": "info@stepsciences.com",
    "showBranding": true,
    "meetingLocation": null,
    "scanDayLocations": {
      "monday": "Building C - Medical Offices",
      "tuesday": null,
      "wednesday": null,
      "thursday": null,
      "friday": "Building D - TFT Boardrooms",
      "saturday": null,
      "sunday": null
    },
    "specialInstructions": "Please bring Health Card and Greenshield Card.",
    "domain": "gmoshawa.stepsciences.com",
    "hasScanDays": true,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:45:00Z"
  }
]
```

### Create New Company
Add a new plant configuration (admin only).

```http
POST /api/companies
Content-Type: application/json
Authorization: Bearer {admin-token}

{
  "id": "new-plant",
  "name": "New Plant",
  "full_name": "New Plant Full Name",
  "primary_color": "#000000",
  "secondary_color": "#D4AF37",
  "logo": "/logos/new-plant-logo.png",
  "calendar_url": "https://calendar.google.com/calendar/u/0/appointments/schedules/NEW_ID",
  "intake_form_url": "https://step-sciences.web.app/intake/new/plant",
  "contact_email": "info@stepsciences.com",
  "show_branding": true,
  "meeting_location": "Main Building",
  "monday_location": null,
  "friday_location": null,
  "special_instructions": "Bring required documentation.",
  "domain": "newplant.stepsciences.com",
  "has_scan_days": false,
  "is_active": true
}
```

**Success Response:**
```json
{
  "message": "Company created successfully",
  "company": {
    "id": "new-plant",
    "name": "New Plant",
    // ... full company object
  }
}
```

**Validation Error Response:**
```json
{
  "errors": [
    "Invalid company ID format (use lowercase letters, numbers, and hyphens only)",
    "Valid calendar URL is required (must start with http:// or https://)"
  ]
}
```

### Update Company
Update an existing plant configuration (admin only).

```http
PUT /api/companies
Content-Type: application/json
Authorization: Bearer {admin-token}

{
  "id": "gm-oshawa",
  "name": "GM Oshawa Updated",
  "primary_color": "#FF0000",
  // ... other fields to update
}
```

**Success Response:**
```json
{
  "message": "Company updated successfully",
  "company": {
    // ... updated company object
  }
}
```

### Delete Company
Soft delete a plant (sets `is_active` to false) (admin only).

```http
DELETE /api/companies?id=company-id
Authorization: Bearer {admin-token}
```

**Success Response:**
```json
{
  "message": "Company deleted successfully",
  "company": {
    // ... deleted company object with is_active: false
  }
}
```

## 🌐 Configuration API

Base URL: `/api/config`

### Get Company by Domain
Retrieve plant configuration by domain name (public endpoint).

```http
GET /api/config/gmoshawa.stepsciences.com
```

**Response:**
```json
{
  "id": "gm-oshawa",
  "name": "GM Oshawa",
  "fullName": "General Motors Oshawa Assembly Plant",
  "primaryColor": "#000000",
  "secondaryColor": "#D4AF37",
  "logo": "/logos/gm-logo.png",
  "calendarUrl": "https://calendar.google.com/calendar/u/0/appointments/schedules/...",
  "intakeFormUrl": "https://step-sciences.web.app/intake/gm/oshawa",
  "contactEmail": "info@stepsciences.com",
  "showBranding": true,
  "meetingLocation": null,
  "scanDayLocations": {
    "monday": "Building C - Medical Offices",
    "friday": "Building D - TFT Boardrooms"
  },
  "specialInstructions": "Please bring Health Card and Greenshield Card.",
  "domain": "gmoshawa.stepsciences.com",
  "hasScanDays": true,
  "isActive": true
}
```

**Error Response (404):**
```json
{
  "error": "Company not found for domain"
}
```

**Caching:** This endpoint caches responses for 5 minutes with stale-while-revalidate for 10 minutes.

## 📊 Data Models

### Company Object
```typescript
interface Company {
  id: string;                    // Unique identifier (kebab-case)
  name: string;                  // Display name
  fullName: string;              // Full company name
  primaryColor: string;          // Hex color for branding
  secondaryColor: string;        // Secondary hex color
  logo: string;                  // Path to logo image
  calendarUrl: string;           // Google Calendar booking URL
  intakeFormUrl: string;         // Intake form URL
  contactEmail: string;          // Contact email address
  showBranding: boolean;         // Whether to show company branding
  meetingLocation: string | null; // Default meeting location
  scanDayLocations: {            // Day-specific locations
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  specialInstructions: string | null; // Special instructions text
  domain: string;                // Full domain (subdomain.stepsciences.com)
  hasScanDays: boolean;          // Whether plant has different locations per day
  isActive: boolean;             // Whether company is active
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

### Admin User Object
```typescript
interface AdminUser {
  id: string;                    // UUID
  email: string;                 // Admin email
  role: string;                  // Always "admin"
  isActive: boolean;             // Whether account is active
  createdAt: string;             // ISO timestamp
  lastLogin: string | null;      // ISO timestamp of last login
}
```

## 🔒 Security & Permissions

### Public Endpoints
- `GET /api/companies` - Read active companies
- `GET /api/config/[domain]` - Read company by domain

### Admin-Only Endpoints
- `POST /api/companies` - Create company
- `PUT /api/companies` - Update company  
- `DELETE /api/companies` - Delete company
- `POST /api/admin/login` - Admin authentication

### Row Level Security (RLS)
- **Companies Table**: Public read access for active records, admin-only write access
- **Admin Users Table**: Admin-only access for all operations

### Input Validation
All endpoints perform strict input validation:
- **Company ID**: Lowercase letters, numbers, hyphens only
- **URLs**: Must start with http:// or https://
- **Domain**: Must contain stepsciences.com
- **Email**: Must be valid email format
- **Colors**: Must be valid hex colors (when provided)

## 🚀 Usage Examples

### Frontend Integration
```javascript
// Get all companies
const companies = await fetch('/api/companies').then(r => r.json());

// Get company by current domain
const company = await fetch(`/api/config/${window.location.hostname}`)
  .then(r => r.json());

// Admin login
const loginResponse = await fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Create new company (admin)
const newCompany = await fetch('/api/companies', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify(companyData)
});
```

### cURL Examples
```bash
# Get all companies
curl https://appointments.stepsciences.com/api/companies

# Get company by domain
curl https://appointments.stepsciences.com/api/config/gmoshawa.stepsciences.com

# Admin login
curl -X POST https://appointments.stepsciences.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@stepsciences.com","password":"your-password"}'

# Create new company
curl -X POST https://appointments.stepsciences.com/api/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token" \
  -d '{"id":"test-plant","name":"Test Plant","domain":"testplant.stepsciences.com","calendar_url":"https://calendar.google.com/...","intake_form_url":"https://example.com"}'
```

## ⚡ Performance

### Caching Strategy
- **Domain lookups**: 5-minute cache with stale-while-revalidate
- **Company list**: No caching (real-time updates needed)
- **Static assets**: CDN cached indefinitely

### Rate Limiting
- No explicit rate limiting currently implemented
- Vercel provides DDoS protection
- Supabase has built-in connection pooling

### Response Times
- **GET requests**: ~50-200ms
- **POST/PUT requests**: ~100-300ms
- **Database queries**: ~10-50ms
- **Authentication**: ~100-200ms

## 🐛 Error Handling

### HTTP Status Codes
- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `405 Method Not Allowed` - HTTP method not supported
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

### Error Response Format
```json
{
  "error": "Descriptive error message",
  "details": "Additional technical details (optional)",
  "errors": ["Array of validation errors (for 400 responses)"]
}
```

### Common Error Scenarios
1. **Invalid company ID format** - Use only lowercase letters, numbers, and hyphens
2. **Duplicate company ID** - Company ID must be unique
3. **Invalid URL format** - URLs must start with http:// or https://
4. **Domain validation** - Domain must be a stepsciences.com subdomain
5. **Authentication failure** - Check admin credentials
6. **Database connection** - Check Supabase service status

## 🔧 Development & Testing

### Local Development
```bash
# Start development server
pnpm start

# Test API endpoints
curl http://localhost:3000/api/companies
curl http://localhost:3000/api/config/gmoshawa.stepsciences.com
```

### Environment Variables
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
```

### Database Testing
```bash
# Test database connection
node test-supabase.js

# Verify company data
# Go to Supabase Dashboard → Table Editor → companies
```

---

This API provides a complete interface for managing multi-tenant automotive plant appointment scheduling configurations with robust security, validation, and performance optimizations.