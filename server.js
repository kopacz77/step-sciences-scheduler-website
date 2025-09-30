// server.js - Development API server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import Supabase for companies endpoint
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://cabtsqukaofxofsufaui.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@stepsciences.com' && password === '.xkz6oti063p0.PXFWFOC8JB!37') {
    return res.status(200).json({
      user: { id: 'admin-dev', email, role: 'admin' },
      token: 'dev-token-' + Date.now(),
      message: 'Login successful'
    });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
});

// Companies endpoint
app.get('/api/companies', async (req, res) => {
  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch companies' });
    }
    
    const formattedCompanies = companies.map(row => ({
      id: row.id,
      name: row.name,
      fullName: row.full_name,
      primaryColor: row.primary_color,
      secondaryColor: row.secondary_color,
      logo: row.logo,
      calendarUrl: row.calendar_url,
      intakeFormUrl: row.intake_form_url,
      contactEmail: row.contact_email,
      showBranding: Boolean(row.show_branding),
      meetingLocation: row.meeting_location,
      scanDayLocations: {
        monday: row.monday_location,
        tuesday: row.tuesday_location,
        wednesday: row.wednesday_location,
        thursday: row.thursday_location,
        friday: row.friday_location,
        saturday: row.saturday_location,
        sunday: row.sunday_location
      },
      specialInstructions: row.special_instructions,
      domain: row.domain,
      hasScanDays: Boolean(row.has_scan_days),
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      // Landing page fields
      landingPageEnabled: Boolean(row.landing_page_enabled),
      landingPageTitle: row.landing_page_title,
      landingPageSubtitle: row.landing_page_subtitle,
      landingPageDescription: row.landing_page_description,
      landingPageFeatures: row.landing_page_features ? JSON.parse(row.landing_page_features) : [],
      landingPageCtaText: row.landing_page_cta_text,
      landingPageBackgroundImage: row.landing_page_background_image,
      landingPageShowCompanyLogo: Boolean(row.landing_page_show_company_logo)
    }));
    
    res.json(formattedCompanies);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;