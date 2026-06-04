/**
 * Public read API for the site — single point of truth for data fetching.
 * Consumer pages and components MUST import from here.
 *
 * Faz 8: All readers go straight to Sanity. Redis is no longer in the loop.
 */

import type { Photographer } from '@/lib/data';
import { contactInfo as staticContactInfo } from '@/lib/data';
import type { AiPoweredWork } from '@/lib/aiPoweredWorks';
import { deriveBrandKey } from '@/lib/aiPoweredWorks';
import type { AiPortfolioData } from '@/lib/aiPoweredPortfolio.shared';
import type { HomeSelectedWorkStored } from '@/lib/homeSelectedWorks.shared';
import { HOME_SELECTED_WORKS_MAX } from '@/lib/homeSelectedWorks.shared';
import type { HomeSelectedWork, HomeSelectedWorkRole, HomeV2Copy } from '@/lib/homeV2.shared';
import type { ProductionMarqueeItem } from '@/lib/productionMarquee.shared';
import type {
  ContactPageCopy,
  PageCopyByKey,
  PageCopyKey,
  SeoCopy,
} from '@/lib/pageCopy.types';
import type { SeoPageKey } from '@/lib/seo';
import { mergePageCopyWithDefaults } from '@/lib/pageCopy.defaults';
import { deepMerge } from '@/lib/pageCopy.shared';
import { translations, type Lang } from '@/lib/translations';

import {
  getPhotographersFromSanity,
  getPhotographerImagesFromSanity,
} from '@/lib/sanity.photographers';
import {
  getAiPoweredWorksFromSanity,
  getAiPoweredPortfolioFromSanity,
  getAiPoweredPortfolioImagesFromSanity,
  getAiPoweredImagesFromSanity,
} from '@/lib/sanity.aiPowered';
import {
  getLandingImagesFromSanity,
  getLogosFromSanity,
} from '@/lib/sanity.siteAssets';
import { getHomeSelectedWorksFromSanity } from '@/lib/sanity.homeSelected';
import { getHomeV2CopyPatchFromSanity } from '@/lib/sanity.homeV2';
import {
  getPageCopyPatchFromSanity,
  getSeoOverrideFromSanity,
} from '@/lib/sanity.pageCopy';

const PAGE_COPY_KEYS = new Set<PageCopyKey>(['production', 'aiPowered', 'contact']);
const DEFAULT_MARQUEE_LIMIT = 100;

// ── Photographers ───────────────────────────────────────────────────────────

export async function getPhotographers(): Promise<Photographer[]> {
  return getPhotographersFromSanity();
}

export async function getPhotographerImages(photographerId: string): Promise<string[]> {
  return getPhotographerImagesFromSanity(photographerId);
}

// ── AI Powered ──────────────────────────────────────────────────────────────

export async function getAiPoweredWorks(): Promise<AiPoweredWork[]> {
  const works = await getAiPoweredWorksFromSanity();
  return works.map((w, i) => ({
    ...w,
    slug:
      typeof w.slug === 'string' && w.slug.length > 0 ? w.slug : w.id || `work-${i}`,
    // brandKey is editor-input on Sanity but used as the filter key. Derive
    // from brand when missing so the filter never silently breaks.
    brandKey:
      typeof w.brandKey === 'string' && w.brandKey.length > 0
        ? w.brandKey
        : deriveBrandKey(w.brand || 'other'),
  }));
}

export async function getAiPoweredImages(): Promise<string[]> {
  return getAiPoweredImagesFromSanity();
}

export async function getAiPoweredPortfolio(): Promise<AiPortfolioData> {
  return getAiPoweredPortfolioFromSanity();
}

export async function getAiPoweredPortfolioImages(): Promise<string[]> {
  return getAiPoweredPortfolioImagesFromSanity();
}

// ── Site Assets (landing + logos) ───────────────────────────────────────────

export async function getLandingImages(): Promise<string[]> {
  return getLandingImagesFromSanity();
}

export async function getClientLogos(): Promise<string[]> {
  return getLogosFromSanity('clients');
}

export async function getPartnerLogos(): Promise<string[]> {
  return getLogosFromSanity('partners');
}

export async function getF28Logos(): Promise<string[]> {
  return getLogosFromSanity('f28');
}

export async function getSocialLogos(): Promise<string[]> {
  return getLogosFromSanity('social');
}

// ── Home v2 copy ────────────────────────────────────────────────────────────

export async function getHomeV2Copy(lang: Lang): Promise<HomeV2Copy> {
  const defaults = translations[lang].homeV2;
  const patch = await getHomeV2CopyPatchFromSanity(lang);
  return { ...defaults, ...patch };
}

// ── Home Selected Works ─────────────────────────────────────────────────────

export async function getHomeSelectedWorks(): Promise<HomeSelectedWorkStored[]> {
  return getHomeSelectedWorksFromSanity();
}

export async function getHomeV2SelectedWorks(
  limit: number = HOME_SELECTED_WORKS_MAX,
  workTitleFallback = 'Editorial campaign',
): Promise<HomeSelectedWork[]> {
  const stored = await getHomeSelectedWorks();
  const photographers = await getPhotographers();
  const byId = new Map(photographers.map((p) => [p.id, p]));

  const resolved: HomeSelectedWork[] = [];
  for (const entry of stored.slice(0, limit)) {
    const photographer = byId.get(entry.photographerId);
    if (!photographer) continue;
    const role: HomeSelectedWorkRole =
      (photographer.title ?? 'PHOTOGRAPHER').toUpperCase() === 'RETOUCHER'
        ? 'retoucher'
        : 'photographer';
    resolved.push({
      imageSrc: entry.imageSrc,
      workTitle: entry.workTitle.trim() || workTitleFallback,
      artistName: photographer.fullName,
      role,
      href: `/${entry.photographerId}`,
    });
  }
  return resolved;
}

// ── Production Marquee ──────────────────────────────────────────────────────

export async function getProductionMarqueeItems(
  limit: number = DEFAULT_MARQUEE_LIMIT,
): Promise<ProductionMarqueeItem[]> {
  const photographers = await getPhotographers();
  const pools = await Promise.all(
    photographers.map(async (p) => {
      const images = await getPhotographerImages(p.id);
      const urls = images.length > 0 ? images : p.preview ? [p.preview] : [];
      return { photographer: p, urls };
    }),
  );

  const merged: ProductionMarqueeItem[] = [];
  const seen = new Set<string>();
  let round = 0;

  while (merged.length < limit) {
    let addedThisRound = false;
    for (const { photographer, urls } of pools) {
      const src = urls[round];
      if (!src || seen.has(src)) continue;
      seen.add(src);
      merged.push({
        src,
        photographerId: photographer.id,
        photographerName: photographer.fullName,
      });
      addedThisRound = true;
      if (merged.length >= limit) break;
    }
    if (!addedThisRound) break;
    round++;
  }
  return merged;
}

// ── Page Copy + SEO ─────────────────────────────────────────────────────────

export async function getPageCopy<K extends PageCopyKey>(
  page: K,
  lang: Lang,
): Promise<PageCopyByKey[K]> {
  const patch = await getPageCopyPatchFromSanity(page, lang);
  return mergePageCopyWithDefaults(page, lang, patch ?? undefined);
}

export async function getContactInfo(lang: Lang): Promise<ContactPageCopy['info']> {
  const copy = await getPageCopy('contact', lang);
  return {
    email: copy.info.email || staticContactInfo.email,
    instagram: copy.info.instagram || staticContactInfo.instagram,
    linkedin: copy.info.linkedin || staticContactInfo.linkedin,
    address: copy.info.address || staticContactInfo.address,
    city: copy.info.city || staticContactInfo.city,
  };
}

export async function getPageSeo(page: SeoPageKey, lang: Lang): Promise<SeoCopy> {
  const defaults = { ...translations[lang].seo[page] };
  const override = (await getSeoOverrideFromSanity(page, lang)) ?? {};
  let merged = deepMerge(
    defaults as Record<string, unknown>,
    override as Record<string, unknown>,
  ) as SeoCopy;

  if (PAGE_COPY_KEYS.has(page as PageCopyKey)) {
    const copy = await getPageCopy(page as PageCopyKey, lang);
    if (copy?.seo) {
      merged = deepMerge(
        merged as Record<string, unknown>,
        copy.seo as Record<string, unknown>,
      ) as SeoCopy;
    }
  }
  return merged;
}

// ── Type re-exports ─────────────────────────────────────────────────────────

export type { Photographer, PhotographerTag } from '@/lib/data';
export type { AiPoweredWork, AiPoweredWorkImage, WorkCategory } from '@/lib/aiPoweredWorks';
export type {
  AiPortfolioData,
  AiPortfolioItem,
  AiPortfolioTag,
} from '@/lib/aiPoweredPortfolio.shared';
export type { ProductionMarqueeItem } from '@/lib/productionMarquee.shared';
export type { HomeSelectedWork, HomeSelectedWorkRole, HomeV2Copy, HomeV2HeroSlide } from '@/lib/homeV2.shared';
export type {
  ProductionPageCopy,
  AiPoweredPageCopy,
  ContactPageCopy,
  PageCopyKey,
  SeoCopy,
} from '@/lib/pageCopy.types';
