import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';
import { getPhotographers, setPhotographers } from '@/lib/db';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function GET() {
  try {
    const photographers = await getPhotographers();
    return NextResponse.json(photographers);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch photographers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
