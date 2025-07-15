// /api/config/[domain].js - Public endpoint for company config lookup by domain
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://cabtsqukaofxofsufaui.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYnRzcXVrYW9meG9mc3VmYXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjQwMzksImV4cCI6MjA2NzA0MDAzOX0.bjITY67lM0h4wWdpEpqvZCOhZuj-lLhF-PS65_6SyDk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export default async function handler(req, res) {
  const { domain } = req.query;

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Cache for 5 minutes
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    // Sanitize domain input
    const cleanDomain = domain?.toLowerCase().trim();
    
    if (!cleanDomain || !cleanDomain.includes('stepsciences.com')) {
      return res.status(400).json({ error: 'Invalid domain format' });
    }

    // Look up company by domain
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('domain', cleanDomain)
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No company found for this domain
        return res.status(404).json({ error: 'Company not found for domain' });
      }
      console.error('Supabase lookup error:', error);
      return res.status(500).json({ error: 'Failed to lookup company' });
    }

    // Return company configuration
    res.status(200).json(formatCompanyForClient(company));
    
  } catch (error) {
    console.error('Domain lookup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}