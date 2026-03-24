import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { getAIImages, setAIImages } from '@/lib/db';

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const images = await getAIImages();
  return NextResponse.json({ images, count: images.length });
}

export async function PUT(request: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const images = Array.isArray(body) ? body : body.images;
  if (!Array.isArray(images)) return NextResponse.json({ error: 'images must be an array' }, { status: 400 });
  await setAIImages(images);
  return NextResponse.json({ success: true, count: images.length });
}

export async function DELETE(request: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { image } = await request.json();
  if (!image) return NextResponse.json({ error: 'image path required' }, { status: 400 });
  const updated = (await getAIImages()).filter(img => img !== image);
  await setAIImages(updated);
  return NextResponse.json({ success: true, count: updated.length });
}
