import { deepMerge } from '@/lib/pageCopy.shared';
import { getPageCopy, type PageCopyKey } from '@/lib/pageCopy';
import { getRedis } from '@/lib/redis';
import type { SeoCopy } from '@/lib/pageCopy.types';
import { translations, type Lang } from '@/lib/translations';
import type { SeoPageKey } from '@/lib/seo';

const REDIS_KEY = 'site:seo';

export type SiteSeoStore = Partial<Record<SeoPageKey, Partial<Record<Lang, Partial<SeoCopy>>>>>;

const PAGE_COPY_KEYS = new Set<PageCopyKey>(['production', 'aiPowered', 'contact']);

export async function getSiteSeoStore(): Promise<SiteSeoStore> {
  const redis = getRedis();
  if (!redis) return {};

  try {
    const stored = await redis.get(REDIS_KEY);
    if (!stored || typeof stored !== 'object') return {};
    return stored as SiteSeoStore;
  } catch {
    return {};
  }
}

export async function setSiteSeoStore(store: SiteSeoStore): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error('Redis is not configured.');
  await redis.set(REDIS_KEY, JSON.stringify(store));
}

export function getDefaultSeo(lang: Lang, page: SeoPageKey): SeoCopy {
  return { ...translations[lang].seo[page] };
}

export async function getPageSeo(page: SeoPageKey, lang: Lang): Promise<SeoCopy> {
  const defaults = getDefaultSeo(lang, page);
  const store = await getSiteSeoStore();
  const storePatch = store[page]?.[lang];
  let merged = deepMerge(
    defaults as Record<string, unknown>,
    storePatch as Record<string, unknown> | undefined,
  ) as SeoCopy;

  if (PAGE_COPY_KEYS.has(page as PageCopyKey)) {
    const copy = await getPageCopy(page as PageCopyKey, lang);
    merged = deepMerge(merged as Record<string, unknown>, copy.seo as Record<string, unknown>) as SeoCopy;
  }

  return merged;
}

export async function saveSeoPatch(
  page: SeoPageKey,
  lang: Lang,
  patch: Partial<SeoCopy>,
): Promise<SeoCopy> {
  const store = await getSiteSeoStore();
  const currentPage = (store[page] ?? {}) as Partial<Record<Lang, Partial<SeoCopy>>>;
  const storedLang = currentPage[lang] ?? {};
  const mergedLang = deepMerge(
    storedLang as Record<string, unknown>,
    patch as Record<string, unknown>,
  );

  const nextStore: SiteSeoStore = {
    ...store,
    [page]: {
      ...currentPage,
      [lang]: mergedLang as Partial<SeoCopy>,
    },
  };

  await setSiteSeoStore(nextStore);
  return getPageSeo(page, lang);
}

export async function resetSeo(page: SeoPageKey, lang: Lang): Promise<void> {
  const store = await getSiteSeoStore();
  const currentPage = store[page];
  if (!currentPage?.[lang]) return;

  const nextLangs = { ...currentPage };
  delete nextLangs[lang];

  const nextStore: SiteSeoStore = { ...store };
  if (Object.keys(nextLangs).length === 0) {
    delete nextStore[page];
  } else {
    nextStore[page] = nextLangs;
  }

  await setSiteSeoStore(nextStore);
}
