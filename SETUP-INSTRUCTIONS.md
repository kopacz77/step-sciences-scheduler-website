# Step Sciences Scheduler - Supabase Setup Instructions

## Quick Setup Checklist

### 1. **Create Database Schema**
Go to your Supabase dashboard → SQL Editor and run:
```sql
-- Copy and paste the entire contents of supabase-schema.sql
```

### 2. **Test Database Connection**
```bash
node test-supabase.js
```
This will verify your database is set up correctly.

### 3. **Start Development Server**
```bash
pnpm start
```

### 4. **Test the Application**

#### Test Main App:
- Visit: `http://localhost:3000`
- Should load GM Oshawa by default
- Test booking flow

#### Test Admin Interface:
- Visit: `http://localhost:3000/admin`
- Login: `admin@stepsciences.com` / `admin123`
- Add/edit companies

## Canadian Auto Plants Pre-loaded

Your database will include these Canadian auto plants:

### Major Assembly Plants:
- **GM Oshawa** - `gmoshawa.stepsciences.com`
  - Has scan days (Monday/Friday different locations)
- **GM CAMI** - `gmcami.stepsciences.com` 
  - Ingersoll, ON - Single location
- **Stellantis Windsor** - `stellantiswindsor.stepsciences.com`
  - Windsor Assembly Plant
- **Stellantis Brampton** - `stellantisbrampton.stepsciences.com`
  - Brampton Assembly Plant
- **Ford Oakville** - `fordoakville.stepsciences.com`
  - Oakville Assembly Complex
- **Ford Windsor** - `fordwindsor.stepsciences.com`
  - Windsor Engine Plant

### Union Halls:
- **Unifor Local 200/444** - `uniforwindsor.stepsciences.com`
  - Windsor union hall

## Adding New Plants

### Via Admin Interface (Recommended):
1. Go to `localhost:3000/admin`
2. Click "Add New Company"
3. Fill out form:
   - **ID**: `honda-alliston` (lowercase, hyphens)
   - **Name**: `Honda Alliston`
   - **Full Name**: `Honda Manufacturing of Canada - Alliston Plant`
   - **Colors**: Pick brand colors
   - **Calendar URL**: Your Google Calendar booking URL
   - **Intake Form URL**: `https://step-sciences.web.app/intake/honda/alliston`
   - **Domain**: `hondaalliston.stepsciences.com`
   - **Location**: Plant-specific meeting location
4. Save and test

### Example: Adding Honda Alliston
```javascript
{
  "id": "honda-alliston",
  "name": "Honda Alliston",
  "fullName": "Honda Manufacturing of Canada - Alliston Plant",
  "primaryColor": "#CC0000",
  "secondaryColor": "#000000",
  "calendarUrl": "https://calendar.google.com/calendar/u/0/appointments/schedules/YOUR_HONDA_CALENDAR_ID",
  "intakeFormUrl": "https://step-sciences.web.app/intake/honda/alliston",
  "domain": "hondaalliston.stepsciences.com",
  "meetingLocation": "Honda Health Services Building, Main Floor",
  "specialInstructions": "Please bring Health Card and Honda employee ID to the appointment."
}
```

## Key Features Available:

### ✅ **Multi-Tenant Architecture**
- Each plant gets custom subdomain
- Brand-specific colors and logos
- Customized messaging and instructions

### ✅ **Dynamic Configuration**
- No code changes needed for new plants
- Admin interface for easy management
- Real-time updates

### ✅ **Flexible Location Handling**
- Single meeting location
- OR Monday/Friday scan days (different locations)
- Custom instructions per plant

### ✅ **Google Calendar Integration**
- Each plant has unique calendar booking URL
- Direct integration with Google's appointment system

### ✅ **Intake Form Integration**
- Plant-specific intake forms
- Secure iframe embedding
- Step Sciences hosted forms

## Troubleshooting

### Database Connection Issues:
```bash
# Test connection
node test-supabase.js

# Check for RLS errors
# - RLS blocking reads = Need to adjust policies
# - RLS blocking writes = Normal for security
```

### Company Not Loading:
1. Check if company exists in database
2. Verify `is_active = true`
3. Test domain lookup: `companies.domain = 'yourplant.stepsciences.com'`

### Admin Access Issues:
1. Verify admin user exists in `admin_users` table
2. Check password hash matches
3. Ensure JWT secret is set

## Production Deployment

### Environment Variables for Vercel:
```bash
# Database
REACT_APP_SUPABASE_URL=https://cabtsqukaofxofsufaui.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin
JWT_SECRET=your-secure-jwt-secret

# API
REACT_APP_API_URL=https://your-domain.vercel.app/api
```

### Domain Setup:
1. Configure wildcard DNS: `*.stepsciences.com` → Vercel
2. Set up SSL certificate for wildcard domain
3. Test each plant subdomain

## Security Notes

- ✅ Row Level Security (RLS) enabled
- ✅ Public read access for active companies
- ✅ Admin-only write access
- ✅ Input validation and sanitization
- ✅ Secure iframe sandboxing
- ✅ XSS protection with CSP headers

## Support

- **Technical Issues**: Check console logs and Supabase logs
- **New Plant Setup**: Use admin interface
- **Calendar Integration**: Verify Google Calendar URLs
- **Domain Issues**: Check DNS configuration