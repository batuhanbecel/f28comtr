import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_NAME, verifyAdminToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and login API through
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/login')) {
    return NextResponse.next();
  }

  // Protect all /admin and /api/admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
