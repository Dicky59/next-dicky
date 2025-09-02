import { NextResponse } from 'next/server';

// This middleware runs before any request is processed
export function middleware(request) {
  // Only apply to the protected route
  if (request.nextUrl.pathname.startsWith('/protected')) {
    // For demo purposes, we'll allow access
    // In a real application, you would:
    // 1. Check for valid session tokens
    // 2. Validate API keys in headers
    // 3. Redirect to login if not authenticated
    
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
