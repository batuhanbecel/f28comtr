import { contactInfo } from '@/lib/data';
import { deepMerge } from '@/lib/pageCopy.shared';
import type {
  AiPoweredPageCopy,
  ContactPageCopy,
  PageCopyByKey,
  PageCopyKey,
  ProductionPageCopy,
  SiteCopyStore,
} from '@/lib/pageCopy.types';
import { getRedis } from '@/lib/redis';
import { translations, type Lang } from '@/lib/translations';

const REDIS_KEY = 'site:copy';

export function getDefaultProductionCopy(lang: Lang): ProductionPageCopy {
  const base = translations[lang].production;
  return {
    ...structuredClone(base),
    statsValues: { projects: '1000+', brands: '150+', sinceYear: '2008' },
    seo: { ...translations[lang].seo.production },
  };
}

export function getDefaultAiPoweredCopy(lang: Lang): AiPoweredPageCopy {
  const base = translations[lang].aiPowered;
  return {
    ...structuredClone(base),
    statsValues: { sinceYear: '2008' },
    seo: { ...translations[lang].seo.aiPowered },
  };
}

export function getDefaultContactCopy(lang: Lang): ContactPageCopy {
  const base = translations[lang].contact;
  return {
    ...structuredClone(base),
    info: {
      email: contactInfo.email,
      instagram: contactInfo.instagram,
      linkedin: contactInfo.linkedin,
      address: contactInfo.address,
      city: contactInfo.city,
    },
    seo: { ...translations[lang].seo.contact },
  };
}

const defaultGetters: {
  [K in PageCopyKey]: (lang: Lang) => PageCopyByKey[K];
} = {
  production: getDefaultProductionCopy,
  aiPowered: getDefaultAiPoweredCopy,
  contact: getDefaultContactCopy,
};

export async function getSiteCopyStore(): Promise<SiteCopyStore> {
  const redis = getRedis();
  if (!redis) return {};

  try {
    const stored = await redis.get(REDIS_KEY);
    if (!stored || typeof stored !== 'object') return {};
    return stored as SiteCopyStore;
  } catch {
    return {};
  }
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
  const patch = store[page]?.[lang];
  return deepMerge(defaults as Record<string, unknown>, patch as Record<string, unknown> | undefined) as PageCopyByKey[K];
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
  const mergedLang = deepMerge(
    deepMerge(defaults as Record<string, unknown>, storedLang as Record<string, unknown>),
    patch as Record<string, unknown>,
  );

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
  const copy = await getPageCopy('contact', lang);
  return copy.info;
}

export type { ProductionPageCopy, AiPoweredPageCopy, ContactPageCopy, PageCopyKey, SiteCopyStore };
