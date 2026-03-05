import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';
import { getPhotographers, setPhotographers } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const photographers = await getPhotographers();
    const photographer = photographers.find(p => p.id === id);
    if (!photographer) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(photographer);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch photographer' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await request.json();
    const photographers = await getPhotographers();
    const index = photographers.findIndex(p => p.id === id);

    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    photographers[index] = { ...photographers[index], ...body, id };
    await setPhotographers(photographers);

    revalidatePath('/production');
    revalidatePath(`/${id}`);

    return NextResponse.json(photographers[index]);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to update photographer';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const photographers = await getPhotographers();
    const filtered = photographers.filter(p => p.id !== id);

    if (filtered.length === photographers.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await setPhotographers(filtered);
    revalidatePath('/production');

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to delete photographer';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
