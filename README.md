# IPOLIVE - IPO Investment Platform

> Live IPO trading and investment platform with admin dashboard

## 🚀 Deployment Status

**Current**: ✅ Vercel (Migrated from Replit)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide.

## 📋 Quick Start

### Prerequisites
- Node.js 24+
- pnpm 9+
- PostgreSQL database (local or cloud)

### Local Development

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Run API server
pnpm --filter @workspace/api-server run dev

# Typecheck
pnpm run typecheck

# Build for production
pnpm run build
```

## 🏗️ Project Structure

```
IPOLIVE/
├── artifacts/
│   ├── api-server/          # Express.js API server
│   ├── mockup-sandbox/      # Testing environment
│   └── spcx-market/         # Market features
├── lib/                      # Shared libraries
├── scripts/                  # Build scripts
├── api/                      # Vercel serverless functions
├── middleware.ts             # Express.js middleware
├── vercel.json              # Vercel configuration
└── pnpm-workspace.yaml      # Workspace config
```

## 🔧 Stack

- **Runtime**: Node.js 24, TypeScript 5.9
- **API**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod
- **Build**: esbuild
- **Deployment**: Vercel
- **Package Manager**: pnpm

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Replit → Vercel migration steps

## 🔌 API Endpoints

All endpoints available at `/api/*`:

### Health
- `GET /api/health` - Health check

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Investors
- `GET /api/investors` - List investors
- `POST /api/investors` - Create investor
- `GET /api/investors/:id` - Get investor details

### Holdings
- `GET /api/holdings/:investorId` - Get investor holdings
- `POST /api/holdings` - Create holding

### Deposits
- `GET /api/deposits` - List deposits
- `POST /api/deposits` - Create deposit
- `GET /api/deposits/:id` - Get deposit details

### Stock
- `GET /api/stock` - List stocks
- `GET /api/stock/:ticker` - Get stock details

### Admin (Protected)
All admin endpoints require authentication with `ADMIN_TOKEN` or `ADMIN_SECRET`:

- `GET /api/admin/investors` - List all investors
- `PATCH /api/admin/investors/:id/status` - Update investor status
- `POST /api/admin/investors/:id/credit` - Credit shares to investor
- `GET /api/admin/deposits` - List all deposits
- `PATCH /api/admin/deposits/:id/status` - Update deposit status
- `GET /api/admin/deposit-addresses` - List deposit addresses
- `PUT /api/admin/deposit-addresses/:coin` - Update deposit address

**Admin Authentication**:
```bash
# Token-based
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" https://app.vercel.app/api/admin/investors

# Secret-based
curl -H "X-Admin-Secret: YOUR_ADMIN_SECRET" https://app.vercel.app/api/admin/investors
```

## 🗄️ Database

### Connection
Set `DATABASE_URL` environment variable. Supported providers:
- Vercel Postgres
- Neon
- Railway
- AWS RDS
- Any PostgreSQL-compatible database

### Migrations
```bash
# Push schema changes
pnpm --filter @workspace/db run push

# Reset database (development only)
pnpm --filter @workspace/db run reset
```

## 🛡️ Security Features

- ✅ HTTPS enforcement
- ✅ CORS protection
- ✅ Admin authentication (token + secret)
- ✅ Security headers (CSP, XSS, Clickjacking protection)
- ✅ Request logging with redacted sensitive data
- ✅ Input validation with Zod
- ✅ Environment variable isolation

## 📊 Monitoring

### Vercel Analytics
- Performance metrics
- Request counts
- Error rates
- View at: Vercel Dashboard → Project → Analytics

### Logs
```bash
# View live logs
vercel logs

# Filter by deployment
vercel logs --deployments
```

## 🚢 Deployment

### Automatic (Recommended)
1. Push to `main` branch
2. Vercel automatically deploys
3. Monitor deployment status in dashboard

### Manual
```bash
# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

## 🧪 Testing

```bash
# Type checking
pnpm run typecheck

# Build verification
pnpm run build

# Local testing
pnpm --filter @workspace/api-server run dev
# Test endpoints at http://localhost:5000/api/*
```

## 📝 Environment Variables

Required variables (set in Vercel dashboard or `.env.local`):

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Server
PORT=5000
NODE_ENV=production

# Admin
ADMIN_TOKEN=your-secure-token
ADMIN_SECRET=your-secure-secret

# Vercel
VERCEL_URL=your-app.vercel.app
```

See [.env.example](./.env.example) for all available variables.

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version: `node --version` (requires 24+)
- Verify dependencies: `pnpm install --frozen-lockfile`
- Check build logs: `vercel logs --tail`

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Test locally: `psql $DATABASE_URL`
- Check IP whitelist (if applicable)

### Admin Features Not Working
- Verify `ADMIN_TOKEN` and `ADMIN_SECRET` are set
- Check authorization headers in requests
- Review request logs for errors

### Performance Issues
- Monitor Vercel Analytics
- Check database query performance
- Review function execution time

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md#troubleshooting) for more.

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test locally
3. Push branch: `git push origin feature/name`
4. Create Pull Request
5. Wait for review and merge

## 📄 License

MIT

## 🔗 Links

- **Repository**: https://github.com/CorpX430/IPOLIVE
- **Vercel**: https://vercel.com
- **PostgreSQL**: https://www.postgresql.org
- **Express.js**: https://expressjs.com
- **Drizzle ORM**: https://orm.drizzle.team

## 📞 Support

For issues and questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md)
- Review [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- Open GitHub Issues
- Check Vercel documentation

---

**Last Updated**: 2026-07-10  
**Status**: ✅ Live on Vercel  
**Version**: 1.0.0-vercel
