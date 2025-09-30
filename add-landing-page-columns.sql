-- Landing Page Enhancement - Add landing page fields to companies table
-- Run this in Supabase SQL Editor after the main schema

-- Add landing page content fields to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS
  landing_page_enabled BOOLEAN DEFAULT true;

ALTER TABLE companies ADD COLUMN IF NOT EXISTS
  landing_page_title TEXT DEFAULT 'Health & Performance Solutions';

ALTER TABLE companies ADD COLUMN IF NOT EXISTS
  landing_page_subtitle TEXT DEFAULT 'Professional health assessments for your workforce';

ALTER TABLE companies ADD COLUMN IF NOT EXISTS
  landing_page_description TEXT DEFAULT 'Step Sciences partners with leading organizations to provide comprehensive health and performance assessments. Our expert team helps identify opportunities to optimize your workforce health and productivity.';

ALTER TABLE companies ADD COLUMN IF NOT EXISTS
  landing_page_features TEXT DEFAULT '["Professional Health Assessments", "Workforce Optimization", "Expert Analysis", "Confidential Results"]';

ALTER TABLE companies ADD COLUMN IF NOT EXISTS
  landing_page_cta_text TEXT DEFAULT 'Schedule Your Assessment';

ALTER TABLE companies ADD COLUMN IF NOT EXISTS
  landing_page_background_image TEXT;

ALTER TABLE companies ADD COLUMN IF NOT EXISTS
  landing_page_show_company_logo BOOLEAN DEFAULT true;

-- Update existing companies with landing page content
UPDATE companies SET
  landing_page_title = CASE
    WHEN id = 'gm-oshawa' THEN 'GM Oshawa Health & Performance Program'
    WHEN id = 'gm-cami' THEN 'GM CAMI Employee Wellness Initiative'
    WHEN id = 'stellantis-windsor' THEN 'Stellantis Windsor Health Services'
    WHEN id = 'stellantis-brampton' THEN 'Stellantis Brampton Employee Health'
    WHEN id = 'ford-oakville' THEN 'Ford Oakville Wellness Program'
    WHEN id = 'ford-windsor' THEN 'Ford Windsor Health Initiative'
    WHEN id = 'unifor-windsor-200-444' THEN 'Unifor Member Health Services'
    ELSE landing_page_title
  END,
  landing_page_subtitle = CASE
    WHEN id LIKE 'gm-%' THEN 'Comprehensive health assessments for GM team members'
    WHEN id LIKE 'stellantis-%' THEN 'Supporting Stellantis employee health and performance'
    WHEN id LIKE 'ford-%' THEN 'Ford employee health and wellness solutions'
    WHEN id LIKE 'unifor-%' THEN 'Health services for Unifor union members'
    ELSE landing_page_subtitle
  END,
  landing_page_description = CASE
    WHEN id LIKE 'gm-%' THEN 'Step Sciences proudly partners with General Motors to provide world-class health and performance assessments for all team members. Our comprehensive evaluations help identify opportunities to optimize your health, performance, and overall well-being in the workplace.'
    WHEN id LIKE 'stellantis-%' THEN 'In partnership with Stellantis, Step Sciences delivers professional health assessments designed to support employee wellness and workplace performance. Our expert team provides confidential, comprehensive evaluations tailored to automotive industry workers.'
    WHEN id LIKE 'ford-%' THEN 'Step Sciences collaborates with Ford Motor Company to offer advanced health and performance assessments for all employees. Our proven methodology helps optimize workforce health while supporting individual wellness goals.'
    WHEN id LIKE 'unifor-%' THEN 'Step Sciences is proud to serve Unifor union members with comprehensive health and performance assessments. Our services are designed to support worker health, safety, and overall well-being in industrial environments.'
    ELSE landing_page_description
  END,
  landing_page_features = CASE
    WHEN id LIKE 'gm-%' THEN '["Comprehensive Health Screening", "Performance Optimization", "Confidential Results", "GM Benefits Coverage", "Expert Medical Analysis", "Workplace Wellness"]'
    WHEN id LIKE 'stellantis-%' THEN '["Professional Health Assessments", "Industrial Health Focus", "Confidential Evaluations", "Expert Analysis", "Stellantis Partnership", "Employee Wellness"]'
    WHEN id LIKE 'ford-%' THEN '["Advanced Health Screening", "Performance Analytics", "Confidential Service", "Ford Employee Benefits", "Expert Consultation", "Wellness Optimization"]'
    WHEN id LIKE 'unifor-%' THEN '["Union Member Services", "Comprehensive Health Screening", "Worker Safety Focus", "Confidential Results", "Industrial Health Expertise", "Member Benefits"]'
    ELSE landing_page_features
  END,
  landing_page_cta_text = CASE
    WHEN id LIKE 'gm-%' THEN 'Book Your GM Health Assessment'
    WHEN id LIKE 'stellantis-%' THEN 'Schedule Stellantis Health Screening'
    WHEN id LIKE 'ford-%' THEN 'Book Your Ford Wellness Assessment'
    WHEN id LIKE 'unifor-%' THEN 'Schedule Union Member Assessment'
    ELSE landing_page_cta_text
  END;

-- Create index for landing page queries
CREATE INDEX IF NOT EXISTS idx_companies_landing_enabled ON companies(landing_page_enabled);