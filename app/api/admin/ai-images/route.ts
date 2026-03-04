import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';
import { getAIImages, setAIImages } from '@/lib/db';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const images = await getAIImages();
  return NextResponse.json({ images, count: images.length });
}

export async function PUT(request: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { images } = await request.json();
  if (!Array.isArray(images)) return NextResponse.json({ error: 'images must be an array' }, { status: 400 });
  await setAIImages(images);
  return NextResponse.json({ success: true, count: images.length });
}
