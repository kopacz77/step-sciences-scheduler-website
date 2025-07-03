// /api/upload-logo.js - Handle logo file uploads to local filesystem
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { filename, fileData, companyId } = req.body;
    
    if (!filename || !fileData || !companyId) {
      return res.status(400).json({ error: 'Missing required fields: filename, fileData, companyId' });
    }

    // Validate file type
    const fileExt = filename.split('.').pop().toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!allowedExts.includes(fileExt)) {
      return res.status(400).json({ error: 'Invalid file type. Please use JPG, PNG, GIF, or WebP.' });
    }

    // Generate safe filename
    const safeCompanyId = companyId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const safeFilename = `${safeCompanyId}-logo.${fileExt}`;
    
    // Extract base64 data (remove data:image/...;base64, prefix)
    const base64Data = fileData.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Define file paths
    const publicDir = path.join(process.cwd(), 'public', 'logos');
    const filePath = path.join(publicDir, safeFilename);
    const logoPath = `/logos/${safeFilename}`;

    // Ensure logos directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write file to public/logos directory
    fs.writeFileSync(filePath, base64Data, 'base64');

    console.log('Logo uploaded successfully:', {
      companyId,
      filename: safeFilename,
      path: logoPath,
      fileSize: Math.round(base64Data.length * 0.75) // Approximate file size
    });

    res.status(200).json({ 
      success: true,
      logoPath,
      message: 'Logo uploaded successfully',
      note: 'File saved to public/logos/ directory. Commit to Git to persist.'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
}