// /api/logos.js - Get all available logo files
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const logosDir = path.join(process.cwd(), 'public', 'logos');
    
    // Check if logos directory exists
    if (!fs.existsSync(logosDir)) {
      return res.status(200).json([]);
    }

    // Read all files in logos directory
    const files = fs.readdirSync(logosDir);
    
    // Filter for image files and format for dropdown
    const logoFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext);
      })
      .map(file => {
        // Create display name from filename
        const nameWithoutExt = path.parse(file).name;
        const displayName = nameWithoutExt
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        return {
          value: `/logos/${file}`,
          label: displayName,
          filename: file
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));

    res.status(200).json(logoFiles);

  } catch (error) {
    console.error('Error reading logos directory:', error);
    res.status(500).json({ error: 'Failed to read logos directory' });
  }
}