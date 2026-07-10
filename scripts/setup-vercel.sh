#!/bin/bash

# Vercel Setup Script for IPOLIVE
# This script helps configure Vercel deployment

set -e

echo "🚀 IPOLIVE Vercel Setup"
echo "======================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is ready"
echo ""
echo "Next steps:"
echo "1. Run: vercel login"
echo "2. Run: vercel link"
echo "3. Configure environment variables:"
echo "   - DATABASE_URL"
echo "   - ADMIN_SECRET"
echo "   - ADMIN_TOKEN"
echo "4. Run: vercel env pull .env.local"
echo "5. Run: pnpm run build"
echo "6. Run: vercel deploy --prod"
echo ""
echo "For more details, see DEPLOYMENT.md"
