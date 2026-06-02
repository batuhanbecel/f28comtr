import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import {
  getDefaultAiPoweredCopy,
  getDefaultContactCopy,
  getDefaultProductionCopy,
  getPageCopy,
  getSiteCopyStore,
  resetPageCopy,
  savePageCopyPatch,
} from '@/lib/pageCopy';
import type { PageCopyKey } from '@/lib/pageCopy.types';
import type { Lang } from '@/lib/translations';

export const dynamic = 'force-dynamic';

const PAGE_PATHS: Record<PageCopyKey, string> = {
  production: '/production',
  aiPowered: '/ai-powered',
  contact: '/contact',
};

function parsePage(value: unknown): PageCopyKey | null {
  if (value === 'production' || value === 'aiPowered' || value === 'contact') return value;
  return null;
}

function parseLang(value: unknown): Lang | null {
  if (value === 'en' || value === 'tr') return value;
  return null;
}

function getDefaults(page: PageCopyKey, lang: Lang) {
  if (page === 'production') return getDefaultProductionCopy(lang);
  if (page === 'aiPowered') return getDefaultAiPoweredCopy(lang);
  return getDefaultContactCopy(lang);
}

export async function GET(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parsePage(searchParams.get('page'));
  const lang = parseLang(searchParams.get('lang'));

  if (page && lang) {
    const [copy, defaults, store] = await Promise.all([
      getPageCopy(page, lang),
      Promise.resolve(getDefaults(page, lang)),
      getSiteCopyStore(),
    ]);
    return NextResponse.json({
      page,
      lang,
      copy,
      defaults,
      overrides: store[page]?.[lang] ?? null,
    });
  }

  const store = await getSiteCopyStore();
  return NextResponse.json({ store });
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as {
    page?: unknown;
    lang?: unknown;
    copy?: unknown;
  };

  const page = parsePage(body.page);
  const lang = parseLang(body.lang);

  if (!page || !lang) {
    return NextResponse.json({ error: 'Invalid page or lang' }, { status: 400 });
  }

  if (!body.copy || typeof body.copy !== 'object' || Array.isArray(body.copy)) {
    return NextResponse.json({ error: 'copy must be an object' }, { status: 400 });
  }

  const copy = await savePageCopyPatch(page, lang, body.copy as Record<string, unknown>);
  revalidatePath(PAGE_PATHS[page]);

  return NextResponse.json({ success: true, copy });
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parsePage(searchParams.get('page'));
  const lang = parseLang(searchParams.get('lang'));

  if (!page || !lang) {
    return NextResponse.json({ error: 'Invalid page or lang' }, { status: 400 });
  }

  await resetPageCopy(page, lang);
  revalidatePath(PAGE_PATHS[page]);

  const copy = await getPageCopy(page, lang);
  return NextResponse.json({ success: true, copy });
}
