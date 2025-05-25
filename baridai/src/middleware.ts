import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Define which paths are protected (require authentication)
  const isProtectedPath = path === '/dashboard' || 
    path.startsWith('/dashboard/') || 
    path.startsWith('/api/protected/');

  // Define which paths are auth paths (login/signup pages)
  const isAuthPath = path === '/login' || path === '/signup';

  // Get the token from the cookies
  const token = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!token;

  // If trying to access a protected path without being authenticated
  if (isProtectedPath && !isAuthenticated) {
    // Redirect to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access an auth path while already authenticated
  if (isAuthPath && isAuthenticated) {
    // Redirect to the dashboard
    return NextResponse.redirect(new URL('/app', request.url));
  }

  // Only allow this username
  const ALLOWED_USERNAMES = ['upthouse'];

  // Match /username/... (not /auth or /website)
  const match = path.match(/^\/([^/]+)\//);
  if (match) {
    const username = match[1];
    if (!ALLOWED_USERNAMES.includes(username)) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}

// Specify which paths this middleware should run for
export const config = {
  matcher: [
    // Protected routes
    '/app/:path*',
    '/api/protected/:path*',
    // Auth routes
    '/login',
    '/signup',
    '/:username((?!auth|website|_next|favicon.ico|api).*)*',
  ],
};
