import { contactInfo } from '@/lib/data';
import { deepMerge } from '@/lib/pageCopy.shared';
import type { PageCopyByKey, PageCopyKey } from '@/lib/pageCopy.types';
import { translations, type Lang } from '@/lib/translations';

export function getDefaultProductionCopy(lang: Lang): PageCopyByKey['production'] {
  const base = translations[lang].production;
  return {
    ...structuredClone(base),
    statsValues: { projects: '1000+', brands: '150+', sinceYear: '2008' },
    seo: { ...translations[lang].seo.production },
  };
}

export function getDefaultAiPoweredCopy(lang: Lang): PageCopyByKey['aiPowered'] {
  const base = translations[lang].aiPowered;
  return {
    ...structuredClone(base),
    statsValues: { sinceYear: '2008' },
    seo: { ...translations[lang].seo.aiPowered },
  };
}

export function getDefaultContactCopy(lang: Lang): PageCopyByKey['contact'] {
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

export const pageCopyDefaultGetters: {
  [K in PageCopyKey]: (lang: Lang) => PageCopyByKey[K];
} = {
  production: getDefaultProductionCopy,
  aiPowered: getDefaultAiPoweredCopy,
  contact: getDefaultContactCopy,
};

/** Normalize Redis lang patch (object or JSON string). */
export function normalizeLangPatch(patch: unknown): Record<string, unknown> | undefined {
  if (patch == null) return undefined;

  let value: unknown = patch;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value) as unknown;
    } catch {
      return undefined;
    }
  }

  if (typeof value !== 'object' || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

/** Client- and server-safe merge: defaults first, then stored overrides. */
export function mergePageCopyWithDefaults<K extends PageCopyKey>(
  page: K,
  lang: Lang,
  copy?: Partial<PageCopyByKey[K]> | Record<string, unknown> | null,
): PageCopyByKey[K] {
  const defaults = pageCopyDefaultGetters[page](lang);
  return deepMerge(
    defaults as Record<string, unknown>,
    (copy ?? {}) as Record<string, unknown>,
  ) as PageCopyByKey[K];
}
