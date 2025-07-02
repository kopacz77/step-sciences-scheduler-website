# Step Sciences Scheduler - API Schema

## Database Schema

### Companies Table
```sql
CREATE TABLE companies (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  primary_color VARCHAR(7) DEFAULT '#1976d2',
  secondary_color VARCHAR(7) DEFAULT '#ffc107',
  logo VARCHAR(200),
  calendar_url TEXT NOT NULL,
  intake_form_url TEXT NOT NULL,
  contact_email VARCHAR(100) NOT NULL,
  show_branding BOOLEAN DEFAULT true,
  meeting_location TEXT,
  monday_location TEXT,
  friday_location TEXT,
  special_instructions TEXT,
  domain VARCHAR(100) UNIQUE NOT NULL,
  has_scan_days BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### GET /api/companies
Returns all companies (for admin interface)
```json
[
  {
    "id": "gm-oshawa",
    "name": "GM Oshawa",
    "fullName": "General Motors Oshawa Assembly",
    "primaryColor": "#000000",
    "secondaryColor": "#D4AF37",
    "logo": "/logos/gm-logo.png",
    "calendarUrl": "https://calendar.google.com/...",
    "intakeFormUrl": "https://step-sciences.web.app/intake/gm/oshawa",
    "contactEmail": "info@stepsciences.com",
    "showBranding": true,
    "scanDayLocations": {
      "monday": "Building C - Medical Offices",
      "friday": "Building D - TFT Boardrooms"
    },
    "specialInstructions": "Please bring health card...",
    "domain": "gmoshawa.stepsciences.com",
    "hasScanDays": true,
    "isActive": true
  }
]
```

### GET /api/companies/:id
Returns single company configuration
```json
{
  "id": "gm-oshawa",
  "name": "GM Oshawa",
  // ... full company config
}
```

### POST /api/companies
Creates new company
**Body:** Company object
**Returns:** Created company with generated ID

### PUT /api/companies/:id
Updates existing company
**Body:** Updated company object
**Returns:** Updated company

### DELETE /api/companies/:id
Deletes company (sets is_active to false)
**Returns:** Success message

### GET /api/config/:domain
Public endpoint for loading company config by domain
```json
{
  "id": "gm-oshawa",
  "name": "GM Oshawa",
  // ... sanitized config (no sensitive data)
}
```

## Implementation Options

### Option 1: Vercel + PlanetScale (Recommended)
```javascript
// /api/companies/index.js
import { PlanetScaleConnection } from '@planetscale/database';

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

export default async function handler(req, res) {
  const conn = new PlanetScaleConnection(config);
  
  switch (req.method) {
    case 'GET':
      const companies = await conn.execute('SELECT * FROM companies WHERE is_active = 1');
      res.json(companies.rows);
      break;
    case 'POST':
      // Create new company
      break;
    // ... other methods
  }
}
```

### Option 2: Firebase Firestore
```javascript
// /api/companies.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const snapshot = await getDocs(collection(db, 'companies'));
      const companies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(companies);
      break;
    // ... other methods
  }
}
```

### Option 3: Supabase (Full-stack solution)
```javascript
// /api/companies.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      res.json(data);
      break;
    // ... other methods
  }
}
```

## Environment Variables Needed
```env
# Database
DATABASE_HOST=your-database-host
DATABASE_USERNAME=your-username  
DATABASE_PASSWORD=your-password

# Admin Authentication
ADMIN_EMAIL=admin@stepsciences.com
ADMIN_PASSWORD_HASH=bcrypt-hash

# API Security
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key
```

## Security Features
- JWT-based admin authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting on public endpoints
- Audit logging for all changes

## Deployment Steps
1. Set up database (PlanetScale/Supabase/Firebase)
2. Deploy API endpoints to Vercel
3. Add admin route protection
4. Update frontend to use dynamic configs
5. Set up domain management