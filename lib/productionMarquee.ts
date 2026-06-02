import { getPhotographers, getPhotographerImages } from './db';
import type { ProductionMarqueeItem } from './productionMarquee.shared';

export type { ProductionMarqueeItem } from './productionMarquee.shared';

const DEFAULT_LIMIT = 100;

/** Round-robin across photographer portfolios for a diverse reel (server-only). */
export async function getProductionMarqueeItems(
  limit = DEFAULT_LIMIT,
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
