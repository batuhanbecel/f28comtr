import { deepMerge } from '@/lib/pageCopy.shared';
import {
  getDefaultAiPoweredCopy,
  getDefaultContactCopy,
  getDefaultProductionCopy,
  mergePageCopyWithDefaults,
  normalizeLangPatch,
  pageCopyDefaultGetters,
} from '@/lib/pageCopy.defaults';
import type {
  AiPoweredPageCopy,
  ContactPageCopy,
  PageCopyByKey,
  PageCopyKey,
  ProductionPageCopy,
  SiteCopyStore,
} from '@/lib/pageCopy.types';
import { getRedis } from '@/lib/redis';
import type { Lang } from '@/lib/translations';

const REDIS_KEY = 'site:copy';

export {
  getDefaultAiPoweredCopy,
  getDefaultContactCopy,
  getDefaultProductionCopy,
  mergePageCopyWithDefaults,
};

const defaultGetters = pageCopyDefaultGetters;

export async function getSiteCopyStore(): Promise<SiteCopyStore> {
  const redis = getRedis();
  if (!redis) return {};

  try {
    const raw = await redis.get(REDIS_KEY);
    if (raw == null) return {};

    let stored: unknown = raw;
    if (typeof raw === 'string') {
      try {
        stored = JSON.parse(raw) as unknown;
      } catch {
        return {};
      }
    }

    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
    return stored as SiteCopyStore;
  } catch {
    return {};
  }
}

/** Re-apply defaults so partial Redis overrides never drop nested keys (e.g. services.items). */
function withDefaults<K extends PageCopyKey>(
  page: K,
  lang: Lang,
  copy: PageCopyByKey[K],
): PageCopyByKey[K] {
  return mergePageCopyWithDefaults(page, lang, copy);
}

export async function setSiteCopyStore(store: SiteCopyStore): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error('Redis is not configured.');
  }
  await redis.set(REDIS_KEY, JSON.stringify(store));
}

export async function getPageCopy<K extends PageCopyKey>(
  page: K,
  lang: Lang,
): Promise<PageCopyByKey[K]> {
  const defaults = defaultGetters[page](lang);
  const store = await getSiteCopyStore();
  const patch = normalizeLangPatch(store[page]?.[lang]);
  const merged = deepMerge(
    defaults as Record<string, unknown>,
    patch,
  ) as PageCopyByKey[K];
  return withDefaults(page, lang, merged);
}

export async function savePageCopyPatch<K extends PageCopyKey>(
  page: K,
  lang: Lang,
  patch: Partial<PageCopyByKey[K]>,
): Promise<PageCopyByKey[K]> {
  const defaults = defaultGetters[page](lang);
  const store = await getSiteCopyStore();
  const currentPage = (store[page] ?? {}) as Partial<Record<Lang, Partial<PageCopyByKey[K]>>>;
  const storedLang = currentPage[lang] ?? {};
  const mergedLang = withDefaults(page, lang, deepMerge(
    deepMerge(defaults as Record<string, unknown>, storedLang as Record<string, unknown>),
    patch as Record<string, unknown>,
  ) as PageCopyByKey[K]);

  const nextStore = {
    ...store,
    [page]: {
      ...currentPage,
      [lang]: mergedLang,
    },
  } as SiteCopyStore;

  await setSiteCopyStore(nextStore);
  return getPageCopy(page, lang);
}

export async function resetPageCopy(page: PageCopyKey, lang: Lang): Promise<void> {
  const store = await getSiteCopyStore();
  const currentPage = store[page];
  if (!currentPage?.[lang]) return;

  const nextLangs = { ...currentPage };
  delete nextLangs[lang];

  const nextStore: SiteCopyStore = { ...store };

  if (Object.keys(nextLangs).length === 0) {
    delete nextStore[page];
  } else if (page === 'production') {
    nextStore.production = nextLangs as NonNullable<SiteCopyStore['production']>;
  } else if (page === 'aiPowered') {
    nextStore.aiPowered = nextLangs as NonNullable<SiteCopyStore['aiPowered']>;
  } else {
    nextStore.contact = nextLangs as NonNullable<SiteCopyStore['contact']>;
  }

  await setSiteCopyStore(nextStore);
}

/** @deprecated Use getPageSeo from @/lib/siteSeo — kept for page-copy imports */
export async function getPageSeo(page: PageCopyKey, lang: Lang) {
  const { getPageSeo: getSeo } = await import('@/lib/siteSeo');
  return getSeo(page, lang);
}

export async function getContactInfo(lang: Lang): Promise<ContactPageCopy['info']> {
  const { contactInfo: staticInfo } = await import('@/lib/data');
  const copy = await getPageCopy('contact', lang);
  return {
    email: copy.info.email || staticInfo.email,
    instagram: copy.info.instagram || staticInfo.instagram,
    linkedin: copy.info.linkedin || staticInfo.linkedin,
    address: copy.info.address || staticInfo.address,
    city: copy.info.city || staticInfo.city,
  };
}

export type { ProductionPageCopy, AiPoweredPageCopy, ContactPageCopy, PageCopyKey, SiteCopyStore };
