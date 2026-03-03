import { NextRequest, NextResponse } from 'next/server';
import { getPhotographers, setPhotographers } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function PUT(request: NextRequest) {
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'ids must be an array' }, { status: 400 });
    }

    const photographers = await getPhotographers();
    const reordered = ids
      .map(id => photographers.find(p => p.id === id))
      .filter(Boolean) as typeof photographers;

    await setPhotographers(reordered);
    revalidatePath('/production');

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to reorder photographers';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
