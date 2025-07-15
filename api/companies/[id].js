// /api/companies/[id].js - Individual company CRUD operations
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://cabtsqukaofxofsufaui.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYnRzcXVrYW9meG9mc3VmYXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjQwMzksImV4cCI6MjA2NzA0MDAzOX0.bjITY67lM0h4wWdpEpqvZCOhZuj-lLhF-PS65_6SyDk';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

const formatCompanyForClient = (row) => {
  const scanDayLocations = {};
  if (row.monday_location) scanDayLocations.monday = row.monday_location;
  if (row.tuesday_location) scanDayLocations.tuesday = row.tuesday_location;
  if (row.wednesday_location) scanDayLocations.wednesday = row.wednesday_location;
  if (row.thursday_location) scanDayLocations.thursday = row.thursday_location;
  if (row.friday_location) scanDayLocations.friday = row.friday_location;
  if (row.saturday_location) scanDayLocations.saturday = row.saturday_location;
  if (row.sunday_location) scanDayLocations.sunday = row.sunday_location;

  return {
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
    scanDayLocations,
    specialInstructions: row.special_instructions,
    domain: row.domain,
    hasScanDays: Boolean(row.has_scan_days),
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const validateCompany = (company) => {
  const errors = [];
  
  if (!company.name || company.name.trim().length < 2) {
    errors.push('Company name is required (minimum 2 characters)');
  }
  
  // Accept any URL that starts with http/https
  if (!company.calendar_url || !company.calendar_url.startsWith('http')) {
    errors.push('Valid calendar URL is required (must start with http:// or https://)');
  }
  
  if (!company.intake_form_url || !company.intake_form_url.startsWith('http')) {
    errors.push('Valid intake form URL is required (must start with http:// or https://)');
  }
  
  if (!company.domain || !company.domain.includes('stepsciences.com')) {
    errors.push('Valid domain is required (must be stepsciences.com subdomain)');
  }
  
  return errors;
};

const sanitizeCompany = (company) => ({
  name: company.name?.trim(),
  full_name: company.full_name?.trim(),
  primary_color: company.primary_color || '#000000',
  secondary_color: company.secondary_color || '#D4AF37',
  logo: company.logo || '/logos/default-logo.png',
  calendar_url: company.calendar_url?.trim(),
  intake_form_url: company.intake_form_url?.trim(),
  contact_email: company.contact_email?.trim() || 'info@stepsciences.com',
  show_branding: Boolean(company.show_branding ?? true),
  meeting_location: company.meeting_location?.trim() || null,
  monday_location: company.monday_location?.trim() || null,
  tuesday_location: company.tuesday_location?.trim() || null,
  wednesday_location: company.wednesday_location?.trim() || null,
  thursday_location: company.thursday_location?.trim() || null,
  friday_location: company.friday_location?.trim() || null,
  saturday_location: company.saturday_location?.trim() || null,
  sunday_location: company.sunday_location?.trim() || null,
  special_instructions: company.special_instructions?.trim() || null,
  domain: company.domain?.toLowerCase().trim(),
  has_scan_days: Boolean(company.has_scan_days),
  is_active: Boolean(company.is_active ?? true)
});

export default async function handler(req, res) {
  const { id } = req.query;

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get single company by ID
        const { data: company, error: selectError } = await supabasePublic
          .from('companies')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single();
        
        if (selectError) {
          if (selectError.code === 'PGRST116') {
            return res.status(404).json({ error: 'Company not found' });
          }
          console.error('Supabase select error:', selectError);
          return res.status(500).json({ error: 'Failed to fetch company' });
        }
        
        res.status(200).json(formatCompanyForClient(company));
        break;

      case 'PUT':
        // Update company (admin only)
        console.log('PUT request received for ID:', id);
        console.log('PUT request body:', req.body);
        
        const updates = sanitizeCompany(req.body);
        console.log('Sanitized updates:', updates);
        
        const errors = validateCompany(updates);
        console.log('Validation errors:', errors);
        
        if (errors.length > 0) {
          return res.status(400).json({ errors });
        }
        
        const { data: updated, error: updateError } = await supabaseAdmin
          .from('companies')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (updateError) {
          if (updateError.code === 'PGRST116') {
            return res.status(404).json({ error: 'Company not found' });
          }
          console.error('Supabase update error:', updateError);
          return res.status(500).json({ error: 'Failed to update company' });
        }

        res.status(200).json({ 
          message: 'Company updated successfully', 
          company: formatCompanyForClient(updated)
        });
        break;

      case 'DELETE':
        // Soft delete company (admin only)
        const { data: deleted, error: deleteError } = await supabaseAdmin
          .from('companies')
          .update({ is_active: false })
          .eq('id', id)
          .select()
          .single();

        if (deleteError) {
          if (deleteError.code === 'PGRST116') {
            return res.status(404).json({ error: 'Company not found' });
          }
          console.error('Supabase delete error:', deleteError);
          return res.status(500).json({ error: 'Failed to delete company' });
        }

        res.status(200).json({ message: 'Company deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'OPTIONS']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}