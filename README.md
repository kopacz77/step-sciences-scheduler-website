# Step Sciences Scheduler Portal

> A modern, multi-tenant appointment scheduling platform serving healthcare and performance assessment services across multiple industries.

[![Vercel](https://img.shields.io/badge/deployed-vercel-black?style=flat-square&logo=vercel)](https://appointments.stepsciences.com)
[![React](https://img.shields.io/badge/react-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/mui-7.0.0-blue?style=flat-square&logo=mui)](https://mui.com/)
[![TypeScript Ready](https://img.shields.io/badge/typescript-ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

## 🎯 Overview

The Step Sciences Scheduler is a sophisticated multi-tenant React application that streamlines appointment booking and intake form completion through a guided 3-step process. Built for scalability and ease of use, it serves clients across automotive, healthcare, hospitality, and corporate sectors with customized branding and workflows.

## ✨ Key Features

- **🏢 Multi-Tenant Architecture**: Serves multiple clients with custom branding via subdomains
- **📅 Google Calendar Integration**: Direct booking through Google's appointment scheduling API
- **🎯 Guided User Flow**: Intuitive 3-step process ensures completion of all required tasks
- **🎨 Dynamic Branding**: Company-specific colors, logos, messaging, and locations
- **🌐 Custom Subdomains**: Professional client URLs (e.g., `gmoshawa.stepsciences.com`)
- **📱 Responsive Design**: Optimized for desktop and mobile devices with touch-friendly interfaces
- **⚡ Performance Optimized**: Fast loading with Material-UI components and efficient rendering
- **🔧 Modular Architecture**: Clean, maintainable React components with separation of concerns
- **🚀 Vercel Deployment**: Automatic deployments with unlimited custom domains and SSL

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

### Prerequisites
- **Node.js** (v18 or later) - [Download](https://nodejs.org/)
- **pnpm** (recommended) - `npm install -g pnpm`

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/kopacz77/step-sciences-scheduler-website
cd step-sciences-scheduler-website
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Start development server:**
```bash
pnpm start
```

4. **Open your browser:**
```
🌐 Local:           http://localhost:3000
🎯 Specific client: http://localhost:3000?company=copernicus-lodge
📱 Mobile testing:  http://192.168.1.xxx:3000
```

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm start` | Start development server |
| `pnpm build` | Build for production |
| `pnpm format` | Format code with Biome |
| `pnpm lint` | Lint code with Biome |
| `pnpm check` | Check and fix code issues |

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

## 📚 Documentation

- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to this project
- [Deployment Guide](DEPLOYMENT.md) - Production deployment procedures
- [API Documentation](API.md) - External integrations and APIs
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions
- [Client Setup Guide](READMENEWCLIENT.md) - Adding new clients (detailed)
- [Changelog](CHANGELOG.md) - Version history and changes

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Setting up the development environment
- Code style and standards
- Pull request process
- Testing requirements

## 📄 License

© 2025 Step Sciences. All rights reserved.

## 🆘 Support

- **Technical Issues**: Check [Troubleshooting Guide](TROUBLESHOOTING.md)
- **Client Requests**: Contact development team
- **Emergency**: Rollback via Git if needed

---

**For detailed client addition procedures, see [Client Setup Guide](READMENEWCLIENT.md)**

*Built with ❤️ for simplicity, reliability, and scale.*