import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { checkAuth } from '@/lib/auth';
import {
  getHomeSelectedWorks,
  normalizeHomeSelectedWorks,
  setHomeSelectedWorks,
  HOME_SELECTED_WORKS_MAX,
} from '@/lib/homeSelectedWorks';

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const works = await getHomeSelectedWorks();
  return NextResponse.json({ works, count: works.length, max: HOME_SELECTED_WORKS_MAX });
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const raw = Array.isArray(body) ? body : body.works;
    if (!Array.isArray(raw)) {
      return NextResponse.json({ error: 'works must be an array' }, { status: 400 });
    }

    const works = normalizeHomeSelectedWorks(raw).slice(0, HOME_SELECTED_WORKS_MAX);
    await setHomeSelectedWorks(works);
    revalidatePath('/home-v2');

    return NextResponse.json({ success: true, count: works.length });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to save selected works';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
