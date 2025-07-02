# Step Sciences Scheduler Portal

> Multi-tenant appointment scheduling platform for Canadian automotive plants with dynamic branding and Google Calendar integration.

[![Vercel](https://img.shields.io/badge/deployed-vercel-black?style=flat-square&logo=vercel)](https://appointments.stepsciences.com)
[![React](https://img.shields.io/badge/react-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/mui-7.0.0-blue?style=flat-square&logo=mui)](https://mui.com/)
[![Supabase](https://img.shields.io/badge/supabase-database-green?style=flat-square&logo=supabase)](https://supabase.com/)

## 🎯 Overview

A scalable React application serving Canadian automotive plants with custom-branded appointment scheduling. Each plant gets its own subdomain, branding, and Google Calendar integration through a database-driven architecture.

## ✨ Key Features

- **🏭 Automotive Plant Focus**: Specialized for Canadian auto manufacturers (GM, Stellantis, Ford, etc.)
- **🗄️ Database-Driven**: Supabase PostgreSQL with admin interface - no code changes for new plants
- **🌐 Custom Subdomains**: Each plant gets professional URL (e.g., `gmoshawa.stepsciences.com`)
- **📅 Google Calendar Integration**: Direct booking through plant-specific appointment calendars
- **🎨 Dynamic Branding**: Plant-specific colors, logos, locations, and custom messaging
- **⚖️ Dual-Location Support**: Handle scan days (Monday/Friday different locations)
- **🔐 Admin Interface**: Web-based plant management with authentication
- **📱 Mobile Optimized**: Works on plant floor tablets and mobile devices

## 🌐 Live Client Sites

| Client | URL | Industry |
|--------|-----|----------|
| **GM Oshawa** | [gmoshawa.stepsciences.com](https://gmoshawa.stepsciences.com) | Automotive |
| **GM CAMI** | [gmcami.stepsciences.com](https://gmcami.stepsciences.com) | Automotive |
| **Stellantis Windsor** | [stellantiswindsor.stepsciences.com](https://stellantiswindsor.stepsciences.com) | Automotive |
| **Stellantis Brampton** | [stellantisbrampton.stepsciences.com](https://stellantisbrampton.stepsciences.com) | Automotive |
| **Unifor Windsor** | [uniforwindsor.stepsciences.com](https://uniforwindsor.stepsciences.com) | Labor Union |
| **Copernicus Lodge** | [copernicus-lodge.stepsciences.com](https://copernicus-lodge.stepsciences.com) | Hospitality |
| **Main Portal** | [appointments.stepsciences.com](https://appointments.stepsciences.com) | Default/Fallback |

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | React | 19.0.0 | Core UI framework |
| **UI Library** | Material-UI | 7.0.0 | Component library & theming |
| **Build Tool** | Create React App | 5.0.1 | Development & build pipeline |
| **Package Manager** | pnpm | Latest | Dependency management |
| **Code Quality** | Biome | 1.4.1 | Linting & formatting |
| **Deployment** | Vercel | - | Hosting & CI/CD |
| **DNS** | GoDaddy | - | Domain management |
| **External APIs** | Google Calendar | - | Appointment scheduling |

## 🚀 Quick Start

### 1. Database Setup (Required First!)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. SQL Editor → Run entire `supabase-schema.sql`
3. Test connection: `node test-supabase.js`

### 2. Installation
```bash
git clone https://github.com/kopacz77/step-sciences-scheduler-website
cd step-sciences-scheduler-website
pnpm install
pnpm start
```

### 3. Test URLs
- **Main App**: http://localhost:3000 (GM Oshawa)
- **Admin Panel**: http://localhost:3000/admin (admin@stepsciences.com / admin123)
- **Parameter Fallback**: http://localhost:3000?company=gm-cami

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm start` | Start development server |
| `pnpm build` | Build for production |
| `pnpm format` | Format code with Biome |
| `pnpm lint` | Lint code with Biome |
| `pnpm check` | Check and fix code issues |

## 🏗️ Architecture

### Database-Driven Configuration
**No more static config files!** All plants managed through Supabase:

```sql
companies (
  id TEXT PRIMARY KEY,           -- 'gm-oshawa'
  name TEXT,                     -- 'GM Oshawa'
  domain TEXT,                   -- 'gmoshawa.stepsciences.com'
  primary_color TEXT,            -- '#000000'
  calendar_url TEXT,             -- Google Calendar booking URL
  meeting_location TEXT,         -- Plant address
  has_scan_days BOOLEAN,         -- Monday/Friday locations
  local_organizer_message TEXT,  -- Custom plant instructions
  is_active BOOLEAN DEFAULT true
);
```

### File Structure
```
src/
├── components/
│   ├── AdminInterface.js         # Plant management UI
│   ├── AdminLogin.js            # Authentication
│   ├── Header.js                # Branded header
│   └── StepContent.js           # Main flow
├── config/
│   └── dynamicCompanyConfigs.js # Supabase integration
api/
├── companies.js                 # CRUD operations
├── config/[domain].js          # Domain lookup
└── admin/login.js              # Authentication
```

## Deployment (Vercel)

### Current Setup
- **Platform**: Vercel (connected to GitHub)
- **Auto-Deploy**: Every push to `main` branch
- **Domains**: Unlimited custom subdomains supported
- **SSL**: Automatic for all domains

### Adding New Domains
1. **Vercel Dashboard**: Project → Settings → Domains → Add domain
2. **DNS Configuration**: Add CNAME record pointing to `cname.vercel-dns.com`
3. **SSL**: Automatically provisioned (5-30 minutes)

### Build Commands
```bash
# Production build (Vercel runs automatically)
pnpm build

# Code formatting
pnpm run format

# Linting
pnpm run lint

# Code quality check
pnpm run check
```

## 🏭 Plant Management

### Adding New Plants
1. **Via Admin Interface** (Recommended):
   - Visit `/admin` → Add New Company
   - Fill form with plant details
   - Set custom domain and branding
   - Save and test

2. **Dual-Location Setup** (GM Oshawa style):
   ```json
   {
     "has_scan_days": true,
     "scan_day_locations": {
       "monday": "Building C - Medical Offices",
       "friday": "Building D - TFT Boardrooms"
     }
   }
   ```

### Pre-loaded Canadian Plants
- GM Oshawa, GM CAMI
- Stellantis Windsor, Stellantis Brampton  
- Ford Oakville, Ford Windsor
- Unifor Local 200/444

## 🌐 Domain System

### Automatic Plant Detection
```javascript
// Domain-based routing
gmoshawa.stepsciences.com → GM Oshawa config
stellantiswindsor.stepsciences.com → Stellantis config

// Parameter fallback
appointments.stepsciences.com?company=gm-cami → GM CAMI config
```

### Dynamic Loading
- Database lookup by domain
- 5-minute caching for performance
- Fallback to URL parameters
- Default to GM Oshawa if not found

## Google Calendar Integration

### Supported URL Formats
- **Legacy**: `https://calendar.google.com/calendar/u/0/appointments/schedules/[ID]`
- **Modern**: `https://calendar.app.google/[ID]`

### Button Features
- **Automatic sizing**: Prominent, accessible booking buttons
- **Fallback handling**: Direct links if embedded button fails
- **Cross-browser compatibility**: Works across all modern browsers

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Adding New Plants

### Quick Process (5 minutes):
1. **Admin Interface**: `/admin` → Add New Company
2. **Fill Details**: Name, colors, calendar URL, location
3. **Domain Setup**: Add domain in Vercel dashboard
4. **DNS**: Add CNAME record pointing to Vercel
5. **Test**: Visit new subdomain

**No code changes required!** All configuration is database-driven.

## Monitoring & Maintenance

### Vercel Free Tier Usage
- **Bandwidth**: 100 GB/month (currently using <5 GB)
- **Function Calls**: 100,000/month (using ~1,000)
- **Domains**: Unlimited ✅
- **Projects**: 200 max (using 1)

### Health Checks
- All client domains resolve correctly
- Google Calendar integrations functional
- SSL certificates valid
- Contact forms working

## Support & Contact

- **Technical Issues**: Check Vercel deployment logs
- **Client Requests**: Update configurations as needed
- **Emergency**: Rollback via Git if needed

## Development Workflow

```bash
# 1. Make changes locally
pnpm start

# 2. Test thoroughly
# Visit different client subdomains locally

# 3. Commit and push
git add .
git commit -m "Description of changes"
git push origin main

# 4. Vercel auto-deploys
# Monitor deployment in Vercel dashboard
```

## Security & Privacy

- **No sensitive data storage**: All data handled by Google Calendar and intake forms
- **HTTPS enforced**: All domains use SSL/TLS encryption
- **Local storage**: Only used for user flow state (non-sensitive)
- **GDPR compliant**: No personal data stored in application

## License

© 2025 Step Sciences. All rights reserved.

---

## 📋 Available Commands

```bash
pnpm start          # Development server
pnpm build          # Production build
pnpm format         # Format code with Biome
pnpm lint           # Lint code
pnpm check          # Fix code issues
node test-supabase  # Test database connection
```

## 🚀 Deployment

### Environment Variables
```bash
# Database
REACT_APP_SUPABASE_URL=https://cabtsqukaofxofsufaui.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin
JWT_SECRET=your-secure-jwt-secret
```

### Vercel Setup
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push to main
4. Configure wildcard DNS: `*.stepsciences.com`

## 🔐 Security

- Row Level Security (RLS) on all tables
- Admin-only write access
- Input validation and XSS protection
- Secure iframe sandboxing
- HTTPS enforced on all domains

## 📞 Support

- **New Plant Setup**: Use admin interface
- **Technical Issues**: Check Vercel and Supabase logs
- **Emergency**: Git rollback available

---

*Built for Canadian automotive manufacturing with ❤️*