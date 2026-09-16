import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = 'clausewise_auth';
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/contracts',
  '/upload',
  '/review',
  '/playbooks',
  '/calendar',
  '/approvals',
  '/settings',
  '/users',
  '/versions',
  '/document',
];
const AUTH_PAGES = ['/login', '/signup'];

function hasAuthCookie(request: NextRequest): boolean {
  const cookie = request.headers.get('cookie') || '';
  return cookie.split(';').some(c => c.trim().startsWith(`${AUTH_COOKIE}=`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPath = PROTECTED_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`));
  const isAuthPage = AUTH_PAGES.includes(pathname) || pathname === '/';

  if (protectedPath && !hasAuthCookie(request)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && hasAuthCookie(request)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};