# Deployment Guide - Step Sciences Scheduler

This guide covers the complete deployment infrastructure for the Step Sciences Scheduler platform, including hosting, database, DNS, and monitoring.

## 🌐 Production Infrastructure

### Current Stack
- **Frontend Hosting**: Vercel (Free tier)
- **Database**: Supabase (Free tier)
- **DNS**: GoDaddy domain management
- **SSL**: Automatic via Vercel
- **CI/CD**: GitHub + Vercel integration

### Live Environments
- **Production**: `appointments.stepsciences.com`
- **Plant Subdomains**: `*.stepsciences.com`
- **Admin Interface**: `/admin` on any domain

## 🚀 Vercel Deployment

### Initial Setup
1. **Connect Repository**
   ```bash
   # Vercel CLI (optional)
   npm i -g vercel
   vercel login
   vercel --prod
   ```

2. **Project Configuration**
   - Framework: Create React App
   - Node.js Version: 18.x
   - Build Command: `pnpm build`
   - Output Directory: `build`
   - Install Command: `pnpm install`

### Environment Variables
Required production environment variables in Vercel dashboard:

```bash
# Database Connection
REACT_APP_SUPABASE_URL=https://cabtsqukaofxofsufaui.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Authentication
JWT_SECRET=your-secure-random-string-32-chars-min

# Optional: Analytics
VERCEL_ANALYTICS_ID=your-analytics-id
```

### Build Configuration
**vercel.json**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### Automatic Deployment
- **Trigger**: Every push to `main` branch
- **Build Time**: ~2-3 minutes
- **Deploy Time**: ~30 seconds
- **Rollback**: Available via Vercel dashboard

## 🗄️ Supabase Database

### Project Configuration
- **Region**: US East (Ohio)
- **Pricing**: Free tier (500MB, 2 organizations)
- **Backup**: Daily automatic backups

### Database Setup
1. **Create Project** at [supabase.com](https://supabase.com)
2. **Run Schema**: Copy/paste `supabase-schema.sql` in SQL Editor
3. **Test Connection**: `node test-supabase.js`
4. **Configure RLS**: Row Level Security policies included

### Connection Details
```bash
# Database URL format
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# API URLs
Project URL: https://[project-ref].supabase.co
API URL: https://[project-ref].supabase.co/rest/v1/
```

### Performance Optimization
- **Connection Pooling**: Enabled by default
- **Read Replicas**: Available on paid plans
- **Caching**: 5-minute TTL on company configs
- **Indexes**: Applied to all lookup columns

## 🌍 Domain Management

### Primary Domain
- **Registrar**: GoDaddy
- **Domain**: stepsciences.com
- **DNS Management**: GoDaddy DNS

### Subdomain Configuration
Each plant gets a custom subdomain automatically:

```dns
# DNS Records (GoDaddy)
Type: CNAME
Name: gmoshawa
Value: cname.vercel-dns.com
TTL: 600

# Wildcard support
Type: CNAME  
Name: *
Value: cname.vercel-dns.com
TTL: 600
```

### Adding New Plant Domains

#### Method 1: Vercel Dashboard
1. Go to Vercel project → Settings → Domains
2. Add domain: `newplant.stepsciences.com`
3. Vercel provides DNS instructions
4. Update GoDaddy DNS with CNAME record
5. SSL certificate issued automatically (5-30 minutes)

#### Method 2: Wildcard (Recommended)
- Wildcard DNS already configured
- New subdomains work immediately
- No manual DNS changes needed
- SSL issued automatically

### SSL Certificate Management
- **Provider**: Let's Encrypt via Vercel
- **Renewal**: Automatic every 90 days
- **Monitoring**: Vercel alerts on certificate issues
- **Custom Certificates**: Available on Pro plan

## 📦 Build Process

### Development Build
```bash
pnpm start           # Hot reload, source maps
pnpm start:api       # API server on port 3001 (development)
```

### Production Build
```bash
pnpm build           # Optimized production build
pnpm build:analyze   # Bundle size analysis
serve -s build       # Test production build locally
```

### Build Optimization
- **Code Splitting**: Automatic via Create React App
- **Tree Shaking**: Dead code elimination
- **Minification**: JavaScript and CSS minified
- **Asset Optimization**: Images and fonts optimized

### Build Artifacts
```
build/
├── static/
│   ├── css/         # Minified stylesheets
│   ├── js/          # Code-split JavaScript bundles
│   └── media/       # Optimized images, fonts
├── index.html       # Main HTML file
└── manifest.json    # PWA manifest
```

## 🔄 CI/CD Pipeline

### GitHub Integration
```yaml
# .github/workflows/deploy.yml (if needed)
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Deployment Workflow
1. **Code Push** → `main` branch
2. **Webhook** → Vercel deployment triggered
3. **Build** → `pnpm install && pnpm build`
4. **Deploy** → Static files uploaded to CDN
5. **DNS Update** → Traffic routed to new deployment
6. **Notification** → Slack/email notification (optional)

## 📊 Monitoring & Analytics

### Vercel Analytics
- **Page Views**: Track usage across all plant domains
- **Performance**: Core Web Vitals monitoring
- **Error Tracking**: Runtime error detection
- **Geographic Data**: User location insights

### Supabase Monitoring
- **Database Performance**: Query execution times
- **Connection Pool**: Active connections monitoring
- **Storage Usage**: Database size tracking
- **API Usage**: Request volume and rate limits

### Health Checks
```bash
# Automated health checks
curl -f https://appointments.stepsciences.com/api/companies || exit 1
curl -f https://gmoshawa.stepsciences.com || exit 1
```

## 🚨 Disaster Recovery

### Backup Strategy
1. **Database**: Daily automated Supabase backups
2. **Code**: Git repository (GitHub)
3. **Deployments**: Vercel keeps deployment history
4. **DNS**: GoDaddy account backup

### Rollback Procedures

#### Code Rollback
```bash
# Find previous deployment
vercel ls
# Promote previous deployment
vercel promote [deployment-url] --scope stepsciences
```

#### Database Rollback
```bash
# Supabase Dashboard → Settings → Database → Restore from backup
# Select backup date and confirm restoration
```

#### DNS Rollback
```bash
# Update CNAME to point to backup instance
# TTL: 600 seconds (10 minutes propagation)
```

### Emergency Contacts
- **Vercel Support**: dashboard support chat
- **Supabase Support**: support@supabase.com
- **GoDaddy Support**: Phone support for DNS issues

## 🔐 Security Configuration

### HTTPS Enforcement
- All HTTP requests redirect to HTTPS
- HSTS headers enabled
- Mixed content blocked

### Content Security Policy
```html
<!-- Automatically handled by Vercel -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline' *.google.com; style-src 'self' 'unsafe-inline'">
```

### Environment Security
- Secrets never committed to repository
- Environment variables encrypted at rest
- API keys rotated regularly
- Admin access logged and monitored

## 📈 Scaling Considerations

### Current Capacity
- **Vercel Free**: 100GB bandwidth/month
- **Supabase Free**: 500MB database, 2GB transfer
- **Concurrent Users**: ~1000 users supported

### Scaling Options

#### Vercel Pro ($20/month)
- Unlimited bandwidth
- Edge functions
- Advanced analytics
- Team collaboration

#### Supabase Pro ($25/month)
- 8GB database
- Daily backups
- Point-in-time recovery
- Read replicas

### Performance Optimization
- CDN caching for static assets
- Database query optimization
- Image compression and WebP support
- Lazy loading for components

## 🛠️ Maintenance Tasks

### Weekly
- [ ] Check Vercel deployment logs
- [ ] Monitor Supabase database size
- [ ] Verify SSL certificates valid
- [ ] Test admin interface functionality

### Monthly
- [ ] Review environment variable security
- [ ] Check for dependency updates
- [ ] Analyze performance metrics
- [ ] Update documentation as needed

### Quarterly
- [ ] Database performance audit
- [ ] Security vulnerability scan
- [ ] Backup restoration test
- [ ] Disaster recovery drill

## 📞 Support Escalation

### Level 1: Self-Service
- Check Vercel deployment logs
- Review Supabase project logs
- Test DNS resolution
- Clear browser cache

### Level 2: Platform Support
- Vercel: Dashboard support chat
- Supabase: Community forum
- GoDaddy: Phone support for critical DNS

### Level 3: Emergency
- Critical production issues
- Security incidents
- Data loss scenarios
- Contact: @kopacz77 directly

---

## Quick Deployment Checklist

### New Plant Deployment
- [ ] Add company record to Supabase
- [ ] Configure domain in Vercel
- [ ] Update DNS (CNAME record)
- [ ] Test domain resolution
- [ ] Verify SSL certificate
- [ ] Test Google Calendar integration
- [ ] Validate mobile responsiveness

### Code Deployment
- [ ] Code passes all lints
- [ ] Build succeeds locally
- [ ] Environment variables updated
- [ ] Push to main branch
- [ ] Monitor deployment in Vercel
- [ ] Test live functionality
- [ ] Check for console errors

This deployment guide ensures reliable, scalable hosting for all Canadian automotive plants using the Step Sciences Scheduler platform.