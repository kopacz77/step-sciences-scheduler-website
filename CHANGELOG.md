# Changelog

All notable changes to the Step Sciences Scheduler project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- TypeScript migration for enhanced type safety
- Performance optimizations with React.memo and useMemo
- Accessibility improvements for WCAG 2.1 AA compliance
- Security hardening with CSP and input validation
- Automated testing infrastructure
- Backend API for dynamic configuration management

## [1.2.0] - 2025-01-01

### Added
- **Multi-location support** for companies with different appointment locations (GM Oshawa scan days)
- **Enhanced mobile experience** with touch-optimized interfaces and larger buttons
- **Collapsible location details** on mobile for better space utilization
- **Floating action button** for "Start Over" functionality on mobile
- **ScanDayLocationInfo component** for displaying Monday/Friday location differences
- **Improved visual hierarchy** with better typography and spacing

### Enhanced
- **Google Calendar button styling** with more prominent appearance and hover effects
- **Step progression indicators** with better visual feedback
- **Mobile-first responsive design** with breakpoint optimizations
- **Loading states and fallback mechanisms** for external service failures
- **Error handling** for Google Calendar API integration

### Changed
- **Component architecture** with better separation of concerns
- **CSS styling** moved to index.html for better Google Calendar button control
- **State management** improved with better localStorage synchronization
- **URL parameter handling** enhanced with reset functionality

## [1.1.0] - 2024-12-15

### Added
- **Copernicus Lodge client** configuration and branding
- **Ford Windsor and Ford Oakville** client configurations
- **Improved intake form integration** with better iframe handling
- **Dynamic theme generation** based on company branding colors
- **Enhanced error boundaries** for better user experience
- **Progressive Web App** manifest and favicon support

### Enhanced
- **Google Calendar integration** reliability with timeout and retry mechanisms
- **Client configuration system** with more flexible options
- **Domain detection logic** for automatic client identification
- **Material-UI theming** with custom component overrides

### Fixed
- **Button styling consistency** across different browsers
- **Mobile layout issues** on various screen sizes
- **localStorage persistence** edge cases
- **Domain routing** fallback scenarios

## [1.0.0] - 2024-11-01

### Added
- **Initial public release** of Step Sciences Scheduler
- **Multi-tenant architecture** supporting multiple clients via subdomains
- **Google Calendar integration** for appointment booking
- **3-step guided workflow**: Schedule → Intake Form → Confirmation
- **Dynamic branding system** with per-client colors, logos, and messaging
- **Responsive design** optimized for desktop and mobile devices
- **Vercel deployment** with automatic CI/CD from GitHub
- **Custom subdomain support** with SSL certificates

### Clients Launched
- **GM Oshawa** (gmoshawa.stepsciences.com)
- **GM CAMI** (gmcami.stepsciences.com) 
- **Stellantis Windsor** (stellantiswindsor.stepsciences.com)
- **Stellantis Brampton** (stellantisbrampton.stepsciences.com)
- **Unifor Windsor Local 200/444** (uniforwindsor.stepsciences.com)

### Technical Implementation
- **React 19** with modern functional components and hooks
- **Material-UI 7** for consistent design system
- **Create React App** build pipeline
- **Biome** for code formatting and linting
- **pnpm** package management
- **localStorage** for state persistence
- **URL parameter routing** for client identification

## [0.9.0] - 2024-10-15 (Beta)

### Added
- **Beta release** for internal testing
- **Core 3-step workflow** implementation
- **Basic Google Calendar integration**
- **Initial client configurations** for automotive sector
- **Material-UI component library** integration
- **Responsive layout** foundation

### Technical Foundation
- **React application** bootstrap with Create React App
- **Component architecture** planning and initial implementation
- **State management** with useState and useEffect hooks
- **External API integration** patterns established

## [0.1.0] - 2024-09-01 (Alpha)

### Added
- **Project initialization** and repository setup
- **Development environment** configuration
- **Initial component structure** and routing concepts
- **Proof of concept** for multi-tenant architecture
- **GM Oshawa** as primary client for initial development

### Technical Setup
- **React project** scaffolding
- **Git repository** initialization
- **Development workflow** establishment
- **Vercel deployment** pipeline setup

---

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR.MINOR.PATCH** (e.g., 1.2.0)
- **MAJOR**: Breaking changes to API or significant architecture changes
- **MINOR**: New features, new client additions, enhanced functionality
- **PATCH**: Bug fixes, security updates, minor improvements

## Release Process

1. **Development**: Features developed in feature branches
2. **Testing**: Manual testing across all client configurations
3. **Staging**: Deployment to staging environment for final validation
4. **Production**: Automatic deployment to production via Vercel
5. **Documentation**: Update changelog and release notes

## Deprecation Policy

- **Minor version deprecations**: 6 month notice before removal
- **Major version deprecations**: 12 month notice before removal
- **Security-related changes**: May be implemented immediately

## Migration Guides

### Upgrading from 1.1.x to 1.2.x
- No breaking changes
- New mobile optimizations automatically applied
- Optional: Review and update client-specific mobile configurations

### Upgrading from 1.0.x to 1.1.x
- No breaking changes
- New client configurations available
- Enhanced error handling automatically active

---

*For technical details about any release, see the corresponding Git tags and commit history.*