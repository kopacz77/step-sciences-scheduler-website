# Troubleshooting Guide

> Common issues and solutions for the Step Sciences Scheduler

## 🎯 Quick Reference

| Issue Type | Quick Fix | Details |
|------------|-----------|---------|
| **Wrong branding** | Check URL or add `?company=client-id` | [Client Configuration](#client-configuration-issues) |
| **Google Calendar button missing** | Wait 10 seconds or refresh page | [Google Calendar](#google-calendar-integration) |
| **Intake form not loading** | Check iframe source URL | [Intake Forms](#intake-form-issues) |
| **Mobile layout broken** | Clear cache and test different devices | [Mobile Issues](#mobile-responsiveness) |
| **Domain not working** | Check DNS propagation | [Domain Issues](#domain-and-dns-issues) |

## 🗂️ Table of Contents

- [Client Configuration Issues](#client-configuration-issues)
- [Google Calendar Integration](#google-calendar-integration)
- [Intake Form Issues](#intake-form-issues)
- [Mobile Responsiveness](#mobile-responsiveness)
- [Domain and DNS Issues](#domain-and-dns-issues)
- [Performance Problems](#performance-problems)
- [Security and SSL](#security-and-ssl)
- [Development Issues](#development-issues)
- [Deployment Problems](#deployment-problems)
- [Browser Compatibility](#browser-compatibility)

## 🏢 Client Configuration Issues

### Wrong Client Branding Displayed

**Symptoms:**
- Shows default (GM Oshawa) branding instead of expected client
- Wrong colors, logo, or meeting location
- Calendar URLs point to wrong booking page

**Causes:**
- Domain mapping not configured properly
- Client ID not found in configuration
- Browser cache showing old configuration

**Solutions:**

#### 1. Check URL and Domain
```bash
# Verify you're using the correct domain
✅ Correct: https://copernicus-lodge.stepsciences.com
❌ Wrong:   https://appointments.stepsciences.com

# Or use URL parameter
✅ Fallback: https://appointments.stepsciences.com?company=copernicus-lodge
```

#### 2. Verify Client Configuration
```javascript
// Check if client exists in companyConfigs.js
const config = getCompanyConfig('your-client-id');
console.log(config); // Should not be the default gm-oshawa
```

#### 3. Clear Browser Cache
```bash
# Hard refresh
Ctrl+F5 (Windows/Linux)
Cmd+Shift+R (Mac)

# Or clear cache manually
Chrome: Settings → Privacy → Clear browsing data
```

#### 4. Check Domain Detection
```javascript
// Debug domain detection
console.log(window.location.hostname);
console.log(getCompanyIdFromDomain());
```

### Client Not Found / 404 Errors

**Symptoms:**
- "Company not found" message
- Application shows error state
- Fallback to default configuration

**Solutions:**

#### 1. Verify Client ID Format
```javascript
// Client IDs must use kebab-case
✅ Correct: 'copernicus-lodge'
❌ Wrong:   'Copernicus Lodge'
❌ Wrong:   'copernicus_lodge'
```

#### 2. Check Configuration File
```javascript
// Ensure client exists in src/config/companyConfigs.js
const companyConfigs = {
  'your-client-id': {
    name: 'Your Client Name',
    // ... rest of configuration
  }
};
```

#### 3. Verify Domain Mapping
```javascript
// Check getCompanyIdFromDomain() function
if (hostname.includes('yourclient.stepsciences.com')) return 'your-client-id';
```

## 📅 Google Calendar Integration

### Google Calendar Button Not Appearing

**Symptoms:**
- Blank space where calendar button should be
- Fallback button shows instead of Google's embedded button
- Console errors about `window.calendar`

**Causes:**
- Google Calendar script failed to load
- Network connectivity issues
- Ad blockers interfering with Google scripts
- Calendar URL configuration issues

**Solutions:**

#### 1. Check Script Loading
```javascript
// Open browser console and check:
console.log(window.calendar); // Should be an object, not undefined

// Check for script load errors
// Look for 404 or network errors in Network tab
```

#### 2. Disable Ad Blockers
```bash
# Temporarily disable:
- uBlock Origin
- AdBlock Plus
- Browser built-in ad blocking
- VPN ad blocking features
```

#### 3. Test Calendar URL Directly
```bash
# Copy calendar URL from configuration
# Open in new tab - should show Google Calendar booking page
# If it doesn't work, URL is incorrect
```

#### 4. Clear DNS Cache
```bash
# Windows
ipconfig /flushdns

# Mac
sudo dscacheutil -flushcache

# Linux
sudo systemctl restart systemd-resolved
```

#### 5. Check Network Connectivity
```bash
# Test Google services
ping calendar.google.com
ping fonts.googleapis.com
```

### Google Calendar Button Styling Issues

**Symptoms:**
- Button appears but looks wrong (size, colors)
- Button doesn't match app branding
- Hover effects not working

**Solutions:**

#### 1. Wait for Styling Application
```javascript
// Styling is applied after a 2-second delay
// Wait 5-10 seconds after page load
```

#### 2. Check Console for Styling Errors
```javascript
// Look for messages like:
"Successfully styled Google Calendar button for mobile/desktop"
"Could not find Google Calendar button"
```

#### 3. Force Refresh Button
```javascript
// If button appears but isn't styled, refresh page
// Or wait for automatic retry (happens every 3-5 seconds)
```

## 📋 Intake Form Issues

### Intake Form Not Loading (Blank iframe)

**Symptoms:**
- White/blank iframe where form should appear
- "This site can't be reached" in iframe
- iframe shows "404 Not Found"

**Causes:**
- Intake form URL incorrect
- Firebase hosting issues
- Network connectivity problems
- CORS or security restrictions

**Solutions:**

#### 1. Test Form URL Directly
```bash
# Copy intake form URL from configuration
# Open in new tab
# Should show Step Sciences intake form
https://step-sciences.web.app/intake/gm/oshawa
```

#### 2. Check Form URL Configuration
```javascript
// Verify URL in companyConfigs.js
intakeFormUrl: 'https://step-sciences.web.app/intake/gm/oshawa'

// Common mistakes:
❌ Wrong: 'http://step-sciences.web.app/...'  // Missing 's' in https
❌ Wrong: 'https://step-sciences.app/...'     // Wrong domain
❌ Wrong: 'https://step-sciences.web.app/gm/oshawa' // Missing /intake/
```

#### 3. Check Browser Security Settings
```bash
# Some browsers block cross-origin iframes
# Try in incognito/private mode
# Check if corporate firewall is blocking
```

### Intake Form Loads But Won't Submit

**Symptoms:**
- Form appears and can be filled out
- Submit button doesn't work or shows errors
- Form resets or shows "try again" message

**Solutions:**

#### 1. Check Form Status
```bash
# Check Step Sciences status page (if available)
# Or test other client intake forms
```

#### 2. Test Different Browser
```bash
# Try in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Incognito/Private mode
```

#### 3. Disable Browser Extensions
```bash
# Disable extensions that might interfere:
- Password managers
- Form fillers
- Ad blockers
- Privacy tools
```

## 📱 Mobile Responsiveness

### Layout Broken on Mobile

**Symptoms:**
- Text too small to read
- Buttons too small to tap
- Horizontal scrolling required
- Elements overlapping

**Solutions:**

#### 1. Clear Mobile Browser Cache
```bash
# iOS Safari: Settings → Safari → Clear History and Website Data
# Android Chrome: Settings → Privacy → Clear browsing data
```

#### 2. Test Different Mobile Browsers
```bash
# iOS: Safari, Chrome, Firefox
# Android: Chrome, Firefox, Samsung Internet
```

#### 3. Check Viewport Meta Tag
```html
<!-- Should be present in index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

#### 4. Test on Different Screen Sizes
```bash
# Chrome DevTools
F12 → Device Toolbar → Select different devices
iPhone 12, Pixel 5, iPad, etc.
```

### Google Calendar Button Too Small on Mobile

**Symptoms:**
- Calendar button is tiny and hard to tap
- Button styling doesn't match mobile design
- Button appears but isn't optimized for touch

**Solutions:**

#### 1. Wait for Mobile Styling
```javascript
// Mobile-specific styling is applied automatically
// Wait 5-10 seconds after page load
```

#### 2. Check Mobile Detection
```javascript
// Debug mobile detection
console.log(window.matchMedia('(max-width:600px)').matches);
// Should be true on mobile devices
```

#### 3. Force Mobile View
```bash
# In browser DevTools:
F12 → Device Toolbar → Select mobile device
Refresh page to trigger mobile styling
```

## 🌐 Domain and DNS Issues

### Custom Domain Not Working

**Symptoms:**
- "This site can't be reached"
- "DNS_PROBE_FINISHED_NXDOMAIN"
- Domain points to wrong site or shows ads

**Causes:**
- DNS not configured properly
- DNS propagation still in progress
- CNAME record pointing to wrong target
- TTL too high causing slow updates

**Solutions:**

#### 1. Check DNS Configuration
```bash
# Check CNAME record
dig yourclient.stepsciences.com CNAME

# Should show:
yourclient.stepsciences.com. 3600 IN CNAME cname.vercel-dns.com.
```

#### 2. Verify Vercel Configuration
```bash
# In Vercel dashboard:
Project → Settings → Domains
Domain should be listed and show "Valid Configuration"
```

#### 3. Check DNS Propagation
```bash
# Online tools:
https://dnschecker.org
https://whatsmydns.net

# Command line:
nslookup yourclient.stepsciences.com
```

#### 4. Wait for Propagation
```bash
# DNS changes can take:
- 5 minutes to 2 hours (typical)
- Up to 48 hours (maximum)
- Check every 30 minutes
```

### SSL Certificate Issues

**Symptoms:**
- "Your connection is not private"
- "NET::ERR_CERT_AUTHORITY_INVALID"
- Browser shows security warning

**Solutions:**

#### 1. Wait for Certificate Generation
```bash
# SSL certificates auto-generate after DNS is configured
# Usually takes 5-30 minutes
# Check Vercel dashboard for certificate status
```

#### 2. Force Certificate Regeneration
```bash
# In Vercel dashboard:
Project → Settings → Domains → [Domain] → Regenerate Certificate
```

#### 3. Check Certificate Details
```bash
# In browser:
Click padlock icon → Certificate → Details
Should show "Let's Encrypt" as issuer
```

## ⚡ Performance Problems

### Site Loading Slowly

**Symptoms:**
- Page takes more than 5 seconds to load
- Google Calendar button takes long to appear
- Images or fonts loading slowly

**Causes:**
- Network connectivity issues
- External resource loading delays
- Large bundle size
- Server issues

**Solutions:**

#### 1. Test Network Speed
```bash
# Check internet connection speed
# Try from different network (mobile data, different WiFi)
```

#### 2. Check Resource Loading
```bash
# Chrome DevTools → Network tab
# Look for:
- Red/failed requests
- Slow-loading resources (>3 seconds)
- Large file sizes
```

#### 3. Test Different Locations
```bash
# Try accessing from:
- Different geographic locations
- Different devices
- Different networks
```

#### 4. Check Vercel Status
```bash
# Visit: https://vercel-status.com
# Check for any ongoing incidents
```

### Memory Issues / Browser Becomes Slow

**Symptoms:**
- Browser tab becomes unresponsive
- High CPU usage
- Browser warns about memory usage

**Causes:**
- Memory leaks in Google Calendar integration
- Too many setTimeout/setInterval calls
- Large DOM tree

**Solutions:**

#### 1. Refresh the Page
```bash
# Simple refresh usually fixes memory issues
F5 or Ctrl+R
```

#### 2. Close Other Tabs
```bash
# Reduce browser memory usage
# Close unnecessary tabs and extensions
```

#### 3. Use Different Browser
```bash
# If issue persists, try:
- Incognito/Private mode
- Different browser entirely
```

## 🔒 Security and SSL

### Security Warnings

**Symptoms:**
- "This site may be compromised"
- "Unsafe scripts" warnings
- Mixed content warnings

**Solutions:**

#### 1. Check for HTTPS
```bash
# Ensure all URLs use HTTPS:
✅ https://appointments.stepsciences.com
❌ http://appointments.stepsciences.com
```

#### 2. Clear Browser Security State
```bash
# Chrome: Settings → Privacy → Clear browsing data
# Include "Cookies and other site data"
```

#### 3. Check Mixed Content
```bash
# Chrome DevTools → Console
# Look for mixed content warnings
# All external resources should use HTTPS
```

## 💻 Development Issues

### Local Development Server Won't Start

**Symptoms:**
- `pnpm start` fails with errors
- Port 3000 already in use
- Module not found errors

**Solutions:**

#### 1. Check Node.js Version
```bash
node --version  # Should be 18+
pnpm --version  # Should be latest
```

#### 2. Clear Dependencies
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### 3. Kill Existing Processes
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 pnpm start
```

### Build Failures

**Symptoms:**
- `pnpm build` fails with errors
- TypeScript errors (future)
- Linting errors

**Solutions:**

#### 1. Fix Linting Errors
```bash
pnpm lint
pnpm format
pnpm check
```

#### 2. Check Dependencies
```bash
pnpm audit
pnpm update
```

#### 3. Clean Build
```bash
rm -rf build
pnpm build
```

## 🚀 Deployment Problems

### Vercel Deployment Failing

**Symptoms:**
- Build fails in Vercel dashboard
- Deployment shows error status
- Site not updating after push

**Solutions:**

#### 1. Check Build Logs
```bash
# In Vercel dashboard:
Deployments → [Failed deployment] → View function logs
```

#### 2. Test Build Locally
```bash
pnpm install
pnpm build
# Should complete without errors
```

#### 3. Check Package.json
```bash
# Ensure all dependencies are listed
# No missing or incompatible versions
```

### Site Not Updating After Deployment

**Symptoms:**
- Git push successful
- Vercel shows successful deployment
- Site still shows old content

**Causes:**
- Browser cache
- CDN cache
- DNS propagation delay

**Solutions:**

#### 1. Hard Refresh
```bash
Ctrl+Shift+R (Chrome/Firefox)
Cmd+Shift+R (Mac)
```

#### 2. Check Deployment Status
```bash
# Vercel dashboard should show:
- Build completed
- Deployment successful
- Domain updated
```

#### 3. Clear CDN Cache
```bash
# In Vercel dashboard:
Project → Settings → Functions → Clear Cache
```

## 🌍 Browser Compatibility

### Site Not Working in Specific Browser

**Symptoms:**
- Works in Chrome but not Safari
- JavaScript errors in older browsers
- Layout broken in specific browser

**Solutions:**

#### 1. Check Browser Version
```bash
# Ensure browser is up to date
# Minimum supported versions:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
```

#### 2. Enable JavaScript
```bash
# Ensure JavaScript is enabled
# Check browser settings
```

#### 3. Disable Extensions
```bash
# Test in incognito/private mode
# Disable ad blockers and privacy extensions
```

### Internet Explorer Issues

**Status:** ❌ **Not Supported**

```bash
# Internet Explorer is not supported
# Please use a modern browser:
- Chrome (recommended)
- Firefox
- Safari
- Edge
```

## 🆘 Emergency Procedures

### Site Completely Down

**Immediate Actions:**
1. Check Vercel status: https://vercel-status.com
2. Test main domain: https://appointments.stepsciences.com
3. Check recent deployments in Vercel dashboard
4. If needed, rollback to previous deployment

### Critical Bug in Production

**Immediate Actions:**
1. Identify affected clients/domains
2. Create hotfix branch from main
3. Fix critical issue
4. Test locally
5. Push to trigger immediate deployment
6. Verify fix across all domains

### Data Loss / Configuration Issues

**Immediate Actions:**
1. Do not panic - no user data is stored in frontend
2. Check Git history for configuration changes
3. Restore previous working configuration
4. Test with affected clients
5. Communicate with stakeholders

## 📞 Getting Help

### Self-Service Resources
1. **Check this guide** for common issues
2. **Search GitHub issues** for similar problems
3. **Test in incognito mode** to rule out extensions
4. **Try different browser** to isolate the issue

### Escalation Path
1. **GitHub Issues**: Create detailed bug report
2. **Email Support**: Contact development team
3. **Emergency Contact**: For critical production issues

### What to Include in Bug Reports
```markdown
**Issue Description:**
Clear description of the problem

**Steps to Reproduce:**
1. Go to specific URL
2. Perform specific action
3. Observe result

**Expected vs Actual:**
What should happen vs what actually happens

**Environment:**
- Browser: Chrome 120
- Device: iPhone 12 / Desktop
- URL: gmoshawa.stepsciences.com
- Time: 2025-01-01 15:30 EST

**Screenshots:**
Include relevant screenshots

**Console Errors:**
Copy any JavaScript errors from browser console
```

---

**Remember**: Most issues are temporary and resolve themselves within a few minutes. When in doubt, try refreshing the page and waiting a moment before escalating.

*Last updated: January 2025*