import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { getRedis } from '@/lib/redis';
import { revalidatePath } from 'next/cache';

const LOGO_CATEGORIES = [
  { key: 'site:logos:clients',  uploadKey: 'logos_clients',  name: 'Clients',  description: 'Client brand logos' },
  { key: 'site:logos:partners', uploadKey: 'logos_partners', name: 'Partners', description: 'Partner agency logos' },
  { key: 'site:logos:f28',      uploadKey: 'logos_f28',      name: 'F/28',     description: 'F/28 agency logos and favicon' },
  { key: 'site:logos:social',   uploadKey: 'logos_social',   name: 'Social',   description: 'Social media icons' },
] as const;

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ categories: LOGO_CATEGORIES.map(cat => ({ key: cat.uploadKey, name: cat.name, description: cat.description, images: [] })) });

  const categories = await Promise.all(
    LOGO_CATEGORIES.map(async (cat) => {
      const images = await redis.get(cat.key) || [];
      return {
        key: cat.uploadKey,
        name: cat.name,
        description: cat.description,
        images: Array.isArray(images) ? images : [],
      };
    })
  );

  return NextResponse.json({ categories });
}

export async function PUT(request: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: 'Redis not configured' }, { status: 500 });

  const body = await request.json();
  const { categoryKey, images } = body;

  const category = LOGO_CATEGORIES.find(c => c.uploadKey === categoryKey);
  if (!category) return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  if (!Array.isArray(images)) return NextResponse.json({ error: 'images must be an array' }, { status: 400 });

  await redis.set(category.key, JSON.stringify(images));
  revalidatePath('/about');

  return NextResponse.json({ success: true, count: images.length });
}
