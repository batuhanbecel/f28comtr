import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { getRedis } from '@/lib/redis';

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ images: [], count: 0 });

  const images = await redis.get('site:preview') || [];
  const imagesArray = Array.isArray(images) ? images : [];
  return NextResponse.json({ images: imagesArray, count: imagesArray.length });
}

export async function PUT(request: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: 'Redis not configured' }, { status: 500 });

  const body = await request.json();
  const images = Array.isArray(body) ? body : body.images;
  if (!Array.isArray(images)) return NextResponse.json({ error: 'images must be an array' }, { status: 400 });

  await redis.set('site:preview', JSON.stringify(images));
  return NextResponse.json({ success: true, count: images.length });
}
