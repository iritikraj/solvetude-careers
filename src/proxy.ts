
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Static protected routes
const PROTECTED_ROUTES = new Set([
  '/recruiter/dashboard',
  '/recruiter/create-job',
]);

// Check dynamic protected routes

function isProtectedRoute(path: string): boolean {
  // Static protected routes
  if (PROTECTED_ROUTES.has(path)) {
    return true;
  }

  // Dynamic job detail route: /seo-analyst-vl1c
  if (/^\/[^/]+\/?$/.test(path) && path !== '/careers') {
    return true;
  }

  // Dynamic career edit route: /careers/seo-analyst-vl1c/edit
  if (/^\/careers\/[^/]+\/edit\/?$/.test(path)) {
    return true;
  }

  return false;
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const originalToken = request.cookies.get('solvetude_session')?.value;

  let isValidToken = false;

  // 1. Validate token
  if (originalToken) {
    try {
      const payloadBase64 = originalToken.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

      if (payload.exp && Date.now() < payload.exp * 1000) {
        isValidToken = true;
      }
    } catch {
      isValidToken = false;
    }
  }

  // 2. Remove invalid or expired token
  if (originalToken && !isValidToken) {
    const response = NextResponse.redirect(
      new URL('/auth/login', request.url)
    );

    response.cookies.delete('solvetude_session');
    return response;
  }

  // 3. Check protected routes
  const requiresAuth = isProtectedRoute(path);

  if (requiresAuth && !isValidToken) {
    const loginUrl = new URL('/auth/login', request.url);

    loginUrl.searchParams.set(
      'next',
      request.nextUrl.pathname + request.nextUrl.search
    );

    return NextResponse.redirect(loginUrl);
  }

  // 4. Prevent authenticated users from accessing login
  if (path === '/auth/login' && isValidToken) {
    const nextPath = request.nextUrl.searchParams.get('next') || '/';

    // Prevent external redirects
    const safePath = nextPath.startsWith('/') && !nextPath.startsWith('//')
      ? nextPath
      : '/';

    return NextResponse.redirect(new URL(safePath, request.url));
  }

  return NextResponse.next();
}

// Ignore static files and API routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)',
  ],
};
