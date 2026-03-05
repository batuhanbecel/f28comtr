import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';
import { seedFromStatic, isRedisConfigured } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function POST() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: 'Redis is not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your environment variables.' },
      { status: 503 }
    );
  }

  try {
    const result = await seedFromStatic();
    revalidatePath('/production');
    revalidatePath('/');
    revalidatePath('/ai-based');
    revalidatePath('/portfolios');
    return NextResponse.json({ success: true, ...result });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to seed data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
