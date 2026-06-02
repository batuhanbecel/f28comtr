import { getPhotographers } from '@/lib/db';
import type { HomeSelectedWork } from '@/lib/homeV2.shared';
import type { HomeSelectedWorkRole } from '@/lib/homeV2.shared';
import {
  HOME_SELECTED_WORKS_REDIS_KEY,
  type HomeSelectedWorkStored,
} from '@/lib/homeSelectedWorks.shared';
import { getRedis } from '@/lib/redis';

export type { HomeSelectedWorkStored } from '@/lib/homeSelectedWorks.shared';
export {
  HOME_SELECTED_WORKS_MAX,
  HOME_SELECTED_WORKS_REDIS_KEY,
} from '@/lib/homeSelectedWorks.shared';

function roleFromTitle(title: string): HomeSelectedWorkRole {
  return title.toUpperCase() === 'RETOUCHER' ? 'retoucher' : 'photographer';
}

function isStoredEntry(v: unknown): v is HomeSelectedWorkStored {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.imageSrc === 'string' &&
    typeof o.workTitle === 'string' &&
    typeof o.photographerId === 'string'
  );
}

export async function getHomeSelectedWorks(): Promise<HomeSelectedWorkStored[]> {
  const redis = getRedis();
  if (!redis) return [];

  try {
    const stored = await redis.get(HOME_SELECTED_WORKS_REDIS_KEY);
    if (Array.isArray(stored) && stored.every(isStoredEntry)) {
      return stored as HomeSelectedWorkStored[];
    }
  } catch {}

  return [];
}

export async function setHomeSelectedWorks(works: HomeSelectedWorkStored[]): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error(
      'Redis is not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.',
    );
  }
  await redis.set(HOME_SELECTED_WORKS_REDIS_KEY, JSON.stringify(works));
}

export function normalizeHomeSelectedWorks(
  works: unknown[],
): HomeSelectedWorkStored[] {
  return works.map((w, i) => {
    const row = (w && typeof w === 'object' ? w : {}) as Record<string, unknown>;
    return {
      id: String(row.id || `home-work-${Date.now()}-${i}`),
      imageSrc: String(row.imageSrc || '').trim(),
      workTitle: String(row.workTitle || '').trim(),
      photographerId: String(row.photographerId || '').trim(),
    };
  }).filter((w) => w.imageSrc && w.photographerId);
}

export async function resolveHomeSelectedWorksForDisplay(
  entries: HomeSelectedWorkStored[],
  workTitleFallback: string,
): Promise<HomeSelectedWork[]> {
  const photographers = await getPhotographers();
  const byId = new Map(photographers.map((p) => [p.id, p]));

  const resolved: HomeSelectedWork[] = [];
  for (const entry of entries) {
    const photographer = byId.get(entry.photographerId);
    if (!photographer) continue;

    resolved.push({
      imageSrc: entry.imageSrc,
      workTitle: entry.workTitle.trim() || workTitleFallback,
      artistName: photographer.fullName,
      role: roleFromTitle(photographer.title ?? 'PHOTOGRAPHER'),
      href: `/${entry.photographerId}`,
    });
  }

  return resolved;
}
