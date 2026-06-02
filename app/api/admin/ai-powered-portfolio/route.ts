import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { getAiPoweredPortfolio, setAiPoweredPortfolio } from '@/lib/db';
import type { AiPortfolioData } from '@/lib/aiPoweredPortfolio.shared';
import { revalidatePath } from 'next/cache';

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const portfolio = await getAiPoweredPortfolio();
  return NextResponse.json({
    ...portfolio,
    count: portfolio.items.length,
    images: portfolio.items.map((item) => item.src),
  });
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();

  let portfolio: AiPortfolioData;

  if (body && typeof body === 'object' && Array.isArray(body.items)) {
    portfolio = {
      tags: Array.isArray(body.tags) ? body.tags : [],
      items: body.items,
    };
  } else {
    const images = Array.isArray(body) ? body : body.images;
    if (!Array.isArray(images)) {
      return NextResponse.json({ error: 'items or images must be an array' }, { status: 400 });
    }
    const current = await getAiPoweredPortfolio();
    const bySrc = new Map(current.items.map((item) => [item.src, item]));
    portfolio = {
      tags: current.tags,
      items: images.map((src: string) => bySrc.get(src) ?? { src, tagIds: [] }),
    };
  }

  await setAiPoweredPortfolio(portfolio);
  revalidatePath('/ai-powered/portfolio');
  return NextResponse.json({ success: true, count: portfolio.items.length });
}
