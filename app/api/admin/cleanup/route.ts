import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { getPhotographers, getPhotographerImages, setPhotographerImages, getAiPoweredImages, setAiPoweredImages, getAiPoweredPortfolio, setAiPoweredPortfolio } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.f28.com.tr';

async function checkUrl(url: string): Promise<boolean> {
  try {
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    const res = await fetch(fullUrl, { method: 'HEAD', redirect: 'follow' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const photographers = await getPhotographers();
  const results: { photographer: string; removed: string[] }[] = [];
  let totalRemoved = 0;

  for (const p of photographers) {
    const images = await getPhotographerImages(p.id);
    const valid: string[] = [];
    const removed: string[] = [];

    for (const img of images) {
      if (await checkUrl(img)) {
        valid.push(img);
      } else {
        removed.push(img);
        totalRemoved++;
      }
    }

    if (removed.length > 0) {
      await setPhotographerImages(p.id, valid);
      results.push({ photographer: p.fullName, removed });
    }
  }

  const aiPoweredImages = await getAiPoweredImages();
  const aiValid: string[] = [];
  const aiRemoved: string[] = [];

  for (const img of aiPoweredImages) {
    if (await checkUrl(img)) {
      aiValid.push(img);
    } else {
      aiRemoved.push(img);
      totalRemoved++;
    }
  }

  if (aiRemoved.length > 0) {
    await setAiPoweredImages(aiValid);
    results.push({ photographer: 'AI-Powered', removed: aiRemoved });
  }

  const aiPortfolio = await getAiPoweredPortfolio();
  const portfolioValid: typeof aiPortfolio.items = [];
  const portfolioRemoved: string[] = [];

  for (const item of aiPortfolio.items) {
    if (await checkUrl(item.src)) {
      portfolioValid.push(item);
    } else {
      portfolioRemoved.push(item.src);
      totalRemoved++;
    }
  }

  if (portfolioRemoved.length > 0) {
    await setAiPoweredPortfolio({ tags: aiPortfolio.tags, items: portfolioValid });
    results.push({ photographer: 'AI-Powered Portfolio', removed: portfolioRemoved });
  }

  return NextResponse.json({
    totalRemoved,
    details: results,
    message: totalRemoved > 0
      ? `Removed ${totalRemoved} broken image reference(s).`
      : 'All images are valid. No cleanup needed.',
  });
}
