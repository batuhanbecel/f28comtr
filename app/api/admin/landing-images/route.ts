import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const redis = require('@upstash/redis').create({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
  
  const images = await redis.get('site:landing') || [];
  return NextResponse.json({ images: Array.isArray(images) ? images : [], count: images.length });
}

export async function PUT(request: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const body = await request.json();
  const images = Array.isArray(body) ? body : body.images;
  if (!Array.isArray(images)) return NextResponse.json({ error: 'images must be an array' }, { status: 400 });
  
  const redis = require('@upstash/redis').create({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
  
  await redis.set('site:landing', JSON.stringify(images));
  return NextResponse.json({ success: true, count: images.length });
}
