# API Documentation

> External integrations and APIs used by the Step Sciences Scheduler

## Overview

The Step Sciences Scheduler integrates with several external services to provide a seamless appointment booking and intake form experience. This document outlines all external APIs, their purposes, integration patterns, and potential issues.

## 🗂️ Table of Contents

- [Google Calendar API](#google-calendar-api)
- [External Intake Forms](#external-intake-forms)
- [Font and Icon APIs](#font-and-icon-apis)
- [Domain Resolution](#domain-resolution)
- [Configuration API](#configuration-api)
- [Integration Patterns](#integration-patterns)
- [Security Considerations](#security-considerations)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## 📅 Google Calendar API

### Purpose
Provides embedded appointment scheduling functionality for each client.

### Integration Type
Client-side JavaScript SDK with iframe embedding.

### Endpoints

#### Scheduling Button Script
```
https://calendar.google.com/calendar/scheduling-button-script.js
```
- **Method**: GET (Script loading)
- **Purpose**: Loads Google Calendar scheduling functionality
- **Response**: JavaScript SDK
- **Caching**: Browser cache only

#### Scheduling Button CSS
```
https://calendar.google.com/calendar/scheduling-button-script.css
```
- **Method**: GET (CSS loading)
- **Purpose**: Default styling for Google Calendar buttons
- **Response**: CSS stylesheet
- **Caching**: Browser cache only

#### Calendar Booking URLs
```
https://calendar.google.com/calendar/u/0/appointments/schedules/{SCHEDULE_ID}
```

**Example URLs by Client:**
| Client | Schedule ID | Full URL |
|--------|-------------|----------|
| GM Oshawa | `AcZssZ13iuKCFJo-LEdLYI0xL61iPO3DA4XB5di_P9b7NQ05dR2qYKjYKjCu9hzYaBn3G2-p8o2qDoE9` | [Link](https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ13iuKCFJo-LEdLYI0xL61iPO3DA4XB5di_P9b7NQ05dR2qYKjYKjCu9hzYaBn3G2-p8o2qDoE9) |
| GM CAMI | `AcZssZ1Qf9K1O090x0jfhUtHXSjuqYWoMPt-qnoOprYgAFZ6t4YTono4Vu2wzhrZyCzP4VaPsQe8z7oW` | [Link](https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1Qf9K1O090x0jfhUtHXSjuqYWoMPt-qnoOprYgAFZ6t4YTono4Vu2wzhrZyCzP4VaPsQe8z7oW) |
| Stellantis Windsor | `AcZssZ1kC5ubA-6Nc_ZIYopLxcxhZf27MKHL2DKtEWo12EK8jJ3Bs-mUJiDlFSNPht7VZjW0I24hyLcX` | [Link](https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1kC5ubA-6Nc_ZIYopLxcxhZf27MKHL2DKtEWo12EK8jJ3Bs-mUJiDlFSNPht7VZjW0I24hyLcX) |

### Implementation Details

#### SDK Initialization
```javascript
// Component: GoogleCalendarButton.js (Lines 12-115)
useEffect(() => {
  const initializeButton = () => {
    if (window.calendar?.schedulingButton) {
      window.calendar.schedulingButton.load({
        url: companyConfig.calendarUrl,
        color: companyConfig.primaryColor,
        label: 'Book Your Appointment',
        target: calendarButtonRef.current,
      });
    }
  };
}, [companyConfig]);
```

#### Button Customization
```javascript
// Custom styling applied via DOM manipulation
button.style.fontSize = '1.6rem';
button.style.padding = '24px 48px';
button.style.minHeight = '80px';
button.style.borderRadius = '16px';
```

### Error Handling
- **Script Load Failure**: 8-second timeout with fallback to direct URL
- **Button Creation Failure**: Fallback button with `window.open()`
- **Styling Failure**: Basic button remains functional

### Rate Limiting
- **Google's Limits**: Unknown public rate limits
- **Our Usage**: Client-side only, minimal API calls
- **Mitigation**: Fallback to direct calendar URLs

## 📋 External Intake Forms

### Purpose
Embedded forms for collecting patient/client intake information.

### Integration Type
iframe embedding of external web applications.

### Base URL
```
https://step-sciences.web.app/intake/
```

### Client-Specific Endpoints

| Client | Endpoint | Full URL |
|--------|----------|----------|
| GM Oshawa | `/gm/oshawa` | https://step-sciences.web.app/intake/gm/oshawa |
| GM CAMI | `/gm/cami` | https://step-sciences.web.app/intake/gm/cami |
| Stellantis Windsor | `/stellantis/windsor` | https://step-sciences.web.app/intake/stellantis/windsor |
| Stellantis Brampton | `/stellantis/brampton` | https://step-sciences.web.app/intake/stellantis/brampton |
| Ford Windsor | `/ford/ford-windsor` | https://step-sciences.web.app/intake/ford/ford-windsor |
| Ford Oakville | `/ford/oakville` | https://step-sciences.web.app/intake/ford/oakville |
| Copernicus Lodge | `/not-applicable/not-applicable` | https://step-sciences.web.app/intake/not-applicable/not-applicable |

### Implementation Details

#### iframe Embedding
```javascript
// Component: StepContent.js (Lines 216-223)
<iframe
  title="Intake Form"
  src={companyConfig.intakeFormUrl}
  width="100%"
  height="100%"
  frameBorder="0"
/>
```

#### Security Configuration
- **Current**: No sandbox restrictions (⚠️ Security Risk)
- **Recommended**: Add sandbox attributes
```javascript
sandbox="allow-forms allow-scripts allow-same-origin"
```

### Communication
- **Method**: Manual user confirmation (no postMessage API)
- **User Flow**: User completes form → clicks "Form Complete" button
- **Data Exchange**: None (isolated iframe)

## 🎨 Font and Icon APIs

### Google Fonts API

#### Roboto Font Family
```
https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap
```
- **Purpose**: Primary typography for Material-UI
- **Weights**: 300, 400, 500, 700
- **Display**: Swap for performance
- **Fallback**: System fonts (Helvetica, Arial, sans-serif)

#### Material Icons
```
https://fonts.googleapis.com/icon?family=Material+Icons
```
- **Purpose**: Icon fonts for Material-UI components
- **Format**: Icon font (woff2, woff, ttf)
- **Fallback**: Unicode symbols

### Performance Considerations
- **Preconnect**: Recommended for fonts.googleapis.com
- **Font Display**: `swap` strategy implemented
- **Local Fallbacks**: System fonts available

## 🌐 Domain Resolution

### Purpose
Automatic client identification based on subdomain.

### Implementation

#### Domain Detection
```javascript
// Function: getCompanyIdFromDomain() (Lines 132-157)
const hostname = window.location.hostname.toLowerCase();

if (hostname.includes('gmoshawa.stepsciences.com')) return 'gm-oshawa';
if (hostname.includes('gmcami.stepsciences.com')) return 'gm-cami';
// ... additional domain mappings
```

#### Supported Domains
| Domain | Client ID | Status |
|--------|-----------|---------|
| `gmoshawa.stepsciences.com` | `gm-oshawa` | ✅ Active |
| `gmcami.stepsciences.com` | `gm-cami` | ✅ Active |
| `stellantiswindsor.stepsciences.com` | `stellantis-windsor` | ✅ Active |
| `stellantisbrampton.stepsciences.com` | `stellantis-brampton` | ✅ Active |
| `uniforwindsor.stepsciences.com` | `windsor-unifor-200-444` | ✅ Active |
| `copernicus-lodge.stepsciences.com` | `copernicus-lodge` | ✅ Active |
| `fordwindsor.stepsciences.com` | `ford-windsor` | ⚠️ Planned |
| `fordoakville.stepsciences.com` | `ford-oakville` | ⚠️ Planned |

#### Fallback Resolution
1. **URL Parameters**: `?company=client-id`
2. **Default**: `gm-oshawa` (⚠️ Should be configurable)

## ⚙️ Configuration API

### Current Implementation
Static JavaScript object in `src/config/companyConfigs.js`.

### Configuration Schema
```javascript
{
  "client-id": {
    name: "Client Name",
    fullName: "Full Client Name",
    primaryColor: "#000000",
    secondaryColor: "#D4AF37", 
    logo: "/logos/client-logo.png",
    calendarUrl: "https://calendar.google.com/...",
    intakeFormUrl: "https://step-sciences.web.app/intake/...",
    contactEmail: "info@stepsciences.com",
    showBranding: true,
    meetingLocation: "Client Address", // OR
    scanDayLocations: {              // Alternative for multi-location
      monday: "Building A",
      friday: "Building B"
    },
    hasScanDays: true,               // Enables multi-location UI
    specialInstructions: "Instructions",
    domain: "client.stepsciences.com"
  }
}
```

### Future API Design
```
GET /api/v1/companies/{companyId}
```
**Response:**
```json
{
  "id": "gm-oshawa",
  "name": "GM Oshawa",
  "configuration": { /* config object */ },
  "features": {
    "multiLocation": true,
    "customBranding": true
  },
  "lastUpdated": "2025-01-01T00:00:00Z"
}
```

## 🔧 Integration Patterns

### Client-Side Only Architecture
- **No Backend**: All integrations are client-side
- **Static Configuration**: Configs compiled into build
- **External Dependencies**: Direct browser connections

### Loading Strategy
```javascript
// Pattern: Async loading with fallbacks
useEffect(() => {
  if (externalAPI.isLoaded()) {
    initializeIntegration();
  } else {
    // Polling with timeout
    const interval = setInterval(() => {
      if (externalAPI.isLoaded()) {
        clearInterval(interval);
        initializeIntegration();
      }
    }, 500);
    
    setTimeout(() => {
      clearInterval(interval);
      showFallback();
    }, 8000);
  }
}, []);
```

### Error Handling Pattern
```javascript
try {
  await externalAPI.call();
} catch (error) {
  console.error('API call failed:', error);
  // Fallback behavior
  showAlternativeUI();
}
```

## 🔒 Security Considerations

### Current Issues
1. **No SRI**: External scripts lack integrity verification
2. **No CSP**: Content Security Policy not implemented
3. **Iframe Security**: No sandbox restrictions
4. **URL Validation**: External URLs not validated

### Recommended Security Headers
```html
<!-- Subresource Integrity -->
<script 
  src="https://calendar.google.com/calendar/scheduling-button-script.js"
  integrity="sha384-[hash]"
  crossorigin="anonymous">
</script>

<!-- Content Security Policy -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://calendar.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src https://step-sciences.web.app;
">
```

## 🚨 Error Handling

### Common Error Scenarios

#### Google Calendar API Failures
**Symptoms:**
- Button doesn't appear
- Styling fails to apply
- Console errors about `window.calendar`

**Handling:**
```javascript
// Fallback button implementation
if (showFallback) {
  return (
    <Button onClick={() => window.open(calendarUrl, '_blank')}>
      📅 Book Your Appointment
    </Button>
  );
}
```

#### iframe Loading Failures
**Symptoms:**
- Blank iframe
- "This site can't be reached"
- Cross-origin errors

**Handling:**
- No current error detection
- Manual user reporting required

#### Font Loading Failures
**Symptoms:**
- Fallback fonts displayed
- Icon squares instead of symbols

**Handling:**
- Automatic fallback to system fonts
- No user intervention required

### Error Monitoring
- **Current**: Console logging only
- **Recommended**: Error tracking service (Sentry, LogRocket)

## ⏱️ Rate Limiting

### Google Calendar API
- **Public Limits**: Not documented
- **Our Usage**: Client-side button embedding
- **Risk Level**: Low (read-only access)

### Google Fonts API
- **Public Limits**: Very generous for font loading
- **Our Usage**: Font CSS and files
- **Risk Level**: Very low

### Step Sciences Intake Forms
- **Limits**: Controlled by Firebase hosting
- **Usage**: iframe embedding only
- **Risk Level**: Low

### Mitigation Strategies
1. **Caching**: Browser cache for all resources
2. **Fallbacks**: Direct URLs when APIs fail
3. **Monitoring**: Track API availability
4. **Service Workers**: Cache critical resources

## 🔮 Future API Considerations

### Planned Backend API
```
Base URL: https://api.stepsciences.com/v1/
```

#### Endpoints
- `GET /companies` - List all companies
- `GET /companies/{id}` - Get company configuration  
- `POST /bookings` - Create appointment booking
- `POST /intake` - Submit intake form data
- `GET /health` - API health check

#### Authentication
- JWT tokens for admin operations
- Public endpoints for client configurations
- API keys for external integrations

#### Rate Limiting
- 1000 requests/hour per IP for public endpoints
- 10,000 requests/hour for authenticated users
- Exponential backoff for retries

---

## 📞 Support

For API-related issues:
1. Check [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Verify external service status
3. Test with fallback mechanisms
4. Report persistent issues on GitHub

*Last updated: January 2025*