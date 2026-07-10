import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Content-Security-Policy', "default-src 'self'");
  
  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const adminToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const adminSecret = request.headers.get('x-admin-secret');
    
    const validToken = process.env.ADMIN_TOKEN;
    const validSecret = process.env.ADMIN_SECRET;
    
    if (!adminToken && !adminSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing credentials' },
        { status: 401 }
      );
    }
    
    if (adminToken && adminToken !== validToken && adminSecret !== validSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid credentials' },
        { status: 401 }
      );
    }
  }
  
  return response;
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};
