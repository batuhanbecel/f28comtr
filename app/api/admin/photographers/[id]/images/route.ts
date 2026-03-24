import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { getPhotographerImages, setPhotographerImages } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const images = await getPhotographerImages(id);
    return NextResponse.json({ images: images || [] });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const { images } = await request.json();

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: 'images must be an array' }, { status: 400 });
    }

    await setPhotographerImages(id, images);
    revalidatePath(`/${id}`);

    return NextResponse.json({ success: true, count: images.length });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to update image order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
