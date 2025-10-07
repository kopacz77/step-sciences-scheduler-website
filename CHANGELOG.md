# Changelog - Step Sciences Scheduler

All notable changes to the Step Sciences Scheduler project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Custom Landing Pages**: Company-branded landing pages with editable content, features, and CTAs
- **Enhanced Mobile UX**: Optimized intake form flow with urgent messaging and prominent call-to-action buttons
- **Tabbed Admin Interface**: Organized admin panel with tabs for Basic Info, Landing Page, Locations, and URLs & Settings
- **Landing Page Controls**: Toggle to enable/disable landing pages per company
- **Color Preview**: Large color preview boxes in admin interface for better brand management
- **Logo Management**: Upload workflow and existing logo selection in admin interface
- **Linamar Service**: Added new automotive client with custom landing page

### Enhanced
- **Google Calendar Support**: Extended URL validation to support both `calendar.google.com` and `calendar.app.google` domains
- **Database Schema**: Added landing page columns with automotive industry-specific default content
- **API Endpoints**: Enhanced company CRUD operations to support landing page fields
- **Domain Routing**: Improved company detection and fallback handling

### Security
- Enhanced admin password security with bcrypt hashing
- Updated default admin password from weak "admin123" to cryptographically secure password

## [2.1.0] - 2025-01-30

### Added
- Comprehensive documentation suite:
  - `CONTRIBUTING.md` with development guidelines and workflow
  - `DEPLOYMENT.md` with infrastructure and deployment procedures
  - `API.md` with complete API documentation and examples
  - `SECURITY.md` with security policies and vulnerability reporting
  - `CHANGELOG.md` for tracking version history

### Security
- Updated admin authentication with secure password
- Documented security architecture and threat model
- Enhanced input validation and sanitization procedures

### Documentation
- Complete API endpoint documentation with examples
- Detailed deployment and infrastructure guide
- Security policy and incident response procedures
- Contributing guidelines for new developers

## [2.0.0] - 2024-12-15

### Added
- Database-driven multi-tenant architecture with Supabase
- Admin interface for managing plant configurations
- Dynamic branding system with per-plant customization
- Google Calendar integration with automatic button generation
- Scan day support for plants with multiple locations (Monday/Friday)
- Row Level Security (RLS) for database access control
- Domain-based automatic plant detection
- SSL certificate management for all subdomains

### Changed
- **BREAKING**: Migrated from static configuration files to database-driven system
- **BREAKING**: Updated React to version 19.0.0
- **BREAKING**: Upgraded Material-UI to version 7.0.0
- Replaced static company configs with dynamic Supabase lookups
- Improved responsive design for mobile and tablet devices

### Removed
- **BREAKING**: Static `companyConfigs.js` file (replaced with database)
- **BREAKING**: Hardcoded plant configurations
- Legacy configuration management system

### Fixed
- Google Calendar button loading issues
- Mobile responsiveness across all plant configurations
- SSL certificate provisioning for new subdomains
- Cross-browser compatibility issues

### Security
- Implemented Row Level Security (RLS) on all database tables
- Added input validation and sanitization for all API endpoints
- Enhanced authentication with bcrypt password hashing
- Configured Content Security Policy (CSP) headers

## [1.5.2] - 2024-10-22

### Fixed
- Stellantis Brampton calendar URL updated
- Mobile layout improvements for intake form links
- Console error resolution for undefined company properties

### Added
- Unifor Local 200/444 plant configuration
- Enhanced error handling for calendar integration failures

## [1.5.1] - 2024-09-15

### Fixed
- GM CAMI calendar integration restored
- Logo loading issues on production resolved
- Responsive header layout on mobile devices

### Changed
- Updated Stellantis branding colors to match corporate guidelines
- Improved meeting location descriptions for better clarity

## [1.5.0] - 2024-08-30

### Added
- Stellantis Windsor Assembly Plant configuration
- Stellantis Brampton Assembly Plant configuration
- Ford Oakville Assembly Complex (placeholder configuration)
- Ford Windsor Engine Plant (placeholder configuration)
- Dynamic logo system supporting multiple automotive manufacturers

### Changed
- Enhanced company configuration structure to support more plant details
- Improved Google Calendar URL validation and error handling
- Updated Material-UI theme system for better brand consistency

### Fixed
- Calendar button positioning on various screen sizes
- Color contrast issues for accessibility compliance
- Header logo sizing across different plant configurations

## [1.4.0] - 2024-07-18

### Added
- GM CAMI Assembly Plant support
- Scan day functionality for plants with different Monday/Friday locations
- Special instructions field for plant-specific requirements
- Local organizer message customization
- Booking instructions per plant

### Changed
- Expanded company configuration schema to support day-specific locations
- Enhanced responsive design for tablet devices used on plant floors
- Improved Google Calendar integration with better error handling

### Fixed
- iOS Safari compatibility issues with calendar buttons
- Android Chrome layout problems on mobile devices

## [1.3.1] - 2024-06-10

### Fixed
- Production build issues with Material-UI theming
- Google Calendar script loading timeouts
- CORS issues with calendar.google.com integration

### Security
- Updated dependencies to resolve security vulnerabilities
- Enhanced input sanitization for URL parameters

## [1.3.0] - 2024-05-25

### Added
- Multi-tenant domain support (*.stepsciences.com)
- Automatic plant detection based on subdomain
- Custom branding per automotive plant
- GM Oshawa Assembly Plant as the flagship implementation
- Google Calendar appointment scheduling integration
- Material-UI theming system with dynamic colors
- Responsive design optimized for mobile and desktop

### Changed
- Migrated from Create React App 4 to 5
- Updated Node.js runtime to 18.x for Vercel functions
- Enhanced build process with code splitting and optimization

### Infrastructure
- Deployed on Vercel with automatic CI/CD from GitHub
- Configured wildcard DNS for unlimited plant subdomains
- SSL certificate automation for all domains
- CDN optimization for static assets

## [1.2.0] - 2024-04-12

### Added
- Initial automotive plant scheduling interface
- Step Sciences branding and styling
- Health card and insurance card reminder system
- Contact information and appointment preparation guidance

### Changed
- Upgraded React dependencies for better performance
- Implemented responsive CSS Grid layout system
- Enhanced accessibility features for plant floor use

## [1.1.0] - 2024-03-08

### Added
- Basic appointment scheduling framework
- Google Calendar integration prototype
- Material-UI component library integration
- Initial plant configuration system

### Fixed
- Cross-browser compatibility issues
- Mobile viewport configuration
- Form validation and error handling

## [1.0.0] - 2024-02-01

### Added
- Initial project setup with Create React App
- Basic React component structure
- Vercel deployment configuration
- Project documentation and README
- Git repository initialization

### Infrastructure
- Node.js 18.x development environment
- npm/pnpm package management
- ESLint and Prettier code formatting
- GitHub repository setup

---

## Release Process

### Version Numbering
- **Major** (X.0.0): Breaking changes, major new features
- **Minor** (0.X.0): New features, backward compatible
- **Patch** (0.0.X): Bug fixes, security updates

### Release Checklist
- [ ] Update version in `package.json`
- [ ] Update this CHANGELOG with new version
- [ ] Test all functionality across plant configurations
- [ ] Verify mobile responsiveness
- [ ] Check admin interface functionality
- [ ] Validate Google Calendar integrations
- [ ] Run security audit: `npm audit`
- [ ] Run linting: `pnpm lint`
- [ ] Build production version: `pnpm build`
- [ ] Deploy to production via Git push to main
- [ ] Verify deployment on live domains
- [ ] Create Git tag: `git tag v2.1.0`
- [ ] Push tags: `git push --tags`

### Breaking Changes Policy
Major version changes that may affect existing plant configurations or API consumers:
- Database schema changes
- API endpoint modifications
- Authentication system changes
- Required environment variable updates
- Domain or URL structure changes

### Deprecation Policy
Features marked for removal will be:
1. **Deprecated**: Marked in documentation, console warnings added
2. **Supported**: Maintained for at least one minor version
3. **Removed**: Eliminated in next major version

---

**Maintained by**: Step Sciences Development Team
**Last Updated**: January 30, 2025