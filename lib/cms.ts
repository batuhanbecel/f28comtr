/**
 * Public read API for the site — single point of truth for data fetching.
 * Consumer pages and components MUST import from here.
 *
 * Faz 8: All readers go straight to Sanity. Redis is no longer in the loop.
 */

import type { Photographer } from '@/lib/data';
import {
  contactInfo as staticContactInfo,
  photographers as staticPhotographers,
} from '@/lib/data';
import type { AiPoweredWork } from '@/lib/aiPoweredWorks';
import { deriveBrandKey } from '@/lib/aiPoweredWorks';
import type { AiPortfolioData } from '@/lib/aiPoweredPortfolio.shared';
import type { HomeSelectedWorkStored } from '@/lib/homeSelectedWorks.shared';
import { HOME_SELECTED_WORKS_MAX } from '@/lib/homeSelectedWorks.shared';
import type {
  HomeAiSceneImage,
  HomeSelectedWork,
  HomeSelectedWorkRole,
  HomeV2Copy,
} from '@/lib/homeV2.shared';
import { HOME_AI_SCENE_DEFAULT_COUNT } from '@/lib/homeV2.shared';
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
import {
  getHomeAiSceneImagesFromSanity,
  getHomeV2CopyPatchFromSanity,
} from '@/lib/sanity.homeV2';
import { toNameCase } from '@/lib/displayCase';
import {
  getProductionProjectsFromSanity,
  type ProductionProject,
} from '@/lib/sanity.productionProjects';
import {
  getPageCopyPatchFromSanity,
  getSeoOverrideFromSanity,
} from '@/lib/sanity.pageCopy';

const PAGE_COPY_KEYS = new Set<PageCopyKey>(['production', 'aiPowered', 'contact']);
const DEFAULT_MARQUEE_LIMIT = 100;

// ── Photographers ───────────────────────────────────────────────────────────

export async function getPhotographers(): Promise<Photographer[]> {
  try {
    const list = await getPhotographersFromSanity();
    if (list && list.length > 0) return list;
  } catch (error) {
    console.error('[CMS] getPhotographers failed, falling back to static data:', error);
  }
  return staticPhotographers.map((p) => ({ ...p, fullName: toNameCase(p.fullName) }));
}

export async function getPhotographerImages(photographerId: string): Promise<string[]> {
  try {
    return await getPhotographerImagesFromSanity(photographerId);
  } catch (error) {
    console.error(`[CMS] getPhotographerImages failed for ${photographerId}:`, error);
    return [];
  }
}

// ── AI Powered ──────────────────────────────────────────────────────────────

export async function getProductionProjects(): Promise<ProductionProject[]> {
  try {
    return await getProductionProjectsFromSanity();
  } catch (error) {
    console.error('[CMS] getProductionProjects failed:', error);
    return [];
  }
}

export async function getAiPoweredWorks(): Promise<AiPoweredWork[]> {
  try {
    const works = await getAiPoweredWorksFromSanity();
    return works.map((w, i) => ({
      ...w,
      slug:
        typeof w.slug === 'string' && w.slug.length > 0 ? w.slug : w.id || `work-${i}`,
      brandKey: deriveBrandKey(w.brand || 'other'),
    }));
  } catch (error) {
    console.error('[CMS] getAiPoweredWorks failed:', error);
    return [];
  }
}

export async function getAiPoweredImages(): Promise<string[]> {
  try {
    return await getAiPoweredImagesFromSanity();
  } catch (error) {
    console.error('[CMS] getAiPoweredImages failed:', error);
    return [];
  }
}

export async function getAiPoweredPortfolio(): Promise<AiPortfolioData> {
  try {
    return await getAiPoweredPortfolioFromSanity();
  } catch (error) {
    console.error('[CMS] getAiPoweredPortfolio failed:', error);
    return { items: [], tags: [] };
  }
}

export async function getAiPoweredPortfolioImages(): Promise<string[]> {
  try {
    return await getAiPoweredPortfolioImagesFromSanity();
  } catch (error) {
    console.error('[CMS] getAiPoweredPortfolioImages failed:', error);
    return [];
  }
}

// ── Site Assets (landing + logos) ───────────────────────────────────────────

export async function getLandingImages(): Promise<string[]> {
  try {
    return await getLandingImagesFromSanity();
  } catch (error) {
    console.error('[CMS] getLandingImages failed:', error);
    return [];
  }
}

export async function getClientLogos(): Promise<string[]> {
  try {
    return await getLogosFromSanity('clients');
  } catch (error) {
    console.error('[CMS] getClientLogos failed:', error);
    return [];
  }
}

export async function getPartnerLogos(): Promise<string[]> {
  try {
    return await getLogosFromSanity('partners');
  } catch (error) {
    console.error('[CMS] getPartnerLogos failed:', error);
    return [];
  }
}

export async function getF28Logos(): Promise<string[]> {
  try {
    return await getLogosFromSanity('f28');
  } catch (error) {
    console.error('[CMS] getF28Logos failed:', error);
    return [];
  }
}

export async function getSocialLogos(): Promise<string[]> {
  try {
    return await getLogosFromSanity('social');
  } catch (error) {
    console.error('[CMS] getSocialLogos failed:', error);
    return [];
  }
}

// ── Home v2 copy ────────────────────────────────────────────────────────────

export async function getHomeV2Copy(lang: Lang): Promise<HomeV2Copy> {
  const defaults = translations[lang].homeV2;
  try {
    const patch = await getHomeV2CopyPatchFromSanity(lang);
    return { ...defaults, ...patch };
  } catch (error) {
    console.error('[CMS] getHomeV2Copy failed, falling back to defaults:', error);
    return defaults;
  }
}

/**
 * Home AI scene: the AI Portfolio images picked in the "Anasayfa" document;
 * the first portfolio images (Studio order) when none are picked.
 */
export async function getHomeAiSceneImages(lang: Lang): Promise<HomeAiSceneImage[]> {
  try {
    const picked = await getHomeAiSceneImagesFromSanity(lang);
    if (picked.length > 0) return picked;
  } catch (error) {
    console.error('[CMS] getHomeAiSceneImages failed, falling back to portfolio:', error);
  }
  const { items, tags } = await getAiPoweredPortfolio();
  const byId = new Map(tags.map((t) => [t.id, t[lang]]));
  return items.slice(0, HOME_AI_SCENE_DEFAULT_COUNT).map((item) => ({
    src: item.src,
    tags: item.tagIds.map((id) => byId.get(id)).filter((t): t is string => !!t),
  }));
}

// ── Home Selected Works ─────────────────────────────────────────────────────

export async function getHomeSelectedWorks(): Promise<HomeSelectedWorkStored[]> {
  try {
    return await getHomeSelectedWorksFromSanity();
  } catch (error) {
    console.error('[CMS] getHomeSelectedWorks failed:', error);
    return [];
  }
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
  if (resolved.length > 0) return resolved;

  // Nothing curated yet — fall back to one image per artist so the home page
  // still opens on work. Curated picks in Studio replace this automatically.
  const pool = await getProductionMarqueeItems(limit);
  return pool.map((item) => {
    const photographer = byId.get(item.photographerId);
    const role: HomeSelectedWorkRole =
      (photographer?.title ?? 'PHOTOGRAPHER').toUpperCase() === 'RETOUCHER' ? 'retoucher' : 'photographer';
    return {
      imageSrc: item.src,
      workTitle: '',
      artistName: item.photographerName,
      role,
      href: `/${item.photographerId}`,
    };
  });
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
  try {
    const patch = await getPageCopyPatchFromSanity(page, lang);
    return mergePageCopyWithDefaults(page, lang, patch ?? undefined);
  } catch (error) {
    console.error(`[CMS] getPageCopy failed for ${page}, using defaults:`, error);
    return mergePageCopyWithDefaults(page, lang, undefined);
  }
}

export interface FooterCta {
  label: string;
  heading: string;
}

/** Site-wide contact details plus the footer call-to-action (Sanity "İletişim Sayfası"). */
export async function getSiteContact(
  lang: Lang,
): Promise<{ info: ContactPageCopy['info']; footerCta: FooterCta }> {
  const copy = await getPageCopy('contact', lang);
  return {
    info: {
      email: copy.info.email || staticContactInfo.email,
      instagram: copy.info.instagram || staticContactInfo.instagram,
      linkedin: copy.info.linkedin || staticContactInfo.linkedin,
      address: copy.info.address || staticContactInfo.address,
      city: copy.info.city || staticContactInfo.city,
    },
    footerCta: { label: copy.footerCtaLabel, heading: copy.footerCtaHeading },
  };
}

export async function getContactInfo(lang: Lang): Promise<ContactPageCopy['info']> {
  return (await getSiteContact(lang)).info;
}

export async function getPageSeo(page: SeoPageKey, lang: Lang): Promise<SeoCopy> {
  const defaults = { ...translations[lang].seo[page] };
  let override = {};
  try {
    override = (await getSeoOverrideFromSanity(page, lang)) ?? {};
  } catch (error) {
    console.error(`[CMS] getPageSeo override failed for ${page}:`, error);
  }
  let merged = deepMerge(
    defaults as Record<string, unknown>,
    override as Record<string, unknown>,
  ) as SeoCopy;

  if (PAGE_COPY_KEYS.has(page as PageCopyKey)) {
    try {
      const copy = await getPageCopy(page as PageCopyKey, lang);
      if (copy?.seo) {
        merged = deepMerge(
          merged as Record<string, unknown>,
          copy.seo as Record<string, unknown>,
        ) as SeoCopy;
      }
    } catch {}
  }
  return merged;
}

// ── Type re-exports ─────────────────────────────────────────────────────────

export type { Photographer } from '@/lib/data';
export type { ProductionProject } from '@/lib/sanity.productionProjects';
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
