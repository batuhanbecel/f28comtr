import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'ADMIN_PASSWORD is not configured on the server.' }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
