// /api/companies/[id].js - Individual company CRUD operations
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cabtsqukaofxofsufaui.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYnRzcXVrYW9meG9mc3VmYXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjQwMzksImV4cCI6MjA2NzA0MDAzOX0.bjITY67lM0h4wWdpEpqvZCOhZuj-lLhF-PS65_6SyDk';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

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
  isActive: Boolean(row.is_active)
});

const sanitizeCompany = (company) => ({
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
        const updates = sanitizeCompany(req.body);
        
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