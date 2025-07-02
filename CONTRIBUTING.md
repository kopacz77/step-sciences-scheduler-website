# Contributing to Step Sciences Scheduler

> Thank you for your interest in contributing to the Step Sciences Scheduler! This guide will help you get started.

## 🚀 Quick Start for Contributors

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** (`npm install -g pnpm`)
- **Git** for version control
- **VS Code** (recommended) with suggested extensions

### Development Setup

1. **Fork and clone the repository:**
```bash
git clone https://github.com/[your-username]/step-sciences-scheduler-website
cd step-sciences-scheduler-website
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

4. **Start development server:**
```bash
pnpm start
```

5. **Open browser and test:**
```
http://localhost:3000?company=copernicus-lodge
```

## 📋 Development Guidelines

### Code Style

We use **Biome** for consistent code formatting and linting:

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Check and auto-fix issues
pnpm check
```

### Component Guidelines

1. **Use functional components** with hooks
2. **Follow Material-UI patterns** for consistency
3. **Implement responsive design** for mobile/desktop
4. **Add proper TypeScript types** (when migrating)
5. **Use descriptive component and prop names**

### File Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.js        # App header with branding
│   ├── StepContent.js   # Main step workflow
│   └── ...
├── config/              # Configuration files
│   └── companyConfigs.js # Client configurations
├── App.js               # Main application component
└── index.js             # Entry point
```

### Naming Conventions

- **Components**: PascalCase (`StepContent.js`)
- **Functions**: camelCase (`handleAppointmentBooked`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_COMPANY_ID`)
- **CSS Classes**: kebab-case (`step-content`)

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, test these scenarios:

- [ ] **Default client loading** (`http://localhost:3000`)
- [ ] **Specific client** (`?company=copernicus-lodge`)
- [ ] **Mobile responsiveness** (Chrome DevTools mobile view)
- [ ] **Step progression** (1 → 2 → 3)
- [ ] **Google Calendar integration** (button loads and styles properly)
- [ ] **Intake form display** (iframe loads correctly)
- [ ] **Reset functionality** (`?reset=true`)
- [ ] **Error scenarios** (invalid company ID, missing config)

### Browser Testing

Test in these browsers:
- **Chrome** (latest)
- **Firefox** (latest) 
- **Safari** (latest)
- **Edge** (latest)

## 🎨 Adding New Clients

### Quick Addition Process

1. **Add client configuration** in `src/config/companyConfigs.js`:
```javascript
'new-client': {
  name: 'New Client',
  fullName: 'New Client Corporation',
  primaryColor: '#000000',
  secondaryColor: '#D4AF37',
  logo: '/logos/new-client.png',
  calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/[ID]',
  intakeFormUrl: 'https://step-sciences.web.app/intake/new-client/path',
  contactEmail: 'info@stepsciences.com',
  showBranding: true,
  meetingLocation: 'Client Address',
  specialInstructions: 'Client-specific instructions',
  domain: 'new-client.stepsciences.com'
}
```

2. **Add domain detection** in `getCompanyIdFromDomain()`:
```javascript
if (hostname.includes('new-client.stepsciences.com')) return 'new-client';
```

3. **Add client logo** to `public/logos/new-client.png`

4. **Test locally** with `?company=new-client`

See [READMENEWCLIENT.md](READMENEWCLIENT.md) for detailed client setup.

## 🐛 Bug Reports

### Before Submitting

1. **Check existing issues** on GitHub
2. **Test in multiple browsers**
3. **Try with different client configurations**
4. **Clear browser cache and localStorage**

### Bug Report Template

```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- Browser: [e.g. Chrome 120]
- Device: [e.g. iPhone 12, Desktop]
- Client: [e.g. gm-oshawa, copernicus-lodge]
- URL: [e.g. gmoshawa.stepsciences.com]
```

## ✨ Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed?

**Proposed Implementation**
How might this be implemented?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other context or screenshots
```

## 🔄 Pull Request Process

### Before Submitting

1. **Create feature branch** from `main`
2. **Follow code style** guidelines
3. **Test thoroughly** across clients and devices
4. **Run code quality checks**:
   ```bash
   pnpm lint
   pnpm format
   pnpm check
   ```
5. **Update documentation** if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Client addition

## Testing Checklist
- [ ] Tested with multiple clients
- [ ] Mobile responsive
- [ ] Google Calendar integration works
- [ ] No console errors
- [ ] Accessibility considerations

## Screenshots
If applicable

## Additional Notes
Any special considerations
```

### Review Process

1. **Automated checks** must pass
2. **Manual review** by maintainers
3. **Testing** in staging environment
4. **Approval** required before merge

## 🚨 Security Guidelines

### Security Considerations

- **Never commit secrets** or API keys
- **Validate external URLs** before use
- **Sanitize user inputs** (URL parameters)
- **Use HTTPS** for all external resources
- **Follow iframe security** best practices

### Reporting Security Issues

For security vulnerabilities, please email privately instead of opening public issues.

## 🎯 Contribution Areas

### High-Priority Areas

- **TypeScript migration** (add type safety)
- **Performance optimization** (memoization, code splitting)
- **Accessibility improvements** (WCAG 2.1 AA compliance)
- **Security hardening** (CSP, input validation)
- **Testing infrastructure** (unit tests, e2e tests)

### Good First Issues

- Adding new client configurations
- Improving mobile responsiveness
- Documentation updates
- Code formatting and cleanup
- Adding loading states and error messages

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Request Comments**: Code-specific discussions

### Response Times

- **Bug reports**: 1-2 business days
- **Feature requests**: 1 week
- **Pull requests**: 2-3 business days

## 📝 Documentation

### Documentation Standards

- **Use clear, concise language**
- **Include code examples** where helpful
- **Keep documentation up-to-date** with code changes
- **Use proper Markdown formatting**

### Documentation Types

- **README.md**: Project overview and quick start
- **CONTRIBUTING.md**: This file
- **API.md**: External integrations
- **DEPLOYMENT.md**: Production deployment
- **TROUBLESHOOTING.md**: Common issues

## 🏆 Recognition

Contributors will be recognized in:
- **GitHub contributors list**
- **Release notes** for significant contributions
- **Documentation credits** for major documentation improvements

Thank you for contributing to Step Sciences Scheduler! 🎉

---

*For questions about this guide, please open an issue or start a discussion.*