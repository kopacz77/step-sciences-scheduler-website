// /api/companies.js - Vercel Serverless Function with Supabase
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://cabtsqukaofxofsufaui.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYnRzcXVrYW9meG9mc3VmYXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjQwMzksImV4cCI6MjA2NzA0MDAzOX0.bjITY67lM0h4wWdpEpqvZCOhZuj-lLhF-PS65_6SyDk';

// Create Supabase clients
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions
const validateCompany = (company) => {
  const errors = [];
  
  if (!company.id || !/^[a-z0-9-]+$/.test(company.id)) {
    errors.push('Invalid company ID format (use lowercase letters, numbers, and hyphens only)');
  }
  
  if (!company.name || company.name.trim().length < 2) {
    errors.push('Company name is required (minimum 2 characters)');
  }
  
  if (!company.calendarUrl || !company.calendarUrl.includes('calendar.google.com')) {
    errors.push('Valid Google Calendar URL is required');
  }
  
  if (!company.intakeFormUrl || !company.intakeFormUrl.includes('step-sciences.web.app')) {
    errors.push('Valid intake form URL is required (must be step-sciences.web.app domain)');
  }
  
  if (!company.domain || !company.domain.includes('stepsciences.com')) {
    errors.push('Valid domain is required (must be stepsciences.com subdomain)');
  }
  
  return errors;
};

const sanitizeCompany = (company) => ({
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
  domain: company.domain?.toLowerCase().trim(),
  has_scan_days: Boolean(company.hasScanDays),
  is_active: Boolean(company.isActive ?? true)
});

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
  domain: row.domain,
  hasScanDays: Boolean(row.has_scan_days),
  isActive: Boolean(row.is_active),
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get all companies (public access for active companies)
        const { data: companies, error: selectError } = await supabasePublic
          .from('companies')
          .select('*')
          .eq('is_active', true)
          .order('name');
        
        if (selectError) {
          console.error('Supabase select error:', selectError);
          return res.status(500).json({ error: 'Failed to fetch companies' });
        }
        
        const formattedCompanies = companies.map(formatCompanyForClient);
        res.status(200).json(formattedCompanies);
        break;

      case 'POST':
        // Create new company (requires admin access)
        const newCompany = sanitizeCompany(req.body);
        const errors = validateCompany(newCompany);
        
        if (errors.length > 0) {
          return res.status(400).json({ errors });
        }

        // Check if company ID already exists
        const { data: existing, error: checkError } = await supabaseAdmin
          .from('companies')
          .select('id')
          .eq('id', newCompany.id)
          .single();
        
        if (existing) {
          return res.status(409).json({ error: 'Company ID already exists' });
        }

        // Insert new company
        const { data: inserted, error: insertError } = await supabaseAdmin
          .from('companies')
          .insert([newCompany])
          .select()
          .single();

        if (insertError) {
          console.error('Supabase insert error:', insertError);
          return res.status(500).json({ error: 'Failed to create company' });
        }

        res.status(201).json({ 
          message: 'Company created successfully', 
          company: formatCompanyForClient(inserted)
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}