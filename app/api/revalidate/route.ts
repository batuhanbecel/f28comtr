import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

/**
 * Sanity webhook → Next.js ISR revalidation.
 *
 * Sanity dashboard'da kurulur (Settings → API → Webhooks):
 *   URL:     https://<site>/api/revalidate
 *   Secret:  SANITY_REVALIDATE_SECRET ile aynı değer
 *   Trigger: Create / Update / Delete
 *   Filter:  _type in ["photographer", "aiPoweredCollection", "aiPortfolioItem",
 *                       "siteAssets", "homeV2PageCopy", "productionPageCopy",
 *                       "aiPoweredPageCopy", "contactPageCopy", "seoOverride"]
 *   Projection: { _type, "slug": slug.current, "pageKey": pageKey }
 */

interface WebhookPayload {
  _type?: string;
  slug?: string;
  pageKey?: string;
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: 'SANITY_REVALIDATE_SECRET is not configured' },
      { status: 500 },
    );
  }

  let body: WebhookPayload;
  let isValid: boolean;
  try {
    const parsed = await parseBody<WebhookPayload>(req, secret);
    if (!parsed.isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }
    body = parsed.body ?? {};
    isValid = true;
  } catch (e) {
    return NextResponse.json(
      { message: `Parse error: ${(e as Error).message}` },
      { status: 400 },
    );
  }

  if (!isValid || !body._type) {
    return NextResponse.json({ message: 'Missing _type in payload' }, { status: 400 });
  }

  const paths = resolvePathsForType(body);
  for (const p of paths) {
    // Dynamic routes (e.g. "/ai-powered/works/[slug]") must be revalidated with
    // the 'page' type so Next matches every generated page under that segment.
    if (p.includes('[')) revalidatePath(p, 'page');
    else revalidatePath(p);
  }

  return NextResponse.json({
    revalidated: true,
    type: body._type,
    paths,
    now: Date.now(),
  });
}

function resolvePathsForType(body: WebhookPayload): string[] {
  const t = body._type;
  switch (t) {
    case 'photographer':
      return body.slug
        ? [`/${body.slug}`, '/portfolios', '/about', '/']
        : ['/portfolios', '/about', '/'];

    case 'aiPoweredCollection':
      // The collection holds every work, so also refresh all detail pages
      // (new slugs + edits to existing ones) via the dynamic route layout.
      return ['/ai-powered', '/ai-powered/works/[slug]', '/'];

    case 'aiPortfolioItem':
      return ['/ai-powered/portfolio'];

    case 'siteAssets':
      return ['/', '/about', '/production'];

    case 'homeV2PageCopy':
    case 'homeSelectedWorks':
      return ['/home-v2', '/'];

    case 'productionPageCopy':
      return ['/production'];

    case 'aiPoweredPageCopy':
      return ['/ai-powered', '/ai-powered/portfolio'];

    case 'contactPageCopy':
      return ['/contact'];

    case 'seoOverride':
      return seoPagePaths(body.pageKey);

    default:
      return [];
  }
}

function seoPagePaths(pageKey: string | undefined): string[] {
  switch (pageKey) {
    case 'home':
      return ['/'];
    case 'production':
      return ['/production'];
    case 'aiPowered':
      return ['/ai-powered'];
    case 'aiPoweredPortfolio':
      return ['/ai-powered/portfolio'];
    case 'portfolios':
      return ['/portfolios'];
    case 'about':
      return ['/about'];
    case 'contact':
      return ['/contact'];
    default:
      return [];
  }
}
