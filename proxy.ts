import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  LANG_COOKIE,
  PREFS_COOKIE_MAX_AGE,
  THEME_COOKIE,
  langFromAcceptLanguage,
} from '@/lib/prefs';

const TRAILING_BACKSLASH = /(?:%5C|\\)+$/i;

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // A link with a stray trailing backslash ("/ai-powered/portfolio\") arrives
  // as "%5C" and crashed with a 500 on Vercel — send it to the page meant.
  if (TRAILING_BACKSLASH.test(pathname)) {
    const clean = request.nextUrl.clone();
    clean.pathname = pathname.replace(TRAILING_BACKSLASH, '') || '/';
    return NextResponse.redirect(clean, 308);
  }

  const langParam = searchParams.get('lang');
  const langFromQuery = langParam === 'en' || langParam === 'tr' ? langParam : null;

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
