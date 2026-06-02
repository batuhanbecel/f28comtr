import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken } from '@/lib/authToken';
import {
  ADMIN_COOKIE,
  LANG_COOKIE,
  PREFS_COOKIE_MAX_AGE,
  THEME_COOKIE,
  langFromAcceptLanguage,
} from '@/lib/prefs';

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const langParam = searchParams.get('lang');
  const langFromQuery = langParam === 'en' || langParam === 'tr' ? langParam : null;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!token || !(await verifyAdminToken(token))) {
      const login = new URL('/admin/login', request.url);
      const res = NextResponse.redirect(login);
      res.cookies.delete(ADMIN_COOKIE);
      return res;
    }
  }

  let response: NextResponse;

  if (langFromQuery) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete('lang');
    response = NextResponse.redirect(clean);
    response.cookies.set(LANG_COOKIE, langFromQuery, {
      path: '/',
      maxAge: PREFS_COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
  } else {
    response = NextResponse.next();
    if (!request.cookies.get(LANG_COOKIE)) {
      const lang = langFromAcceptLanguage(request.headers.get('accept-language'));
      response.cookies.set(LANG_COOKIE, lang, {
        path: '/',
        maxAge: PREFS_COOKIE_MAX_AGE,
        sameSite: 'lax',
      });
    }
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
