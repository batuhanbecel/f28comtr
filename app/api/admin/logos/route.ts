import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';
import { Redis } from '@upstash/redis';

const LOGO_CATEGORIES = [
  { key: 'site:logos:clients', uploadKey: 'logos_clients', name: 'Clients', description: 'Client brand logos' },
  { key: 'site:logos:partners', uploadKey: 'logos_partners', name: 'Partners', description: 'Partner agency logos' },
  { key: 'site:logos:f28', uploadKey: 'logos_f28', name: 'F/28', description: 'F/28 agency logos and favicon' },
  { key: 'site:logos:social', uploadKey: 'logos_social', name: 'Social', description: 'Social media icons' },
] as const;

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
  
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
