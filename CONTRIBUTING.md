# Contributing to Step Sciences Scheduler

Welcome to the Step Sciences Scheduler project! This guide will help you get started with contributing to our multi-tenant appointment scheduling platform for Canadian automotive plants.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (preferred) or npm
- Supabase account for database access
- Git for version control

### Development Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/kopacz77/step-sciences-scheduler-website
   cd step-sciences-scheduler-website
   pnpm install
   ```

2. **Database Setup**
   - Create a Supabase project
   - Run `supabase-schema.sql` in SQL Editor
   - Test connection: `node test-supabase.js`

3. **Environment Variables**
   ```bash
   # .env.local
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   JWT_SECRET=your_jwt_secret
   ```

4. **Start Development**
   ```bash
   pnpm start  # Runs on http://localhost:3000
   ```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AdminApp.js     # Admin interface wrapper
│   ├── AdminInterface.js  # Plant management UI
│   ├── AdminLogin.js   # Authentication component
│   ├── Header.js       # Dynamic branded header
│   └── StepContent.js  # Main appointment flow
├── config/
│   └── dynamicCompanyConfigs.js  # Database integration
api/
├── companies.js        # CRUD operations for plants
├── config/[domain].js  # Domain-based config lookup
└── admin/login.js      # Authentication endpoint
```

## 🛠️ Development Workflow

### Code Style
- **Linting**: Use Biome for consistent formatting
- **Components**: Functional components with hooks
- **Naming**: camelCase for variables, PascalCase for components
- **Files**: Use .js extension for React components

### Essential Commands
```bash
pnpm start          # Development server
pnpm build          # Production build
pnpm lint           # Check code style
pnpm format         # Auto-format code
pnpm check          # Fix common issues
```

### Branch Strategy
- `main` - Production branch (auto-deploys to Vercel)
- `feature/[name]` - New features
- `fix/[name]` - Bug fixes
- `docs/[name]` - Documentation updates

### Commit Messages
Follow conventional commits:
```bash
feat: add new plant configuration endpoint
fix: resolve calendar button loading issue
docs: update API documentation
refactor: simplify admin authentication logic
```

## 🏭 Adding New Plants

### Database-First Approach
All plant configurations are stored in Supabase. **No code changes needed** for new plants!

1. **Via Admin Interface** (Recommended)
   - Visit `/admin` with admin credentials
   - Click "Add New Company"
   - Fill plant details and branding
   - Save and test

2. **Direct Database Insert**
   ```sql
   INSERT INTO companies (
     id, name, domain, primary_color, 
     calendar_url, meeting_location
   ) VALUES (
     'new-plant', 'New Plant Name', 
     'newplant.stepsciences.com', '#000000',
     'https://calendar.google.com/...', 'Building A'
   );
   ```

### Required Plant Fields
- `id`: Unique identifier (kebab-case)
- `name`: Display name
- `domain`: Full domain (subdomain.stepsciences.com)
- `primary_color`: Hex color for branding
- `calendar_url`: Google Calendar booking URL (supports calendar.google.com and calendar.app.google)
- `meeting_location`: Physical location for appointments

### Landing Page Fields (Optional)
- `landing_page_enabled`: Boolean to enable/disable landing pages
- `landing_page_title`: Custom title for the landing page
- `landing_page_subtitle`: Subtitle text
- `landing_page_description`: Company-specific description text
- `landing_page_features`: JSON array of feature bullet points
- `landing_page_cta_text`: Call-to-action button text
- `landing_page_background_image`: Optional background image URL
- `landing_page_show_company_logo`: Boolean to show/hide company logo

## 🎨 Theming and Branding

### Dynamic Theming
Each plant gets custom branding through Material-UI themes:

```javascript
// Colors are pulled from database
const theme = createTheme({
  palette: {
    primary: { main: company.primary_color },
    secondary: { main: company.secondary_color }
  }
});
```

### Logo Management
- Store logos in `/public/logos/`
- Use PNG format for transparency
- Recommended size: 200x80px
- Update database `logo` field with path

## 📱 Testing

### Local Testing
```bash
# Test different plants locally
http://localhost:3000?company=gm-oshawa
http://localhost:3000?company=stellantis-windsor

# Test admin interface
http://localhost:3000/admin
```

### Browser Testing
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile: iOS Safari, Chrome Mobile
- Tablet: iPad, Android tablets

### Manual Testing Checklist
- [ ] Plant detection works via domain
- [ ] Branding loads correctly
- [ ] Google Calendar button appears
- [ ] Admin interface accessible
- [ ] Responsive design on mobile

## 🔐 Security Guidelines

### Authentication
- Admin passwords must be bcrypt hashed
- JWT tokens for session management
- Row Level Security (RLS) enabled on all tables

### Data Protection
- No sensitive data in client-side code
- Environment variables for secrets
- HTTPS enforced on all domains
- Input validation on all forms

### Database Security
- Use service role key only in API routes
- Anonymous key for client-side reads only
- RLS policies prevent unauthorized access

## 🚀 Deployment

### Automatic Deployment
- Every push to `main` triggers Vercel deployment
- Build logs available in Vercel dashboard
- Zero-downtime deployments

### Domain Management
1. **Add Domain**: Vercel project settings
2. **DNS Setup**: CNAME to `cname.vercel-dns.com`  
3. **SSL**: Automatic (5-30 minutes)
4. **Test**: Verify domain resolves correctly

## 🐛 Bug Reports

### Issue Template
```markdown
**Plant/Domain**: Which plant is affected?
**Browser**: Chrome 120, Safari 17, etc.
**Steps to Reproduce**:
1. Go to...
2. Click...
3. See error...

**Expected**: What should happen
**Actual**: What actually happens
**Console Errors**: Any JavaScript errors?
```

### Critical Issues
For production issues affecting live plants:
1. Create issue with `critical` label
2. Tag `@kopacz77` for immediate attention
3. Include plant domain and error details

## 🔧 API Guidelines

### Endpoint Structure
```javascript
// /api/companies.js - CRUD operations
GET    /api/companies     # List all active plants
POST   /api/companies     # Create new plant (admin only)
PUT    /api/companies/:id # Update plant (admin only)
DELETE /api/companies/:id # Deactivate plant (admin only)

// /api/config/[domain].js - Domain lookup
GET /api/config/domain.com # Get plant config by domain
```

### Response Format
```javascript
{
  "success": true,
  "data": { /* plant config */ },
  "message": "Optional success message"
}

// Error responses
{
  "success": false, 
  "error": "Descriptive error message"
}
```

## 📚 Resources

### External Dependencies
- **React 19**: Core framework
- **Material-UI 7**: Component library
- **Supabase**: Database and auth
- **Vercel**: Hosting and deployment

### Documentation Links
- [React Docs](https://react.dev)
- [Material-UI Docs](https://mui.com)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Project-Specific Docs
- `README.md` - Project overview and setup
- `TROUBLESHOOTING.md` - Common issues and solutions
- `API.md` - Detailed API documentation
- `DEPLOYMENT.md` - Infrastructure and deployment guide

## ❓ Getting Help

### Development Questions
1. Check existing documentation
2. Search closed issues for similar problems
3. Create new issue with detailed description
4. Tag appropriate maintainers

### Contact
- **Technical Issues**: GitHub issues
- **Plant Requests**: Use admin interface
- **Emergency**: Contact @kopacz77 directly

---

## Code Review Guidelines

### Before Submitting PR
- [ ] Code passes all lints: `pnpm lint`
- [ ] Code is formatted: `pnpm format`  
- [ ] Build succeeds: `pnpm build`
- [ ] Manual testing completed
- [ ] No console errors
- [ ] Responsive design verified

### PR Requirements
- Clear title describing the change
- Description explaining why the change is needed
- Screenshots for UI changes
- Testing steps for reviewers
- Link to related issues

Thank you for contributing to Step Sciences Scheduler! 🚀