import { getRedis } from './redis';
import { getAiPoweredPortfolioImages as getStaticPortfolioUrls } from './utils';
import {
  deriveTagId,
  isPortfolioItem,
  isPortfolioTag,
  type AiPortfolioData,
  type AiPortfolioItem,
} from './aiPoweredPortfolio.shared';

export type { AiPortfolioData, AiPortfolioItem, AiPortfolioTag } from './aiPoweredPortfolio.shared';
export { deriveTagId, tagLabel } from './aiPoweredPortfolio.shared';

const REDIS_KEY = 'ai:portfolio';

function fromUrlList(urls: string[]): AiPortfolioData {
  return {
    tags: [],
    items: urls.map((src) => ({ src, tagIds: [] })),
  };
}

function normalizeStored(raw: unknown): AiPortfolioData | null {
  if (!raw) return null;

  if (Array.isArray(raw)) {
    if (raw.length === 0) return { tags: [], items: [] };
    if (typeof raw[0] === 'string') return fromUrlList(raw as string[]);
    if (isPortfolioItem(raw[0])) {
      return { tags: [], items: raw as AiPortfolioItem[] };
    }
    return null;
  }

  if (typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    const tags = Array.isArray(o.tags) ? o.tags.filter(isPortfolioTag) : [];
    const items = Array.isArray(o.items) ? o.items.filter(isPortfolioItem) : [];
    if (tags.length > 0 || items.length > 0 || ('tags' in o && 'items' in o)) {
      return { tags, items };
    }
  }

  return null;
}

export async function getAiPoweredPortfolio(): Promise<AiPortfolioData> {
  const redis = getRedis();

  if (redis) {
    try {
      const stored = await redis.get(REDIS_KEY);
      const normalized = normalizeStored(stored);
      if (normalized) return normalized;
    } catch {}
  }

  return fromUrlList(getStaticPortfolioUrls());
}

export async function setAiPoweredPortfolio(data: AiPortfolioData): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error('Redis is not configured.');

  const tags = data.tags.map((tag) => ({
    ...tag,
    id: tag.id || deriveTagId(tag.en),
  }));
  const tagIds = new Set(tags.map((t) => t.id));
  const items = data.items.map((item) => ({
    src: item.src,
    tagIds: item.tagIds.filter((id) => tagIds.has(id)),
  }));

  await redis.set(REDIS_KEY, JSON.stringify({ tags, items }));
}

export async function getAiPoweredPortfolioImages(): Promise<string[]> {
  const { items } = await getAiPoweredPortfolio();
  return items.map((item) => item.src);
}
