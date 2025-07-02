# Step Sciences Scheduler - Deployment Guide

## Overview
This guide covers deploying the scalable Step Sciences Scheduler with dynamic company management capabilities.

## Architecture
- **Frontend**: React 19 + Material-UI 7 (Vercel)
- **Backend**: Vercel Serverless Functions
- **Database**: PlanetScale MySQL (recommended) or Supabase
- **Admin Panel**: Protected route at `/admin`
- **Authentication**: JWT-based admin auth

## Prerequisites
- Vercel account
- PlanetScale account (or Supabase)
- Domain management access for subdomains

## Step 1: Database Setup

### Option A: PlanetScale (Recommended)
1. Create PlanetScale account and database
2. Run database schema:
```sql
CREATE TABLE companies (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  primary_color VARCHAR(7) DEFAULT '#1976d2',
  secondary_color VARCHAR(7) DEFAULT '#ffc107',
  logo VARCHAR(200),
  calendar_url TEXT NOT NULL,
  intake_form_url TEXT NOT NULL,
  contact_email VARCHAR(100) NOT NULL,
  show_branding BOOLEAN DEFAULT true,
  meeting_location TEXT,
  monday_location TEXT,
  friday_location TEXT,
  special_instructions TEXT,
  domain VARCHAR(100) UNIQUE NOT NULL,
  has_scan_days BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for domain lookups
CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_companies_active ON companies(is_active);
```

3. Get connection credentials

### Option B: Supabase
1. Create Supabase project
2. Use SQL editor to create table
3. Enable Row Level Security (RLS)
4. Get connection details

## Step 2: Environment Variables

### Vercel Environment Variables
```bash
# Database (PlanetScale)
DATABASE_HOST=your-planetscale-host
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password

# Admin Authentication
ADMIN_EMAIL=admin@stepsciences.com
ADMIN_PASSWORD_HASH=$2b$10$your-bcrypt-hash
JWT_SECRET=your-super-secret-jwt-key

# API Security
API_KEY=your-api-key-for-rate-limiting

# App Configuration
REACT_APP_API_URL=https://your-domain.vercel.app/api
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Generate Admin Password Hash
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

## Step 3: Deploy to Vercel

### Manual Deployment
1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### CLI Deployment
```bash
npm install -g vercel
vercel --prod
```

## Step 4: Configure Domains

### Main Domain
- Set up `appointments.stepsciences.com` → Vercel app

### Company Subdomains
Each company gets their own subdomain:
- `gmoshawa.stepsciences.com`
- `stellantiswindsor.stepsciences.com`
- `copernicus-lodge.stepsciences.com`

### Wildcard SSL
Configure wildcard SSL certificate for `*.stepsciences.com`

## Step 5: Seed Initial Data

### Using Admin Interface
1. Go to `https://your-domain.vercel.app/admin`
2. Login with admin credentials
3. Add company configurations

### Using API Directly
```bash
curl -X POST https://your-domain.vercel.app/api/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "id": "gm-oshawa",
    "name": "GM Oshawa",
    "fullName": "General Motors Oshawa Assembly",
    "primaryColor": "#000000",
    "secondaryColor": "#D4AF37",
    "calendarUrl": "https://calendar.google.com/...",
    "intakeFormUrl": "https://step-sciences.web.app/intake/gm/oshawa",
    "domain": "gmoshawa.stepsciences.com",
    "hasScanDays": true,
    "scanDayLocations": {
      "monday": "Building C - Medical Offices",
      "friday": "Building D - TFT Boardrooms"
    }
  }'
```

## Step 6: Testing

### Test Company Portal
1. Visit company subdomain
2. Verify branding loads correctly
3. Test booking flow
4. Test intake form integration

### Test Admin Panel
1. Visit `/admin`
2. Login with admin credentials
3. Add/edit/delete company
4. Verify changes reflect on company portals

## Step 7: Monitoring & Analytics

### Add Monitoring
```javascript
// Add to your API functions
import { track } from './analytics';

// Track company visits
track('company_visit', { companyId, domain });

// Track booking completions
track('booking_completed', { companyId, step });
```

### Error Monitoring
- Set up Sentry or similar for error tracking
- Monitor API endpoints for failures
- Set up alerts for database issues

## Adding New Companies

### Via Admin Interface
1. Login to admin panel
2. Click "Add New Company"
3. Fill out form with:
   - Company ID (unique, lowercase, hyphens only)
   - Display name
   - Colors and branding
   - Google Calendar URL
   - Intake form URL
   - Location details
4. Save and test

### Via API
```javascript
const newCompany = {
  id: 'new-company-id',
  name: 'New Company',
  fullName: 'New Company Full Name',
  primaryColor: '#1976d2',
  secondaryColor: '#ffc107',
  calendarUrl: 'https://calendar.google.com/...',
  intakeFormUrl: 'https://step-sciences.web.app/intake/new-company',
  domain: 'newcompany.stepsciences.com',
  meetingLocation: 'Main Office Building',
  specialInstructions: 'Please bring ID'
};

fetch('/api/companies', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newCompany)
});
```

### DNS Configuration
1. Add subdomain CNAME record
2. Point to Vercel deployment
3. Wait for SSL provisioning

## Security Checklist

- ✅ JWT authentication for admin panel
- ✅ Input validation on all endpoints
- ✅ SQL injection protection
- ✅ XSS protection with CSP headers
- ✅ Rate limiting on public endpoints
- ✅ HTTPS enforcement
- ✅ Secure iframe sandboxing
- ✅ URL validation for external resources

## Backup & Recovery

### Database Backups
- PlanetScale: Automatic backups included
- Supabase: Configure backup schedules
- Export company data regularly

### Code Backups
- GitHub repository with all code
- Vercel deployment history
- Environment variable documentation

## Scaling Considerations

### Performance
- Company config caching (5-minute TTL)
- CDN for static assets
- Database connection pooling
- API rate limiting

### Capacity
- Monitor database storage usage
- Scale up database tier as needed
- Consider read replicas for high traffic

### Cost Optimization
- Review unused companies (set `is_active = false`)
- Monitor API usage
- Optimize database queries

## Troubleshooting

### Common Issues
1. **Company not loading**: Check domain configuration
2. **Calendar not working**: Verify Google Calendar URL
3. **Intake form errors**: Check iframe URL and permissions
4. **Admin login fails**: Verify password hash and JWT secret

### Debug Commands
```bash
# Check company config
curl https://your-domain.vercel.app/api/config/gmoshawa.stepsciences.com

# Test admin authentication
curl -X POST https://your-domain.vercel.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@stepsciences.com","password":"your-password"}'
```

## Support

For deployment support, contact:
- Technical: dev@stepsciences.com
- Admin Access: admin@stepsciences.com