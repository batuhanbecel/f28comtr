import { NextResponse } from 'next/server';
import { seedFromStatic, isRedisConfigured } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST() {
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
    return NextResponse.json({ success: true, ...result });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to seed data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
