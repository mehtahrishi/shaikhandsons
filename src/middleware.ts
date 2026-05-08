import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin Protection
  if (pathname.startsWith('/admin')) {
    // Skip protection for login page itself
    if (pathname === '/admin/login' || pathname === '/api/admin/auth') {
      return NextResponse.next();
    }

    const adminToken = request.cookies.get('admin-token')?.value;
    if (!adminToken) {
      const url = new URL('/admin/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  // 2. User Profile Protection
  if (pathname.startsWith('/profile')) {
    const authToken = request.cookies.get('auth-token')?.value;
    if (!authToken) {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  // 3. Auth Redirects (Redirect logged-in users away from auth pages)
  const authPages = ['/login', '/signup', '/verify-otp', '/forgot-password'];
  if (authPages.includes(pathname)) {
    const authToken = request.cookies.get('auth-token')?.value;
    if (authToken) {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/login',
    '/signup',
    '/verify-otp',
    '/forgot-password',
  ],
};
