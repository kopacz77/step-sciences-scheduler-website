# Security Policy - Step Sciences Scheduler

This document outlines the security measures, policies, and procedures for the Step Sciences Scheduler platform.

## 🔐 Security Overview

The Step Sciences Scheduler platform handles appointment scheduling for Canadian automotive plants. While we don't store sensitive personal health information, we implement robust security measures to protect plant configurations, admin access, and user interactions.

## 🚨 Reporting Security Vulnerabilities

### How to Report
If you discover a security vulnerability, please report it responsibly:

1. **Email**: Send details to `security@stepsciences.com`
2. **Subject**: Include "SECURITY" in the subject line
3. **Information**: Provide detailed description, steps to reproduce, and potential impact
4. **Response Time**: We will acknowledge receipt within 24 hours

### What NOT to Report Publicly
- **Do not** create public GitHub issues for security vulnerabilities
- **Do not** discuss vulnerabilities on social media or forums
- **Do not** test vulnerabilities on production systems without permission

### Responsible Disclosure
We follow a coordinated disclosure process:
1. **Report received** - 24 hour acknowledgment
2. **Investigation** - 1-7 days for assessment
3. **Fix developed** - Timeline varies by severity
4. **Fix deployed** - Immediate for critical issues
5. **Public disclosure** - After fix is deployed and tested

## 🛡️ Security Architecture

### Infrastructure Security

#### Hosting & Deployment
- **Vercel**: SOC 2 Type II compliant hosting
- **HTTPS Enforced**: All traffic uses TLS 1.2+
- **HSTS**: HTTP Strict Transport Security headers
- **CDN**: Global edge caching with DDoS protection

#### Database Security
- **Supabase**: ISO 27001 certified database platform
- **PostgreSQL**: Row Level Security (RLS) enabled
- **Encryption**: Data encrypted at rest and in transit
- **Backups**: Daily encrypted backups with point-in-time recovery

#### DNS Security
- **DNSSEC**: Domain Name System Security Extensions enabled
- **CAA Records**: Certificate Authority Authorization
- **Subdomain Protection**: Wildcard certificates for all plant domains

### Application Security

#### Authentication & Authorization
- **Admin Authentication**: bcrypt hashed passwords (cost factor 10)
- **Session Management**: JWT tokens with secure random generation
- **Access Control**: Role-based permissions (admin-only operations)
- **Password Policy**: Minimum complexity requirements enforced

#### Data Protection
- **Input Validation**: All user inputs validated and sanitized
- **SQL Injection**: Parameterized queries via Supabase client
- **XSS Prevention**: Content Security Policy headers
- **CSRF Protection**: SameSite cookies and origin validation

#### API Security
- **CORS**: Properly configured Cross-Origin Resource Sharing
- **Rate Limiting**: Implemented at infrastructure level
- **Request Validation**: Schema validation for all API endpoints
- **Error Handling**: No sensitive information in error responses

## 🔒 Security Controls

### Access Controls
```
┌─────────────────┬───────────────┬─────────────────┐
│ Resource        │ Public Access │ Admin Access    │
├─────────────────┼───────────────┼─────────────────┤
│ Plant Configs   │ Read Only     │ Full CRUD       │
│ Admin Users     │ None          │ Read Only       │
│ Database        │ None          │ Via API Only    │
│ Deployment      │ None          │ GitHub + Vercel │
└─────────────────┴───────────────┴─────────────────┘
```

### Data Classification
- **Public**: Plant names, colors, meeting locations
- **Internal**: Admin user emails, configuration details
- **Confidential**: Password hashes, JWT secrets, API keys
- **Restricted**: Database credentials, service role keys

### Environment Security
```bash
# Production Environment Variables (Encrypted)
REACT_APP_SUPABASE_URL=https://...        # Public
REACT_APP_SUPABASE_ANON_KEY=eyJ...        # Public (read-only)
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # Confidential
JWT_SECRET=random-string...               # Confidential
```

## 🔍 Security Monitoring

### Automated Monitoring
- **Vercel Security**: Built-in DDoS protection and monitoring
- **Supabase Monitoring**: Database connection and query monitoring
- **Dependency Scanning**: GitHub Dependabot for vulnerability detection
- **SSL Monitoring**: Automatic certificate renewal and validation

### Logging & Auditing
- **Access Logs**: All API requests logged with timestamps
- **Admin Actions**: All CRUD operations on companies logged
- **Authentication**: Login attempts and failures tracked
- **Error Tracking**: Application errors logged (no sensitive data)

### Security Headers
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' *.google.com
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## 🚧 Security Best Practices

### Development Security
- **Code Reviews**: All changes require peer review
- **Dependency Updates**: Regular updates with vulnerability scanning
- **Secrets Management**: No secrets in source code
- **Local Development**: Separate development database and keys

### Deployment Security
- **Branch Protection**: Main branch requires PR approval
- **Environment Isolation**: Production and development separated
- **Automated Deployment**: No manual production access
- **Rollback Capability**: Immediate rollback for security issues

### Administrative Security
- **Admin Account**: Single admin account with strong password
- **Password Rotation**: Admin password changed regularly
- **Access Logging**: All admin actions logged and monitored
- **Principle of Least Privilege**: Minimal necessary permissions

## 🎯 Threat Model

### Identified Threats
1. **Unauthorized Admin Access** - Mitigated by strong authentication
2. **Data Injection Attacks** - Mitigated by input validation
3. **Cross-Site Scripting** - Mitigated by CSP headers
4. **DDoS Attacks** - Mitigated by Vercel infrastructure
5. **Data Breaches** - Mitigated by encryption and access controls

### Attack Vectors
- **Web Application**: Input validation, authentication bypass
- **API Endpoints**: Injection attacks, unauthorized access
- **Infrastructure**: DDoS, DNS hijacking, certificate attacks
- **Social Engineering**: Admin credential theft, phishing

### Risk Assessment
```
┌──────────────────┬────────────┬──────────────┬─────────────┐
│ Threat           │ Likelihood │ Impact       │ Risk Level  │
├──────────────────┼────────────┼──────────────┼─────────────┤
│ Admin Compromise │ Low        │ High         │ Medium      │
│ Data Injection   │ Medium     │ Medium       │ Medium      │
│ DDoS Attack      │ Medium     │ Low          │ Low         │
│ XSS Attack       │ Low        │ Medium       │ Low         │
│ Infrastructure   │ Low        │ High         │ Medium      │
└──────────────────┴────────────┴──────────────┴─────────────┘
```

## 🔧 Security Configuration

### Database Security (Supabase)
```sql
-- Row Level Security Policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Public read access for active companies
CREATE POLICY "Allow public read access to active companies" 
ON companies FOR SELECT USING (is_active = true);

-- Admin full access
CREATE POLICY "Allow admin full access" 
ON companies FOR ALL USING (
  auth.role() = 'authenticated' 
  AND auth.jwt() ->> 'role' = 'admin'
);

-- Admin users table - admin only
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin users admin only" 
ON admin_users FOR ALL USING (
  auth.role() = 'authenticated' 
  AND auth.jwt() ->> 'role' = 'admin'
);
```

### Content Security Policy
```javascript
// Implemented via Meta tags and headers
const csp = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "*.google.com", "*.googleapis.com"],
  "style-src": ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
  "font-src": ["'self'", "fonts.gstatic.com"],
  "img-src": ["'self'", "data:", "*.stepsciences.com"],
  "connect-src": ["'self'", "*.supabase.co"],
  "frame-src": ["calendar.google.com"]
};
```

## 📋 Security Checklist

### Pre-Deployment Security
- [ ] All dependencies updated and scanned
- [ ] Environment variables properly configured
- [ ] SSL certificates valid and properly configured
- [ ] Database RLS policies applied
- [ ] Admin credentials secured
- [ ] API input validation implemented
- [ ] Error handling doesn't leak sensitive data
- [ ] Security headers configured

### Post-Deployment Security
- [ ] All endpoints respond with HTTPS only
- [ ] Admin login working with secure password
- [ ] Database queries using parameterized statements
- [ ] CORS policies working correctly
- [ ] Error responses don't expose internal details
- [ ] All plant domains properly secured
- [ ] Monitoring and logging operational

### Monthly Security Review
- [ ] Dependency vulnerability scan
- [ ] SSL certificate expiration check
- [ ] Access log review for anomalies
- [ ] Admin password rotation consideration
- [ ] Database backup verification
- [ ] Infrastructure security updates
- [ ] Security policy updates as needed

## 🚨 Incident Response

### Security Incident Categories
1. **Critical**: Active attack, data breach, admin compromise
2. **High**: Vulnerability exploitation, service disruption
3. **Medium**: Attempted attacks, suspicious activity
4. **Low**: Security misconfigurations, policy violations

### Response Procedures
1. **Detection** - Monitoring alerts or manual discovery
2. **Assessment** - Determine scope and impact
3. **Containment** - Isolate affected systems
4. **Eradication** - Remove threat and fix vulnerabilities
5. **Recovery** - Restore normal operations
6. **Lessons Learned** - Document and improve processes

### Emergency Contacts
- **Technical Lead**: @kopacz77 (GitHub)
- **Hosting**: Vercel support dashboard
- **Database**: Supabase support
- **DNS**: GoDaddy support

## 📞 Security Contact

For security-related questions or concerns:
- **Email**: security@stepsciences.com
- **Response Time**: 24 hours for acknowledgment
- **PGP Key**: Available on request
- **Scope**: Security vulnerabilities, policy questions, incident reporting

## 🔄 Security Updates

This security policy is reviewed and updated:
- **Quarterly**: Regular policy review and updates
- **As Needed**: After security incidents or major changes
- **Version Control**: All changes tracked in Git
- **Communication**: Major changes communicated to stakeholders

---

**Last Updated**: January 2025
**Next Review**: April 2025
**Document Version**: 1.0

This security policy ensures the Step Sciences Scheduler platform maintains the highest standards of security while serving Canadian automotive plants with reliable appointment scheduling capabilities.