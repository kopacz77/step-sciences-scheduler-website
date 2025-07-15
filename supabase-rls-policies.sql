-- RLS Policies for Step Sciences Scheduler
-- Run this in Supabase SQL Editor AFTER enabling RLS

-- Enable RLS on companies table
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Enable RLS on admin_users table  
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Companies table policies
-- Allow public READ access to active companies (for public site functionality)
CREATE POLICY "Public can view active companies" ON companies
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow service role full access (for admin operations)
CREATE POLICY "Service role can do everything on companies" ON companies
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admin users table policies
-- Allow service role full access to admin users (for admin login)
CREATE POLICY "Service role can access admin users" ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Optional: Allow authenticated users to read admin users (if needed)
-- CREATE POLICY "Authenticated can read admin users" ON admin_users
--   FOR SELECT
--   TO authenticated
--   USING (true);