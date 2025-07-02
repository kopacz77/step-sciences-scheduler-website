-- Step Sciences Scheduler - Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Create companies table
CREATE TABLE companies (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  primary_color VARCHAR(7) DEFAULT '#000000',
  secondary_color VARCHAR(7) DEFAULT '#D4AF37',
  logo VARCHAR(200) DEFAULT '/logos/default-logo.png',
  calendar_url TEXT NOT NULL,
  intake_form_url TEXT NOT NULL,
  contact_email VARCHAR(100) NOT NULL DEFAULT 'info@stepsciences.com',
  show_branding BOOLEAN DEFAULT true,
  meeting_location TEXT,
  monday_location TEXT,
  friday_location TEXT,
  special_instructions TEXT,
  local_organizer_message TEXT,
  booking_instructions TEXT,
  domain VARCHAR(100) UNIQUE NOT NULL,
  has_scan_days BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_companies_active ON companies(is_active);
CREATE INDEX idx_companies_name ON companies(name);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert Canadian Auto Plants data
INSERT INTO companies (
  id, name, full_name, primary_color, secondary_color, logo,
  calendar_url, intake_form_url, contact_email, show_branding,
  monday_location, friday_location, special_instructions,
  local_organizer_message, booking_instructions,
  domain, has_scan_days, is_active
) VALUES 
(
  'gm-oshawa',
  'GM Oshawa',
  'General Motors Oshawa Assembly Plant',
  '#000000',
  '#D4AF37',
  '/logos/gm-logo.png',
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ13iuKCFJo-LEdLYI0xL61iPO3DA4XB5di_P9b7NQ05dR2qYKjYKjCu9hzYaBn3G2-p8o2qDoE9',
  'https://step-sciences.web.app/intake/gm/oshawa',
  'info@stepsciences.com',
  true,
  'Building C - Medical Offices next to SUD Office',
  'Building D - TFT Boardrooms (east end of building D)',
  'Please bring Health Card and Greenshield Card to the appointment.',
  'Contact your shift supervisor if you need time off for this appointment.',
  'Book early - slots fill up quickly! Monday and Friday locations are different.',
  'gmoshawa.stepsciences.com',
  true,
  true
),
(
  'gm-cami',
  'GM CAMI',
  'General Motors CAMI Assembly Plant - Ingersoll, ON',
  '#000000',
  '#D4AF37',
  '/logos/gm-logo.png',
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1Qf9K1O090x0jfhUtHXSjuqYWoMPt-qnoOprYgAFZ6t4YTono4Vu2wzhrZyCzP4VaPsQe8z7oW',
  'https://step-sciences.web.app/intake/gm/cami',
  'info@stepsciences.com',
  true,
  NULL,
  NULL,
  'Please bring Health Card and Greenshield Card to the appointment.',
  'Appointments available during all shifts. Check with your team lead about scheduling.',
  'Limited slots available - book as soon as possible.',
  'gmcami.stepsciences.com',
  false,
  true
),
(
  'stellantis-windsor',
  'Stellantis Windsor',
  'Stellantis Windsor Assembly Plant - Windsor, ON',
  '#C41E3A',
  '#FFD700',
  '/logos/stellantis-logo.png',
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1kC5ubA-6Nc_ZIYopLxcxhZf27MKHL2DKtEWo12EK8jJ3Bs-mUJiDlFSNPht7VZjW0I24hyLcX',
  'https://step-sciences.web.app/intake/stellantis/windsor',
  'info@stepsciences.com',
  true,
  NULL,
  NULL,
  'Please bring Health Card and Greenshield Card to the appointment.',
  'Check with your supervisor about time off. Medical appointments are paid time.',
  'Appointments available Monday-Friday. Book 2 weeks in advance.',
  'stellantiswindsor.stepsciences.com',
  false,
  true
),
(
  'stellantis-brampton',
  'Stellantis Brampton',
  'Stellantis Brampton Assembly Plant - Brampton, ON',
  '#C41E3A',
  '#FFD700',
  '/logos/stellantis-logo.png',
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ352MeLCrtbXyHXmoAj_vQQMaF1Kc7xnGw6ozocHElXDtmxIUVHCad0CEPuXfY9u6JzDFXDcryD',
  'https://step-sciences.web.app/intake/stellantis/brampton',
  'info@stepsciences.com',
  true,
  NULL,
  NULL,
  'Check in at security desk before proceeding to appointment. Please bring Health Card and Greenshield Card to the appointment.',
  'Security clearance required. Contact HR if you need assistance with access.',
  'Book early - limited slots. Check in at main security 15 minutes before appointment.',
  'stellantisbrampton.stepsciences.com',
  false,
  true
),
(
  'ford-oakville',
  'Ford Oakville',
  'Ford Oakville Assembly Complex - Oakville, ON',
  '#003478',
  '#FFD100',
  '/logos/ford-logo.png',
  'https://calendar.google.com/calendar/u/0/appointments/schedules/YOUR_FORD_OAKVILLE_CALENDAR_ID_HERE',
  'https://step-sciences.web.app/intake/ford/oakville',
  'info@stepsciences.com',
  true,
  NULL,
  NULL,
  'Please bring Health Card and Greenshield Card to the appointment.',
  'Health assessments are covered by Ford benefits. No cost to employees.',
  'Popular slots fill quickly. Booking opens 30 days in advance.',
  'fordoakville.stepsciences.com',
  false,
  true
),
(
  'ford-windsor',
  'Ford Windsor',
  'Ford Windsor Engine Plant - Windsor, ON',
  '#003478',
  '#FFD100',
  '/logos/ford-logo.png',
  'https://calendar.google.com/calendar/u/0/appointments/schedules/YOUR_FORD_WINDSOR_CALENDAR_ID_HERE',
  'https://step-sciences.web.app/intake/ford/windsor',
  'info@stepsciences.com',
  true,
  NULL,
  NULL,
  'Please bring Health Card and Greenshield Card to the appointment.',
  'Engine plant workers get priority scheduling. Contact plant nurse with questions.',
  'Flexible scheduling available for all shifts. Weekend slots limited.',
  'fordwindsor.stepsciences.com',
  false,
  true
),
(
  'unifor-windsor-200-444',
  'Unifor Local 200/444',
  'Unifor Windsor Local 200/444 - Windsor, ON',
  '#FF6B35',
  '#004D9F',
  '/logos/unifor-logo.png',
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2voIAfvaNtU0C0SdpmkJSv9vpM_fEjYXYab4XVbAwAiNA2J5OCRVNmHvfSIvbFSMItsNzMr8Vs',
  'https://step-sciences.web.app/intake/unifor/windsor-200-444',
  'info@stepsciences.com',
  true,
  NULL,
  NULL,
  'Please bring Health Card and Greenshield Card to the appointment.',
  'Union members get priority access. Contact your union rep for more info.',
  'Free health assessments for all Unifor members. Book during break times.',
  'uniforwindsor.stepsciences.com',
  false,
  true
);

-- Add meeting_location for non-scan-day companies
UPDATE companies 
SET meeting_location = CASE 
  WHEN id = 'gm-cami' THEN 'Unifor Local 88 Hall'
  WHEN id = 'stellantis-windsor' THEN 'Health Services Wing, Second Floor'
  WHEN id = 'stellantis-brampton' THEN 'Health Services Department, Main Administration Building'
  WHEN id = 'ford-oakville' THEN 'Medical Center, First Floor'
  WHEN id = 'ford-windsor' THEN 'Medical Office, Building C'
  WHEN id = 'unifor-windsor-200-444' THEN 'Basement of the Unifor Hall'
  ELSE meeting_location
END
WHERE has_scan_days = false;

-- Create RLS policies for security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active companies
CREATE POLICY "Allow public read access to active companies" ON companies
  FOR SELECT USING (is_active = true);

-- Allow authenticated admin access for all operations
CREATE POLICY "Allow admin full access" ON companies
  FOR ALL USING (
    auth.role() = 'authenticated' 
    AND auth.jwt() ->> 'role' = 'admin'
  );

-- Create admin users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Insert default admin user (password: 'admin123' - change this!)
INSERT INTO admin_users (email, password_hash, role) VALUES (
  'admin@stepsciences.com',
  '$2b$10$rOTJr3WRHIGWXKjXBXaXDOyXmGQEjzGz5D.Vr/V5.7YBhA2aF4PGm',
  'admin'
);