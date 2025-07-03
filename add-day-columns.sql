-- Migration to add missing day columns to companies table
-- Run this in Supabase SQL Editor to add support for all 7 days

ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS tuesday_location TEXT,
ADD COLUMN IF NOT EXISTS wednesday_location TEXT,
ADD COLUMN IF NOT EXISTS thursday_location TEXT,
ADD COLUMN IF NOT EXISTS saturday_location TEXT,
ADD COLUMN IF NOT EXISTS sunday_location TEXT;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'companies' 
AND column_name LIKE '%_location'
ORDER BY column_name;