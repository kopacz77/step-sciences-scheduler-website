# Step Sciences Appointment Scheduler - Reference Guide

A multi-tenant React appointment scheduling portal that integrates with Google Calendar and serves multiple clients through custom subdomains.

## 🏗️ System Architecture

```
appointments.stepsciences.com (main domain + fallback)
├── gmoshawa.stepsciences.com → GM Oshawa branding
├── copernicus-lodge.stepsciences.com → Lodge branding  
├── stellantiswindsor.stepsciences.com → Stellantis branding
└── [client-id].stepsciences.com → Dynamic client branding
```

**How it works:**
1. **Domain detection** → Determines which client config to load
2. **Dynamic branding** → Company colors, logos, messaging
3. **Google Calendar integration** → Each client's booking calendar
4. **Intake form routing** → Client-specific intake forms

## 📁 Project Structure

```
src/
├── App.js                      # Main application logic
├── index.js                    # Entry point
├── components/
│   ├── Header.js              # Company-branded header
│   ├── GoogleCalendarButton.js # Calendar booking integration
│   ├── ScanDayLocationInfo.js  # GM Oshawa dual-location display
│   └── StepContent.js         # Main step-by-step content
└── config/
    └── companyConfigs.js      # ⭐ CLIENT CONFIGURATION FILE

public/
├── logos/                     # Client logos
├── index.html                # Main HTML + Google Calendar scripts
└── manifest.json             # PWA config

vercel.json                   # Vercel deployment config
package.json                  # Dependencies (cleaned for Vercel)
```

## 🚀 Adding a New Client (10-Minute Process)

### Step 1: Get Client Information
Collect from client:
- [ ] **Company name** (e.g., "Acme Corp")
- [ ] **Google Calendar booking URL** 
- [ ] **Meeting location/address**
- [ ] **Logo file** (PNG format, ~200x50px recommended)
- [ ] **Special instructions** (what to bring, etc.)
- [ ] **Industry type** (determines color scheme)

### Step 2: Add Client Configuration

**File:** `src/config/companyConfigs.js`

Add new entry to the `companyConfigs` object:

```javascript
'acme-corp': {  // Always use kebab-case for ID
  name: 'Acme Corp',
  fullName: 'Acme Corporation',
  primaryColor: '#000000',        // Main brand color
  secondaryColor: '#D4AF37',      // Accent color  
  logo: '/logos/acme-corp.png',
  calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/[CLIENT_CALENDAR_ID]',
  intakeFormUrl: 'https://step-sciences.web.app/intake/acme/corp',
  contactEmail: 'info@stepsciences.com',
  showBranding: true,
  meetingLocation: 'Acme Corp Headquarters, 123 Main St, Toronto, ON',
  specialInstructions: 'Please bring valid ID and insurance information.',
  domain: 'acme-corp.stepsciences.com'
},
```

**Update domain detection function:**
```javascript
// Add this line to getCompanyIdFromDomain()
if (hostname.includes('acme-corp.stepsciences.com')) return 'acme-corp';
```

### Step 3: Add Client Logo
- [ ] **File location:** `public/logos/acme-corp.png`
- [ ] **Naming:** Must match the `logo` path in config
- [ ] **Size:** Optimize for ~200x50px display

### Step 4: Deploy to Vercel
```bash
# Commit changes to GitHub (triggers auto-deploy)
git add .
git commit -m "Add Acme Corp client configuration"  
git push origin main

# Vercel automatically deploys from GitHub
```

### Step 5: Configure Domain in Vercel
1. **Go to Vercel Dashboard** → Your Project → Settings → Domains
2. **Add domain:** `acme-corp.stepsciences.com`
3. **Copy the DNS instructions** (usually CNAME record)

### Step 6: Configure DNS in GoDaddy
1. **Login to GoDaddy** → DNS Management
2. **Add CNAME record:**
   - **Type:** CNAME
   - **Name:** acme-corp
   - **Value:** cname.vercel-dns.com (or as shown in Vercel)
   - **TTL:** 1 Hour

### Step 7: Test Everything
- [ ] **Direct subdomain:** `https://acme-corp.stepsciences.com`
- [ ] **URL parameter fallback:** `https://appointments.stepsciences.com?company=acme-corp`
- [ ] **Calendar button functionality**
- [ ] **Intake form link**
- [ ] **Branding displays correctly**

### Step 8: Deliver to Client
Send client their booking URL: `https://acme-corp.stepsciences.com`

## 🎨 Industry Templates & Color Schemes

### Automotive (Default)
```javascript
primaryColor: '#000000',    // Black
secondaryColor: '#D4AF37'   // Gold
```

### Hospitality/Lodge
```javascript
primaryColor: '#8B4513',    // Saddle Brown  
secondaryColor: '#DAA520'   // Goldenrod
```

### Healthcare
```javascript
primaryColor: '#2E8B57',    // Sea Green
secondaryColor: '#98FB98'   // Pale Green  
```

### Corporate/General
```javascript
primaryColor: '#1976D2',    // Blue
secondaryColor: '#42A5F5'   // Light Blue
```

## 🔧 Special Configurations

### Dual-Location Sites (GM Oshawa Style)
For clients with multiple meeting locations:

```javascript
'client-id': {
  // ... other config
  scanDayLocations: {
    monday: 'Building A - First Floor',
    friday: 'Building B - Conference Room'  
  },
  hasScanDays: true  // Enables dual-location UI
},
```

### Standard Single Location
```javascript
'client-id': {
  // ... other config
  meetingLocation: 'Main Office, 123 Business St, City, Province',
  // No hasScanDays property needed
},
```

## 🌐 Domain Management

### Current Live Domains
- `appointments.stepsciences.com` - Main domain + fallback
- `gmoshawa.stepsciences.com` - GM Oshawa  
- `gmcami.stepsciences.com` - GM CAMI
- `stellantiswindsor.stepsciences.com` - Stellantis Windsor
- `uniforwindsor.stepsciences.com` - Unifor Windsor
- `stellantisbrampton.stepsciences.com` - Stellantis Brampton
- `copernicus-lodge.stepsciences.com` - Copernicus Lodge

### DNS Setup Checklist
- [ ] **Add domain in Vercel** (Settings → Domains)
- [ ] **Add CNAME in GoDaddy** (DNS Management)  
- [ ] **Wait for SSL certificate** (5-30 minutes)
- [ ] **Test HTTPS access**
- [ ] **Verify branding loads correctly**

## 📱 Google Calendar Integration

### URL Formats Supported
**Old format (most automotive clients):**
```
https://calendar.google.com/calendar/u/0/appointments/schedules/[LONG_ID]
```

**New format (newer clients):**  
```
https://calendar.app.google/[SHORT_ID]
```

### Getting Calendar URL from Client
1. **Client creates appointment schedule** in Google Calendar
2. **Client clicks "Share"** on the appointment schedule  
3. **Copy the booking page URL** (not the embed code)
4. **Provide this URL** for the `calendarUrl` config

### Button Integration
- **Button automatically sizes** to be prominent
- **Fallback functionality** if Google's script fails
- **Works with both URL formats**

## 🔍 Testing Checklist

### Before Going Live
- [ ] **Logo displays correctly** (check file path/name)
- [ ] **Colors match** client branding
- [ ] **Calendar button opens** correct booking page
- [ ] **Intake form link** works and goes to right form
- [ ] **Meeting location** displays correctly  
- [ ] **Special instructions** are accurate
- [ ] **Contact email** is correct
- [ ] **Mobile responsive** design works
- [ ] **All steps flow** correctly (Schedule → Intake → Complete)

### Domain Testing
- [ ] **Direct subdomain access:** `https://[client].stepsciences.com`
- [ ] **Parameter fallback:** `https://appointments.stepsciences.com?company=[client-id]`
- [ ] **HTTPS certificate** is valid and secure
- [ ] **No mixed content warnings**

## 🚨 Troubleshooting

### Common Issues & Solutions

**"Company not found" or default branding shows:**
- ✅ Check client ID matches exactly in config and domain detection
- ✅ Verify domain detection function includes new client
- ✅ Clear browser cache and test

**Logo not displaying:**
- ✅ Check file exists at `/public/logos/[client-id].png`
- ✅ Verify file name matches exactly (case-sensitive)
- ✅ Ensure file is committed to Git

**Calendar button not working:**
- ✅ Test calendar URL directly in browser
- ✅ Check for CORS issues or invalid URL format
- ✅ Verify Google Calendar scripts load (check browser console)

**DNS/Domain issues:**
- ✅ Wait 5-30 minutes for DNS propagation
- ✅ Check CNAME points to correct Vercel DNS
- ✅ Verify domain added in Vercel dashboard
- ✅ Use DNS checker tool: `https://dnschecker.org`

**Build/deployment failures:**
- ✅ Check for syntax errors in companyConfigs.js
- ✅ Ensure all imports are correct
- ✅ Verify package.json has no GitHub Pages references

## 🔄 Maintenance Tasks

### Monthly
- [ ] **Check all client domains** still resolve correctly
- [ ] **Verify calendar integrations** still work
- [ ] **Test contact email** deliverability
- [ ] **Check Vercel usage** (bandwidth, function calls)

### When Client Changes Info
- [ ] **Update companyConfigs.js** with new details
- [ ] **Replace logo file** if provided
- [ ] **Test changes** on staging
- [ ] **Deploy and verify** changes live

### Adding New Features
- [ ] **Test with multiple clients** to ensure no breaking changes
- [ ] **Update this README** with new procedures
- [ ] **Document any new config options**

## 📊 Vercel Free Tier Limits

**Current Usage (Well Within Limits):**
- **Bandwidth:** 100 GB/month (using <5 GB)
- **Function Invocations:** 100,000/month (using ~1,000)  
- **Build Minutes:** 6,000/month (using ~100)
- **Projects:** 200 max (using 1)
- **Domains:** Unlimited ✅

**Scaling:** Can easily handle 50+ clients on free tier.

## 🎯 Business Model Notes

### Client Tiers
**Premium (Major Industrial):** Custom subdomain + full branding
- GM, Stellantis, Ford
- Dedicated setup and support

**Standard (Corporate/Lodge):** Professional subdomain + template branding  
- Copernicus Lodge, smaller companies
- Quick setup, standard support

**Basic (Rare):** URL parameter routing
- Emergency/temporary setups
- Minimal branding

### Pricing Considerations
- **Setup time:** ~15 minutes per client
- **Maintenance:** Minimal ongoing work
- **Infrastructure cost:** $0 (Vercel free tier)
- **Scalability:** Excellent

## 🚀 Quick Reference Commands

```bash
# Start development server
pnpm start

# Build for production (Vercel does this automatically)
pnpm build

# Format code
pnpm run format

# Lint code  
pnpm run lint

# Check for issues
pnpm run check
```

## 📞 Emergency Contacts

**If something breaks:**
1. **Check Vercel dashboard** for deployment issues
2. **Check GitHub Actions** for build failures  
3. **Check DNS status** at registrar
4. **Rollback via Git** if needed: `git revert [commit-hash]`

**Client asks for changes:**
1. **Get specific requirements** in writing
2. **Update config file** accordingly
3. **Test thoroughly** before deploying
4. **Document changes** in commit message

---

## 💡 Remember: Simplicity is Key
- ✅ **Manual client addition works perfectly** for your scale
- ✅ **Google Calendar handles the complex scheduling logic**  
- ✅ **Your app is just smart routing + branding**
- ✅ **Don't over-engineer** - this system scales beautifully as-is

*Last updated: January 2025*