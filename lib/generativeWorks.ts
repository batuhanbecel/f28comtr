import { getRedis } from './redis';
import { getAIImages as getStaticAIImages } from './utils';
import { WORKS as STATIC_WORKS } from '@/app/ai-based/data/works';
import type { Work as AIWork, WorkCategory } from '@/app/ai-based/data/works';

export type { AIWork, WorkCategory };

const REDIS_KEY = 'ai:works';
const LEGACY_KEY = 'ai:images';

export function deriveBrandKey(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'other';
}

function fromUrl(src: string, i: number): AIWork {
  const id = `untagged-${i}`;
  return {
    id,
    brand: 'Other',
    brandKey: 'other',
    title: '',
    description: '',
    category: 'visual',
    imageSrc: src,
    imageAlt: 'AI generated image',
    year: new Date().getFullYear(),
  };
}

function isAIWork(v: unknown): v is AIWork {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.imageSrc === 'string' &&
    typeof o.brandKey === 'string' &&
    typeof o.category === 'string'
  );
}

export async function getAIWorks(): Promise<AIWork[]> {
  const redis = getRedis();

  if (redis) {
    try {
      const stored = await redis.get(REDIS_KEY);
      if (Array.isArray(stored) && stored.length > 0 && stored.every(isAIWork)) {
        return stored as AIWork[];
      }
    } catch {}

    try {
      const legacy = await redis.get(LEGACY_KEY);
      if (Array.isArray(legacy) && legacy.length > 0) {
        return (legacy as string[]).map((url, i) => fromUrl(url, i));
      }
    } catch {}
  }

  if (STATIC_WORKS.length > 0) return STATIC_WORKS;

  return getStaticAIImages().map((url, i) => fromUrl(url, i));
}

export async function setAIWorks(works: AIWork[]): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error('Redis is not configured.');
  const normalized = works.map((w) => ({
    ...w,
    brandKey: w.brandKey || deriveBrandKey(w.brand),
  }));
  await redis.set(REDIS_KEY, JSON.stringify(normalized));
}
