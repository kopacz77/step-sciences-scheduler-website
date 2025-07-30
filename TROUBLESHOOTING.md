# Troubleshooting Guide

## Database Issues

### Companies Not Loading
```bash
# Test database connection
node test-supabase.js

# Check if companies exist
# Go to Supabase dashboard → Table editor → companies
```

**Common fixes:**
- Run `supabase-schema.sql` if tables don't exist
- Check RLS policies allow public read access
- Verify `is_active = true` for companies

### Admin Login Fails
```bash
# Check if admin user exists in admin_users table
# Password should be hashed with bcrypt
```

**Default admin:**
- Email: `admin@stepsciences.com`
- Password: `.xkz6oti063p0.PXFWFOC8JB!37`

## Plant Configuration

### Wrong Plant Shows
1. Check URL: `https://gmoshawa.stepsciences.com`
2. Try parameter fallback: `?company=gm-oshawa`
3. Clear browser cache
4. Verify domain in database matches exactly

### Google Calendar Button Missing
1. Wait 10 seconds (Google script loading)
2. Check browser console for errors
3. Verify calendar URL format is correct
4. Test calendar URL directly in browser

## Domain Issues

### New Subdomain Not Working
1. **DNS**: Add CNAME record: `plantname` → `cname.vercel-dns.com`
2. **Vercel**: Add domain in project settings
3. **SSL**: Wait 5-30 minutes for certificate
4. **Test**: Use DNS checker: https://dnschecker.org

### SSL Certificate Issues
- Usually resolves within 30 minutes
- Verify CNAME points to correct Vercel DNS
- Contact Vercel support if persists >24 hours

## Development Issues

### API Routes 404 (Development)
```bash
# Run both servers simultaneously
pnpm run dev
# OR separately:
pnpm start:api  # Port 3001
pnpm start      # Port 3000
```

### Build Failures
```bash
# Check for syntax errors
pnpm lint
pnpm format

# Common issues:
# - Missing commas in JSON
# - Incorrect import paths
# - Unused variables
```

## Production Issues

### Vercel Function Errors
1. Check Vercel function logs
2. Verify environment variables set
3. Ensure `nodejs20.x` runtime in vercel.json

### Environment Variables Missing
Required for production:
```bash
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET
```

## Performance

### Slow Loading
1. Check Supabase response times
2. Verify caching is working (5-minute TTL)
3. Clear browser cache
4. Test on different networks

### Memory Issues
- React 19 development can be resource-intensive
- Use production build for testing: `pnpm build && serve -s build`

## Emergency Procedures

### Roll Back Deployment
```bash
git log --oneline -10  # Find last good commit
git revert [commit-hash]
git push origin main   # Triggers auto-deploy
```

### Reset Database
```bash
# Re-run schema (will recreate tables)
# Go to Supabase → SQL Editor → Run supabase-schema.sql
```

### Contact Support
- **Vercel Issues**: Check deployment logs first
- **Supabase Issues**: Check project logs
- **DNS Issues**: Contact domain registrar