// api/companies/update.js
// Vercel serverless function for updating companies with landing page data

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://cabtsqukaofxofsufaui.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    if (req.method === 'PUT' && id) {
      // Update existing company including landing page fields
      const companyData = req.body;

      const { data, error } = await supabase
        .from('companies')
        .update({
          ...companyData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .single();

      if (error) {
        console.error('Update error:', error);
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({
        message: 'Company updated successfully',
        data
      });
    }

    if (req.method === 'POST') {
      // Create new company with landing page fields
      const companyData = req.body;

      const { data, error } = await supabase
        .from('companies')
        .insert({
          ...companyData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .single();

      if (error) {
        console.error('Insert error:', error);
        return res.status(400).json({ error: error.message });
      }

      return res.status(201).json({
        message: 'Company created successfully',
        data
      });
    }

    if (req.method === 'DELETE' && id) {
      // Delete company
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({
        message: 'Company deleted successfully'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};