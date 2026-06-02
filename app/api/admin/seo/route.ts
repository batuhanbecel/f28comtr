import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import type { SeoPageKey } from '@/lib/seo';
import {
  getDefaultSeo,
  getPageSeo,
  getSiteSeoStore,
  resetSeo,
  saveSeoPatch,
} from '@/lib/siteSeo';
import type { Lang } from '@/lib/translations';

const SEO_PAGE_PATHS: Record<SeoPageKey, string> = {
  home: '/',
  production: '/production',
  aiPowered: '/ai-powered',
  aiPoweredPortfolio: '/ai-powered/portfolio',
  portfolios: '/portfolios',
  about: '/about',
  contact: '/contact',
};

const SEO_PAGES: SeoPageKey[] = [
  'home',
  'production',
  'aiPowered',
  'aiPoweredPortfolio',
  'portfolios',
  'about',
  'contact',
];

function parsePage(value: unknown): SeoPageKey | null {
  if (typeof value === 'string' && SEO_PAGES.includes(value as SeoPageKey)) {
    return value as SeoPageKey;
  }
  return null;
}

function parseLang(value: unknown): Lang | null {
  if (value === 'en' || value === 'tr') return value;
  return null;
}

export async function GET(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parsePage(searchParams.get('page'));
  const lang = parseLang(searchParams.get('lang'));

  if (page && lang) {
    const [seo, defaults, store] = await Promise.all([
      getPageSeo(page, lang),
      Promise.resolve(getDefaultSeo(lang, page)),
      getSiteSeoStore(),
    ]);
    return NextResponse.json({
      seo,
      defaults,
      storePatch: store[page]?.[lang] ?? null,
    });
  }

  return NextResponse.json({ pages: SEO_PAGES });
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const page = parsePage(body.page);
    const lang = parseLang(body.lang);

    if (!page || !lang) {
      return NextResponse.json({ error: 'Invalid page or lang' }, { status: 400 });
    }

    if (!body.seo || typeof body.seo !== 'object') {
      return NextResponse.json({ error: 'seo must be an object' }, { status: 400 });
    }

    const seo = await saveSeoPatch(page, lang, body.seo);
    revalidatePath(SEO_PAGE_PATHS[page]);

    return NextResponse.json({ success: true, seo });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to save SEO';
    return NextResponse.json({ error: message }, { status: 500 });
  }
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

  try {
    await resetSeo(page, lang);
    revalidatePath(SEO_PAGE_PATHS[page]);
    const seo = await getPageSeo(page, lang);
    return NextResponse.json({ success: true, seo });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to reset SEO';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
