import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth';
import { consumeLoginAttempt, clearLoginAttempts, constantTimeEqual } from '@/lib/loginSecurity';

// Small fixed delay on failed auth to blunt timing/enumeration attacks.
const FAIL_DELAY_MS = 400;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

    const limit = await consumeLoginAttempt(ip);
    if (!limit.allowed) {
      console.warn(`[admin-login] rate limited ip=${ip} retryAfter=${limit.retryAfter ?? 0}s`);
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter ?? 60) } }
      );
    }

    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      const hint =
        process.env.NODE_ENV === 'development'
          ? 'ADMIN_PASSWORD is missing. Copy .env.example to .env.local and set a password.'
          : 'Server misconfiguration.';
      return NextResponse.json({ error: hint }, { status: 500 });
    }

    const ok = typeof password === 'string' && (await constantTimeEqual(password, adminPassword));
    if (!ok) {
      console.warn(`[admin-login] failed attempt ip=${ip} at=${new Date().toISOString()}`);
      await delay(FAIL_DELAY_MS);
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    await clearLoginAttempts(ip);

    const token = await createAdminToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
