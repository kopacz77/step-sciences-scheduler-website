# Step Sciences Appointment Scheduler Portal

A modern, multi-tenant appointment scheduling portal built with React 19, Material UI 7, and deployed on Vercel with custom subdomain support.

## Overview

This project creates a user-friendly interface for booking appointments and completing intake forms in a guided, step-by-step process. Originally designed for GM Oshawa, it now serves multiple clients across automotive, hospitality, and corporate sectors through dynamic branding and custom subdomains.

## Key Features

- **Multi-Tenant Architecture**: Serves multiple clients with custom branding via subdomains
- **Google Calendar Integration**: Direct booking through Google's appointment scheduling
- **Guided User Flow**: Step-by-step process prevents users from skipping required steps
- **Dynamic Branding**: Company-specific colors, logos, messaging, and locations
- **Custom Subdomains**: Professional client URLs (e.g., `gmoshawa.stepsciences.com`)
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modular Component Architecture**: Clean, maintainable React components
- **Vercel Deployment**: Automatic deployments with unlimited custom domains

## Live Client Sites

- **GM Oshawa**: `gmoshawa.stepsciences.com`
- **GM CAMI**: `gmcami.stepsciences.com`
- **Stellantis Windsor**: `stellantiswindsor.stepsciences.com`
- **Stellantis Brampton**: `stellantisbrampton.stepsciences.com`
- **Unifor Windsor**: `uniforwindsor.stepsciences.com`
- **Copernicus Lodge**: `copernicus-lodge.stepsciences.com`
- **Main Portal**: `appointments.stepsciences.com`

## Technologies

- **Frontend**: React 19, Material UI 7
- **Build Tool**: Create React App
- **Package Manager**: pnpm
- **Code Quality**: Biome (linting/formatting)
- **Deployment**: Vercel
- **DNS**: Custom subdomains via GoDaddy
- **Integration**: Google Calendar Appointment Scheduling

## Quick Start

### Prerequisites
- Node.js (v16 or later)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/automotive-scheduler-website
cd automotive-scheduler-website
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Start development server:**
```bash
pnpm start
```

4. **Visit local development:**
```
http://localhost:3000                              # Default (GM Oshawa)
http://localhost:3000?company=copernicus-lodge     # Specific client
```

## Project Architecture

### File Structure
```
src/
├── components/
│   ├── Header.js                  # Company-branded header
│   ├── GoogleCalendarButton.js    # Calendar integration
│   ├── ScanDayLocationInfo.js     # Multi-location display
│   └── StepContent.js            # Main step content
├── config/
│   └── companyConfigs.js         # Client configurations
├── App.js                        # Main application logic
└── index.js                      # Entry point

public/
├── logos/                        # Client logos
├── index.html                    # Google Calendar scripts
└── manifest.json                # PWA configuration

vercel.json                       # Vercel deployment config
```

### Client Configuration System

Each client is configured in `src/config/companyConfigs.js`:

```javascript
'client-id': {
  name: 'Client Name',
  fullName: 'Full Client Name',
  primaryColor: '#000000',
  secondaryColor: '#D4AF37',
  logo: '/logos/client-logo.png',
  calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/[ID]',
  intakeFormUrl: 'https://step-sciences.web.app/intake/client/path',
  contactEmail: 'info@stepsciences.com',
  meetingLocation: 'Client Address',
  specialInstructions: 'Client-specific instructions',
  domain: 'client-id.stepsciences.com'
}
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

## Configuration Options

### Standard Client
```javascript
'client-id': {
  // Basic configuration
  meetingLocation: 'Single location address',
  // ... other properties
}
```

### Multi-Location Client (GM Oshawa)
```javascript
'gm-oshawa': {
  // Dual-location configuration
  scanDayLocations: {
    monday: 'Building C - Medical Offices',
    friday: 'Building D - TFT Boardrooms'
  },
  hasScanDays: true,
  // ... other properties
}
```

## Domain Routing

### Subdomain Detection
The app automatically detects the client based on the subdomain:
- `gmoshawa.stepsciences.com` → GM Oshawa branding
- `copernicus-lodge.stepsciences.com` → Lodge branding
- `appointments.stepsciences.com?company=client-id` → Parameter fallback

### Fallback System
If subdomain detection fails, the app falls back to URL parameters, ensuring reliability.

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

## Adding New Clients

> **See `READMENEWCLIENT.md`** for detailed step-by-step instructions on adding new clients.

Quick overview:
1. Add configuration to `companyConfigs.js`
2. Add client logo to `public/logos/`
3. Configure domain in Vercel
4. Add DNS record
5. Test and deploy

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

**For detailed client addition procedures, see `READMENEWCLIENT.md`**

*System designed for simplicity, reliability, and scale.*