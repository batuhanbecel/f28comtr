import { getRedis } from './redis';
import { getGenerativeWorkflowImages as getStaticGenerativeWorkflowImages } from './utils';
import { WORKS as STATIC_WORKS } from '@/app/generative-workflow/data/works';
import type {
  GenerativeWork,
  WorkCategory,
} from '@/app/generative-workflow/data/works';

export type { GenerativeWork, WorkCategory };

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

function fromUrl(src: string, i: number): GenerativeWork {
  const id = `untagged-${i}`;
  return {
    id,
    brand: 'Other',
    brandKey: 'other',
    title: '',
    description: '',
    category: 'visual',
    imageSrc: src,
    imageAlt: 'Generative workflow image',
    year: new Date().getFullYear(),
  };
}

function isGenerativeWork(v: unknown): v is GenerativeWork {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.imageSrc === 'string' &&
    typeof o.brandKey === 'string' &&
    typeof o.category === 'string'
  );
}

export async function getGenerativeWorks(): Promise<GenerativeWork[]> {
  const redis = getRedis();

  if (redis) {
    try {
      const stored = await redis.get(REDIS_KEY);
      if (Array.isArray(stored) && stored.length > 0 && stored.every(isGenerativeWork)) {
        return stored as GenerativeWork[];
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

  return getStaticGenerativeWorkflowImages().map((url, i) => fromUrl(url, i));
}

export async function setGenerativeWorks(works: GenerativeWork[]): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error('Redis is not configured.');
  const normalized = works.map((w) => ({
    ...w,
    brandKey: w.brandKey || deriveBrandKey(w.brand),
  }));
  await redis.set(REDIS_KEY, JSON.stringify(normalized));
}
