// /api/admin/login.js - Admin authentication endpoint
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.SUPABASE_URL || 'https://cabtsqukaofxofsufaui.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Debug environment variables
console.log('Admin login environment check:', {
  hasServiceKey: !!supabaseServiceKey,
  hasAnonKey: !!supabaseAnonKey,
  anonKeyLength: supabaseAnonKey?.length || 0
});

// Validate environment variables
if (!supabaseAnonKey) {
  console.error('SUPABASE_ANON_KEY environment variable is missing');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // For development, use simple credentials
    if (email === 'admin@stepsciences.com' && password === 'admin123') {
      const user = {
        id: 'admin-dev',
        email: 'admin@stepsciences.com',
        role: 'admin'
      };

      const token = 'dev-token-' + Date.now();

      return res.status(200).json({
        user,
        token,
        message: 'Login successful'
      });
    }

    // Try to validate against database (if service key is available)
    if (supabaseServiceKey) {
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

      if (error || !adminUser) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, adminUser.password_hash);
      
      if (!passwordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminUser.id);

      const user = {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      };

      const token = 'admin-' + adminUser.id + '-' + Date.now();

      return res.status(200).json({
        user,
        token,
        message: 'Login successful'
      });
    }

    // Fallback - invalid credentials
    return res.status(401).json({ error: 'Invalid credentials' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}