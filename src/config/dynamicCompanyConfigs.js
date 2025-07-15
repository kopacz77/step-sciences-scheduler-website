// src/config/dynamicCompanyConfigs.js
// This replaces the static companyConfigs.js with dynamic loading

const configCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback static config for development/offline mode
const fallbackConfigs = {
  'gm-oshawa': {
    name: 'GM Oshawa',
    fullName: 'General Motors Oshawa Assembly',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/gm-logo.png',
    calendarUrl:
      'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ13iuKCFJo-LEdLYI0xL61iPO3DA4XB5di_P9b7NQ05dR2qYKjYKjCu9hzYaBn3G2-p8o2qDoE9',
    intakeFormUrl: 'https://step-sciences.web.app/intake/gm/oshawa',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    scanDayLocations: {
      monday: 'Building C - Medical Offices next to SUD Office',
      friday: 'Building D - TFT Boardrooms (east end of building D)',
    },
    specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.',
    domain: 'gmoshawa.stepsciences.com',
    hasScanDays: true,
  },
};

// Validation helpers (keeping existing security)
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>'"&]/g, '')
    .trim()
    .toLowerCase();
};

const isValidCompanyId = (companyId) => {
  return /^[a-z0-9-]+$/.test(companyId);
};

const isValidStatus = (status) => {
  const validStatuses = ['booked', 'completed'];
  return validStatuses.includes(status);
};

const isValidIntakeFormUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const allowedDomains = ['step-sciences.web.app', 'stepsciences.com', 'www.stepsciences.com'];
    return allowedDomains.includes(parsedUrl.hostname) && parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidCalendarUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'calendar.google.com' && parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

// Supabase client for direct database access
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL || 'https://cabtsqukaofxofsufaui.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Format database row to client format
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
    friday: row.friday_location,
  },
  specialInstructions: row.special_instructions,
  domain: row.domain,
  hasScanDays: Boolean(row.has_scan_days),
  isActive: Boolean(row.is_active),
});

// API client for company configs
class CompanyConfigAPI {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || '/api';
  }

  async fetchCompanyByDomain(domain) {
    try {
      // Try direct Supabase query first (faster)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('domain', domain.toLowerCase())
        .eq('is_active', true)
        .single();

      if (error) {
        console.warn('Supabase domain lookup failed:', error);
        // Fallback to API endpoint
        const response = await fetch(`${this.baseUrl}/config/${encodeURIComponent(domain)}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      }

      return formatCompanyForClient(data);
    } catch (error) {
      console.warn('Failed to fetch company config:', error);
      return null;
    }
  }

  async fetchCompanyById(id) {
    try {
      // Try direct Supabase query first (faster)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.warn('Supabase ID lookup failed:', error);
        // Fallback to API endpoint
        const response = await fetch(`${this.baseUrl}/companies/${encodeURIComponent(id)}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      }

      return formatCompanyForClient(data);
    } catch (error) {
      console.warn('Failed to fetch company config:', error);
      return null;
    }
  }

  async fetchAllCompanies() {
    try {
      // Try direct Supabase query first (faster)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.warn('Supabase companies fetch failed:', error);
        // Fallback to API endpoint
        const response = await fetch(`${this.baseUrl}/companies`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      }

      return data.map(formatCompanyForClient);
    } catch (error) {
      console.warn('Failed to fetch companies:', error);
      return [];
    }
  }
}

const api = new CompanyConfigAPI();

// Cache management
const getCachedConfig = (key) => {
  const cached = configCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedConfig = (key, data) => {
  configCache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// Domain detection with dynamic loading
export const getCompanyIdFromDomain = async () => {
  const hostname = window.location.hostname.toLowerCase();

  // Check cache first
  const cacheKey = `domain:${hostname}`;
  const cached = getCachedConfig(cacheKey);
  if (cached) return cached;

  try {
    // Try to fetch company by domain
    const company = await api.fetchCompanyByDomain(hostname);
    if (company && company.id) {
      setCachedConfig(cacheKey, company.id);
      return company.id;
    }
  } catch (error) {
    console.warn('Domain lookup failed:', error);
  }

  // Fallback to URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const companyParam = urlParams.get('company');
  if (companyParam) {
    const sanitized = sanitizeInput(companyParam);
    if (isValidCompanyId(sanitized)) {
      setCachedConfig(cacheKey, sanitized);
      return sanitized;
    }
  }

  // Final fallback
  const defaultId = 'gm-oshawa';
  setCachedConfig(cacheKey, defaultId);
  return defaultId;
};

// Dynamic company config loading
export const getCompanyConfig = async (companyId) => {
  if (!companyId || !isValidCompanyId(companyId)) {
    companyId = 'gm-oshawa'; // fallback
  }

  // Check cache first
  const cacheKey = `config:${companyId}`;
  const cached = getCachedConfig(cacheKey);
  if (cached) return cached;

  try {
    // Try to fetch from API
    const config = await api.fetchCompanyById(companyId);

    if (config) {
      // Validate URLs before caching
      if (!isValidIntakeFormUrl(config.intakeFormUrl)) {
        console.error(`Invalid intake form URL for ${companyId}:`, config.intakeFormUrl);
        throw new Error('Invalid intake form URL');
      }

      if (!isValidCalendarUrl(config.calendarUrl)) {
        console.error(`Invalid calendar URL for ${companyId}:`, config.calendarUrl);
        throw new Error('Invalid calendar URL');
      }

      setCachedConfig(cacheKey, config);
      return config;
    }
  } catch (error) {
    console.warn('Failed to load company config from API:', error);
  }

  // Fallback to static config
  const fallback = fallbackConfigs[companyId] || fallbackConfigs['gm-oshawa'];
  setCachedConfig(cacheKey, fallback);
  return fallback;
};

// Get all companies (for admin interface)
export const getAllCompanies = async () => {
  const cacheKey = 'all-companies';
  const cached = getCachedConfig(cacheKey);
  if (cached) return cached;

  try {
    const companies = await api.fetchAllCompanies();
    setCachedConfig(cacheKey, companies);
    return companies;
  } catch (error) {
    console.warn('Failed to load companies:', error);
    return Object.entries(fallbackConfigs).map(([id, config]) => ({ id, ...config }));
  }
};

// URL parameter validation (keeping existing)
export const validateUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const validatedParams = {};

  const company = urlParams.get('company');
  if (company) {
    const sanitized = sanitizeInput(company);
    validatedParams.company = isValidCompanyId(sanitized) ? sanitized : null;
  }

  const status = urlParams.get('status');
  if (status) {
    const sanitized = sanitizeInput(status);
    validatedParams.status = isValidStatus(sanitized) ? sanitized : null;
  }

  const reset = urlParams.get('reset');
  if (reset) {
    validatedParams.reset = reset === 'true';
  }

  return validatedParams;
};

// Clear cache (useful for admin updates)
export const clearConfigCache = () => {
  configCache.clear();
};

// Preload company config (for performance)
export const preloadCompanyConfig = async (companyId) => {
  try {
    await getCompanyConfig(companyId);
  } catch (error) {
    console.warn('Failed to preload company config:', error);
  }
};

export default {
  getCompanyIdFromDomain,
  getCompanyConfig,
  getAllCompanies,
  validateUrlParams,
  clearConfigCache,
  preloadCompanyConfig,
};
