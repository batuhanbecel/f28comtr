import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';
import { getPhotographers, getPhotographerImages, setPhotographerImages, getAIImages, setAIImages } from '@/lib/db';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

async function checkUrl(url: string): Promise<boolean> {
  try {
    const fullUrl = url.startsWith('http') ? url : `https://www.f28.com.tr${url}`;
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

  // Check each photographer's images
  for (const p of photographers) {
    const images = await getPhotographerImages(p.id);
    const removed: string[] = [];
    const valid: string[] = [];

    for (const img of images) {
      const ok = await checkUrl(img);
      if (ok) {
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

  // Check AI images
  const aiImages = await getAIImages();
  const aiRemoved: string[] = [];
  const aiValid: string[] = [];

  for (const img of aiImages) {
    const ok = await checkUrl(img);
    if (ok) {
      aiValid.push(img);
    } else {
      aiRemoved.push(img);
      totalRemoved++;
    }
  }

  if (aiRemoved.length > 0) {
    await setAIImages(aiValid);
    results.push({ photographer: 'AI Images', removed: aiRemoved });
  }

  return NextResponse.json({
    totalRemoved,
    details: results,
    message: totalRemoved > 0
      ? `Removed ${totalRemoved} broken image reference(s).`
      : 'All images are valid. No cleanup needed.',
  });
}
