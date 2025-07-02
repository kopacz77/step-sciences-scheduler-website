// api-routes.js - Express router for API endpoints
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Supabase configuration
const supabaseUrl = 'https://cabtsqukaofxofsufaui.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYnRzcXVrYW9meG9mc3VmYXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjQwMzksImV4cCI6MjA2NzA0MDAzOX0.bjITY67lM0h4wWdpEpqvZCOhZuj-lLhF-PS65_6SyDk';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions
const formatCompanyForClient = (row) => ({
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
    friday: row.friday_location
  },
  specialInstructions: row.special_instructions,
  localOrganizerMessage: row.local_organizer_message,
  bookingInstructions: row.booking_instructions,
  domain: row.domain,
  hasScanDays: Boolean(row.has_scan_days),
  isActive: Boolean(row.is_active)
});

const formatCompanyForDatabase = (company) => ({
  id: company.id?.toLowerCase().trim(),
  name: company.name?.trim(),
  full_name: company.fullName?.trim(),
  primary_color: company.primaryColor || '#000000',
  secondary_color: company.secondaryColor || '#D4AF37',
  logo: company.logo || '/logos/default-logo.png',
  calendar_url: company.calendarUrl?.trim(),
  intake_form_url: company.intakeFormUrl?.trim(),
  contact_email: company.contactEmail?.trim() || 'info@stepsciences.com',
  show_branding: Boolean(company.showBranding ?? true),
  meeting_location: company.meetingLocation?.trim() || null,
  monday_location: company.scanDayLocations?.monday?.trim() || null,
  friday_location: company.scanDayLocations?.friday?.trim() || null,
  special_instructions: company.specialInstructions?.trim() || null,
  local_organizer_message: company.localOrganizerMessage?.trim() || null,
  booking_instructions: company.bookingInstructions?.trim() || null,
  domain: company.domain?.toLowerCase().trim(),
  has_scan_days: Boolean(company.hasScanDays),
  is_active: Boolean(company.isActive ?? true)
});

// Authentication Routes
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Development credentials
    if (email === 'admin@stepsciences.com' && password === 'admin123') {
      const user = {
        id: 'admin-dev',
        email: 'admin@stepsciences.com',
        role: 'admin'
      };

      const token = 'dev-token-' + Date.now();

      return res.status(200).json({
        user,
        token,
        message: 'Login successful'
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Companies Routes
router.get('/companies', async (req, res) => {
  try {
    const { data: companies, error } = await supabasePublic
      .from('companies')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch companies' });
    }
    
    const formattedCompanies = companies.map(formatCompanyForClient);
    res.status(200).json(formattedCompanies);
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: company, error } = await supabasePublic
      .from('companies')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Company not found' });
      }
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch company' });
    }
    
    res.status(200).json(formatCompanyForClient(company));
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/companies', async (req, res) => {
  try {
    const company = formatCompanyForDatabase(req.body);
    
    // Basic validation
    if (!company.id || !company.name || !company.calendar_url || !company.intake_form_url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('companies')
      .insert([company])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to create company' });
    }

    res.status(201).json({ 
      message: 'Company created successfully', 
      company: formatCompanyForClient(inserted)
    });
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = formatCompanyForDatabase(req.body);
    
    const { data: updated, error } = await supabaseAdmin
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ error: 'Failed to update company' });
    }

    res.status(200).json({ 
      message: 'Company updated successfully', 
      company: formatCompanyForClient(updated)
    });
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabaseAdmin
      .from('companies')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return res.status(500).json({ error: 'Failed to delete company' });
    }

    res.status(200).json({ message: 'Company deleted successfully' });
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Config lookup by domain
router.get('/config/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const cleanDomain = domain?.toLowerCase().trim();
    
    if (!cleanDomain || !cleanDomain.includes('stepsciences.com')) {
      return res.status(400).json({ error: 'Invalid domain format' });
    }

    const { data: company, error } = await supabasePublic
      .from('companies')
      .select('*')
      .eq('domain', cleanDomain)
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Company not found for domain' });
      }
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to lookup company' });
    }

    res.status(200).json(formatCompanyForClient(company));
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;