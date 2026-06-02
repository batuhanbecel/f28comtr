import { getRedis } from './redis';
import { getAiPoweredImages as getStaticAiPoweredImages } from './utils';

export type WorkCategory = 'visual' | 'video' | 'hybrid';

export interface AiPoweredWork {
  id: string;
  brand: string;
  brandKey: string;
  title: string;
  description: string;
  category: WorkCategory;
  imageSrc: string;
  imageAlt: string;
  year: number;
  tags?: string[];
}

/** Redis keys kept for backward compatibility with existing production data. */
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

function fromUrl(src: string, i: number): AiPoweredWork {
  const id = `untagged-${i}`;
  return {
    id,
    brand: 'Other',
    brandKey: 'other',
    title: '',
    description: '',
    category: 'visual',
    imageSrc: src,
    imageAlt: 'AI-powered image',
    year: new Date().getFullYear(),
  };
}

function isAiPoweredWork(v: unknown): v is AiPoweredWork {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.imageSrc === 'string' &&
    typeof o.brandKey === 'string' &&
    typeof o.category === 'string'
  );
}

export async function getAiPoweredWorks(): Promise<AiPoweredWork[]> {
  const redis = getRedis();

  if (redis) {
    try {
      const stored = await redis.get(REDIS_KEY);
      if (Array.isArray(stored) && stored.length > 0 && stored.every(isAiPoweredWork)) {
        return stored as AiPoweredWork[];
      }
    } catch {}

    try {
      const legacy = await redis.get(LEGACY_KEY);
      if (Array.isArray(legacy) && legacy.length > 0) {
        return (legacy as string[]).map((url, i) => fromUrl(url, i));
      }
    } catch {}
  }

  return getStaticAiPoweredImages().map((url, i) => fromUrl(url, i));
}

export async function setAiPoweredWorks(works: AiPoweredWork[]): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error('Redis is not configured.');
  const normalized = works.map((w) => ({
    ...w,
    brandKey: w.brandKey || deriveBrandKey(w.brand),
  }));
  await redis.set(REDIS_KEY, JSON.stringify(normalized));
}
