#!/bin/bash

# Build script optimized for Vercel
# This script is called by Vercel's build process

set -e

echo "📦 Building IPOLIVE for Vercel..."

# Install pnpm globally if not present
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install --frozen-lockfile

# Type checking
echo "🔍 Type checking..."
pnpm run typecheck

# Build all packages
echo "🔨 Building packages..."
pnpm run build

# Verify build output
if [ -d "artifacts/api-server/dist" ]; then
    echo "✅ Build successful!"
    echo "   Output directory: artifacts/api-server/dist"
else
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

echo "🎉 Ready for deployment!"
