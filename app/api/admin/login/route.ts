import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth';
import { getRedis } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

    const redis = getRedis();
    if (redis) {
      const key = `ratelimit:login:${ip}`;
      const attempts = await redis.incr(key);
      if (attempts === 1) await redis.expire(key, 60);
      if (attempts > 10) {
        return NextResponse.json(
          { error: 'Too many login attempts. Try again in a minute.' },
          { status: 429 }
        );
      }
    }

    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    if (redis) {
      await redis.del(`ratelimit:login:${ip}`);
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
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
