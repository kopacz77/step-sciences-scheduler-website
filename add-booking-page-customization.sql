-- Booking Page Customization - Add booking page fields to companies table
-- Run this in Supabase SQL Editor to add booking page customization features

-- Add Google scheduling toggle
ALTER TABLE companies ADD COLUMN IF NOT EXISTS
  google_scheduling_enabled BOOLEAN DEFAULT true;

-- Add customizable booking page instructions (mobile)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS
  booking_page_instructions_mobile TEXT DEFAULT 'Tap to book your appointment:';

-- Add customizable booking page instructions (desktop)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS
  booking_page_instructions_desktop TEXT DEFAULT 'Click the booking button below to schedule your appointment:';

-- Add alternative message when Google scheduling is disabled
ALTER TABLE companies ADD COLUMN IF NOT EXISTS
  booking_page_alternative_message TEXT DEFAULT 'Please contact your local organizer to schedule your appointment.';

-- Create index for Google scheduling queries
CREATE INDEX IF NOT EXISTS idx_companies_google_scheduling ON companies(google_scheduling_enabled);

-- Update existing companies with default values (all Google scheduling enabled by default)
UPDATE companies
SET
  google_scheduling_enabled = true,
  booking_page_instructions_mobile = 'Tap to book your appointment:',
  booking_page_instructions_desktop = 'Click the booking button below to schedule your appointment:',
  booking_page_alternative_message = 'Please contact your local organizer to schedule your appointment.'
WHERE google_scheduling_enabled IS NULL;

-- Verify the changes
SELECT id, name, google_scheduling_enabled,
       booking_page_instructions_mobile,
       booking_page_instructions_desktop
FROM companies
LIMIT 5;
