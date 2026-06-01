import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ADMIN_COOKIE,
  LANG_COOKIE,
  PREFS_COOKIE_MAX_AGE,
  THEME_COOKIE,
  langFromAcceptLanguage,
} from '@/lib/prefs';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!request.cookies.get(ADMIN_COOKIE)?.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  const response = NextResponse.next();

  if (!request.cookies.get(LANG_COOKIE)) {
    const lang = langFromAcceptLanguage(request.headers.get('accept-language'));
    response.cookies.set(LANG_COOKIE, lang, {
      path: '/',
      maxAge: PREFS_COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
  }

  if (!request.cookies.get(THEME_COOKIE)) {
    response.cookies.set(THEME_COOKIE, 'dark', {
      path: '/',
      maxAge: PREFS_COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|json|js|css|woff2?)$).*)',
  ],
};
