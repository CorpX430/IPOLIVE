// Express.js Middleware for Vercel Deployment
// Handles security headers and admin authentication

import { Request, Response, NextFunction } from 'express';

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
}

// Admin authentication middleware
export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const adminSecret = req.headers['x-admin-secret'] as string;
  const adminToken = process.env.ADMIN_TOKEN;
  const validSecret = process.env.ADMIN_SECRET;

  const token = authHeader?.replace('Bearer ', '');

  if (!token && !adminSecret) {
    return res.status(401).json({ error: 'Unauthorized: Missing credentials' });
  }

  if (token && token === adminToken) {
    return next();
  }

  if (adminSecret && adminSecret === validSecret) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
}

// CORS middleware
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  ].filter(Boolean);

  const origin = req.headers.origin as string;

  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Secret');
  res.setHeader('Access-Control-Max-Age', '3600');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
}
