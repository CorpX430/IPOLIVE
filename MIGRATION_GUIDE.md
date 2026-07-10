# Migration Guide: Replit → Vercel

## Overview
This guide walks through migrating IPOLIVE from Replit to Vercel with zero downtime for your admin features and API endpoints.

## What's Changing

### ✅ What Stays the Same
- All API endpoints and functionality
- Admin page features and authentication
- Database schema and data
- Code structure and dependencies
- TypeScript configuration
- Express.js API server

### ⚠️ What's Different

| Aspect | Replit | Vercel |
|--------|--------|--------|
| **Infrastructure** | Always-on Container | Serverless |
| **Scaling** | Manual | Automatic |
| **Cold Starts** | None | ~1-2s on first request |
| **Database** | Built-in | External (Vercel Postgres, Neon, etc.) |
| **Environment** | Isolated | GitHub-connected |
| **Cost Model** | Monthly subscription | Pay-as-you-go |

## Pre-Migration Checklist

- [ ] Backup Replit database
- [ ] Document all environment variables from Replit
- [ ] List all custom domains or DNS records
- [ ] Test all admin features locally
- [ ] Export any attached files/assets
- [ ] Note any external API integrations

## Step-by-Step Migration

### Phase 1: Prepare

1. **Export Replit Data**
   ```bash
   # From Replit Shell
   pg_dump $DATABASE_URL > backup.sql
   ```

2. **Save Environment Variables**
   - Note all variables from Replit Secrets
   - Create `.env.example` with dummy values

3. **Test Build Locally**
   ```bash
   pnpm install
   pnpm run build
   pnpm --filter @workspace/api-server run dev
   ```

### Phase 2: Set Up Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com/signup
   - Sign up with GitHub

2. **Import Repository**
   - Dashboard → New Project
   - Select CorpX430/IPOLIVE
   - Configure as per DEPLOYMENT.md

3. **Set Up Database**
   - Option A: Use Vercel Postgres
     - Dashboard → Storage → Create Postgres
     - Copy connection string
   
   - Option B: Use existing provider
     - Get connection string from your provider
     - Ensure Vercel IP is whitelisted

4. **Configure Environment Variables**
   - Project Settings → Environment Variables
   - Add all variables from `.env.example`:
     - `DATABASE_URL`
     - `ADMIN_SECRET`
     - `ADMIN_TOKEN`
     - `NODE_ENV=production`

### Phase 3: Database Migration

1. **Create New Database Schema**
   ```bash
   # Pull Vercel environment
   vercel env pull .env.local
   
   # Create schema in new database
   pnpm --filter @workspace/db run push
   ```

2. **Migrate Data** (if needed)
   ```bash
   # Export from Replit
   pg_dump $OLD_DATABASE_URL > data.sql
   
   # Import to Vercel Postgres
   psql $DATABASE_URL < data.sql
   ```

### Phase 4: Deploy & Test

1. **Deploy to Vercel**
   ```bash
   # Via GitHub: Push to main branch
   git push origin vercel-migration
   # Then create PR and merge
   
   # Or via CLI:
   vercel --prod
   ```

2. **Verify Deployment**
   - Check Vercel dashboard for successful build
   - Test API endpoints:
     ```bash
     curl https://your-project.vercel.app/api/health
     ```

3. **Test Admin Features**
   - Access admin endpoint:
     ```bash
     curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
          https://your-project.vercel.app/api/admin/status
     ```

4. **Monitor Logs**
   - Vercel Dashboard → Deployments → Logs
   - Watch for any errors

### Phase 5: Cutover & Cleanup

1. **Update DNS** (if custom domain)
   - Go to Vercel → Settings → Domains
   - Add your domain
   - Update DNS records as shown

2. **Monitor Replit**
   - Keep Replit deployment running for 24-48 hours
   - Monitor error logs
   - Keep database accessible for rollback

3. **Disable Replit** (when confident)
   - Stop Replit deployment
   - Archive Replit repository (don't delete)

## Admin Features on Vercel

Your admin page functionality works the same way on Vercel:

### Authentication
- Supports both token-based and secret-based auth
- Configure `ADMIN_TOKEN` and `ADMIN_SECRET` as env vars
- Middleware in `middleware.ts` enforces protection

### Example Admin Request
```javascript
const response = await fetch('https://your-project.vercel.app/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  }
});
```

### Admin Endpoints
All existing admin endpoints remain available:
- `/api/admin/dashboard`
- `/api/admin/users`
- `/api/admin/settings`
- `/api/admin/logs`
- (Add your specific admin endpoints here)

## Troubleshooting

### Build Failures
**Error**: "Cannot find module"
- **Solution**: Ensure `pnpm-lock.yaml` is committed

**Error**: "DATABASE_URL not set"
- **Solution**: Add env var in Vercel dashboard

### Runtime Errors
**Error**: "Connection refused" to database
- **Solution**: Verify connection string and IP whitelisting

**Error**: "401 Unauthorized" on admin endpoints
- **Solution**: Check `ADMIN_TOKEN` matches in header

### Performance Issues
**Problem**: Slow cold starts
- **Solution**: 1-2s is normal; use Pro plan for improvements

**Problem**: Database timeouts
- **Solution**: Use connection pooling; consider Vercel Postgres

## Rollback Plan

If issues occur:

1. **Immediate**: Route traffic back to Replit
   - Update DNS records
   - Or update client to use Replit URL

2. **In Vercel**: Promote previous deployment
   - Dashboard → Deployments
   - Find last working deployment
   - Click menu → Promote to Production

3. **Revert Code**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

## Post-Migration Checklist

- [ ] All API endpoints responding
- [ ] Admin features working
- [ ] Database queries performant
- [ ] Logs appear in Vercel dashboard
- [ ] Email notifications (if any) working
- [ ] External integrations functioning
- [ ] Custom domain resolving
- [ ] HTTPS working (auto-enabled)
- [ ] Rate limiting working (if configured)
- [ ] Monitoring/alerting set up

## Performance Optimization

### Enable Caching
```typescript
// In your routes
res.set('Cache-Control', 'max-age=3600, s-maxage=86400');
```

### Optimize Database Queries
- Use connection pooling
- Add indexes on frequently queried columns
- Consider caching layer (Redis)

### Monitor Metrics
- Vercel Analytics dashboard
- Database query performance
- API response times

## Cost Comparison

### Replit
- Starter: $0/mo (limited)
- Pro: $20/mo
- Boost: $40/mo

### Vercel
- Free: Great for dev/testing
- Pro: $20/mo (includes Postgres)
- Pay-as-you-go: $0-variable based on usage

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Community**: https://vercel.com/support
- **Express.js Docs**: https://expressjs.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs

## Success Criteria

✅ **Migration is successful when:**
- All endpoints respond correctly
- Admin panel fully functional
- Database operations perform well
- No data loss
- Performance meets or exceeds Replit
- Cost is acceptable

## Next Steps

1. Review DEPLOYMENT.md
2. Run `scripts/setup-vercel.sh`
3. Connect GitHub repository to Vercel
4. Set environment variables
5. Deploy first version
6. Test thoroughly
7. Update DNS (if applicable)
8. Monitor and optimize

---

**Questions?** Check DEPLOYMENT.md or review Vercel documentation.
