# Quick Start Guide

## 1. Set Up Database (Required First!)

1. Go to your Supabase dashboard: https://supabase.com/dashboard/projects
2. Select your project: `cabtsqukaofxofsufaui`
3. Go to **SQL Editor** in the left sidebar
4. Click **"New Query"**
5. Copy the entire contents of `supabase-schema.sql` and paste it
6. Click **"Run"** to execute

## 2. Start the App

```bash
# In a new terminal:
pnpm start
```

## 3. Test URLs

- **Main App**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Test Connection**: `node test-supabase.js`

## 4. Admin Login
- **Email**: admin@stepsciences.com  
- **Password**: admin123

## 5. Test Flow
1. Visit main app → should show GM Oshawa
2. Try booking flow
3. Visit admin → add a new test plant
4. Visit your new plant's "domain" via the preview button

## Troubleshooting
- If companies don't load → database schema not run yet
- If admin won't login → check console for errors
- If styling looks broken → refresh page, React 19 can be finicky