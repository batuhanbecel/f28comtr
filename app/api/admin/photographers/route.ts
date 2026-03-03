import { NextRequest, NextResponse } from 'next/server';
import { getPhotographers, setPhotographers } from '@/lib/db';

export async function GET() {
  try {
    const photographers = await getPhotographers();
    return NextResponse.json(photographers);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch photographers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, fullName, title, folder, preview } = body;

    if (!id || !fullName || !title) {
      return NextResponse.json({ error: 'id, fullName, and title are required' }, { status: 400 });
    }

    const photographers = await getPhotographers();

    if (photographers.find(p => p.id === id)) {
      return NextResponse.json({ error: 'A photographer with this ID already exists' }, { status: 409 });
    }

    const newPhotographer = {
      id,
      name: name || fullName.split(' ')[0],
      fullName,
      title,
      folder: folder || id,
      preview: preview || `/portfolios/previews/${id}.webp`,
    };

    photographers.push(newPhotographer);
    await setPhotographers(photographers);

    return NextResponse.json(newPhotographer, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to create photographer';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
