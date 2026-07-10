# Vercel Deployment Guide for IPOLIVE

## Overview
This guide explains how to deploy IPOLIVE to Vercel, replacing the Replit deployment.

## Prerequisites
- Vercel account (https://vercel.com)
- GitHub account with access to this repository
- Node.js 24+ and pnpm installed locally

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository `CorpX430/IPOLIVE`
4. Configure project settings:
   - **Framework Preset**: Other (Node.js)
   - **Root Directory**: `./`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `./artifacts/api-server/dist`
   - **Install Command**: `pnpm install --frozen-lockfile`

### 2. Environment Variables

Add the following environment variables in Vercel Project Settings > Environment Variables:

```
DATABASE_URL=postgresql://your-postgres-connection-string
NODE_ENV=production
PORT=5000
ADMIN_SECRET=your-secure-admin-secret
ADMIN_TOKEN=your-secure-admin-token
```

**Important**: Use production-grade PostgreSQL (e.g., Neon, Railway, AWS RDS, or Vercel Postgres)

### 3. Database Setup

#### Option A: Vercel Postgres (Recommended)
1. In Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the `POSTGRES_URL_NON_POOLING` (for migrations)
4. Set `DATABASE_URL` to this connection string

#### Option B: External PostgreSQL
Use connection string from your preferred provider:
- Neon: https://neon.tech
- Railway: https://railway.app
- AWS RDS: https://aws.amazon.com/rds

### 4. Deploy

#### Automatic Deployment
- Push to `main` branch → Auto-deploys
- Push to any branch → Creates preview deployment

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (from project root)
vercel

# Deploy to production
vercel --prod
```

## Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run API server locally
pnpm --filter @workspace/api-server run dev

# Run type checking
pnpm run typecheck

# Build all packages
pnpm run build
```

## Project Structure

```
IOLIVE/
├── artifacts/
│   ├── api-server/          # Express API (main backend)
│   ├── mockup-sandbox/      # Testing/mockup environment
│   └── spcx-market/         # Market features
├── lib/                     # Shared libraries
├── scripts/                 # Build/utility scripts
├── api/                     # Vercel serverless functions
├── vercel.json             # Vercel configuration
└── pnpm-workspace.yaml     # Workspace configuration
```

## API Endpoints

All API endpoints are available under `/api/` path:
- **Production**: `https://your-project.vercel.app/api/*`
- **Local**: `http://localhost:5000/api/*`

## Admin Features

### Admin Access
The admin panel features are maintained and accessible via:
- Admin endpoint: `https://your-project.vercel.app/api/admin/*`
- Requires valid `ADMIN_TOKEN` or `ADMIN_SECRET`

### Admin Authentication
Include in request headers:
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

Or in request body for certain endpoints:
```json
{
  "adminSecret": "YOUR_ADMIN_SECRET"
}
```

## Monitoring & Debugging

### View Logs
1. Vercel Dashboard → Your Project → Deployments
2. Click on a deployment to view logs
3. Or use Vercel CLI:
   ```bash
   vercel logs
   ```

### Monitor Performance
- Vercel Analytics: Auto-enabled
- View at: Project Settings > Analytics
- Monitor API response times and error rates

## Database Migrations

Run migrations before deploying:

```bash
# Local development
pnpm --filter @workspace/db run push

# Production (via Vercel CLI)
vercel env pull .env.local
pnpm --filter @workspace/db run push
```

## Troubleshooting

### Build Fails
- Check Node.js version matches (24+)
- Verify `pnpm-lock.yaml` is committed
- Run `pnpm install --frozen-lockfile` locally first

### Database Connection Issues
- Verify `DATABASE_URL` is correct in Vercel env vars
- Check database is accessible (IP whitelist if applicable)
- Test locally: `pnpm --filter @workspace/db run push`

### Admin Features Not Working
- Verify `ADMIN_TOKEN` and `ADMIN_SECRET` are set
- Check authorization headers in requests
- Review API logs for specific errors

### Cold Starts
- Vercel automatically optimizes function cold starts
- Use Vercel Pro for better performance
- Consider using Vercel Postgres for reduced latency

## Rollback

In Vercel Dashboard:
1. Go to Deployments
2. Find the previous working deployment
3. Click the three dots menu
4. Select "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

## Continuous Integration

Vercel automatically:
- Runs on every git push
- Creates preview deployments for PRs
- Promotes to production on merge to main

No additional CI/CD configuration needed!

## Cost Considerations

- **Free Tier**: Perfect for development/testing
- **Pro Plan**: Required for production with high traffic
- **Database**: Vercel Postgres included in Pro plan
- Monitor usage: Project Settings > Usage

## Next Steps

1. ✅ Push this code to GitHub
2. ✅ Connect Vercel to your GitHub repository
3. ✅ Set environment variables
4. ✅ Deploy first version
5. ✅ Test all endpoints
6. ✅ Monitor logs and performance
7. ✅ Set up domain (optional)

## Support

- Vercel Docs: https://vercel.com/docs
- GitHub Issues: Check repository issues
- Vercel Support: https://vercel.com/support

## Differences from Replit

| Feature | Replit | Vercel |
|---------|--------|--------|
| Deployment | Always-on container | Serverless functions |
| Scaling | Manual | Automatic |
| Cost | Fixed monthly | Pay-as-you-go |
| Cold starts | None | Only on first request |
| Database | Built-in PostgreSQL | External (Vercel Postgres, Neon, etc.) |
| CLI | Built-in | Optional Vercel CLI |
| Version control | Git optional | Git required |

---

**Last Updated**: 2026-07-10
**Migration From**: Replit
**Migration To**: Vercel
