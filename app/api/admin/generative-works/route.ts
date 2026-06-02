import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import {
  getGenerativeWorks,
  setGenerativeWorks,
  deriveBrandKey,
  type GenerativeWork,
} from '@/lib/generativeWorks';

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const works = await getGenerativeWorks();
  return NextResponse.json({ works, count: works.length });
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const works = Array.isArray(body) ? body : body.works;
  if (!Array.isArray(works)) return NextResponse.json({ error: 'works must be an array' }, { status: 400 });

  const normalized: GenerativeWork[] = works.map((w, i: number) => {
    const brand = String(w.brand || 'Other').trim() || 'Other';
    const category = ['visual', 'video', 'hybrid'].includes(w.category) ? w.category : 'visual';
    return {
      id: String(w.id || `work-${Date.now()}-${i}`),
      brand,
      brandKey: w.brandKey ? String(w.brandKey) : deriveBrandKey(brand),
      title: String(w.title || ''),
      description: String(w.description || ''),
      category,
      imageSrc: String(w.imageSrc || ''),
      imageAlt: String(w.imageAlt || `${brand} generative workflow image`),
      year: Number(w.year) || new Date().getFullYear(),
    };
  });

  await setGenerativeWorks(normalized);
  return NextResponse.json({ success: true, count: normalized.length });
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const current = await getGenerativeWorks();
  const updated = current.filter((w) => w.id !== id);
  await setGenerativeWorks(updated);
  return NextResponse.json({ success: true, count: updated.length });
}
