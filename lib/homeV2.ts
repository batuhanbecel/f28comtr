import { getPhotographers } from '@/lib/db';
import type { HomeSelectedWork, HomeSelectedWorkRole } from '@/lib/homeV2.shared';
import type { ProductionMarqueeItem } from '@/lib/productionMarquee.shared';
import { getProductionMarqueeItems } from '@/lib/productionMarquee';

function roleFromTitle(title: string): HomeSelectedWorkRole {
  return title.toUpperCase() === 'RETOUCHER' ? 'retoucher' : 'photographer';
}

function workTitleFromSrc(src: string, fallback: string): string {
  const base = src.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
  const cleaned = base
    .replace(/[-_]+/g, ' ')
    .replace(/\d+/g, '')
    .trim();
  if (!cleaned || cleaned.length < 2) return fallback;
  return cleaned
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/** First N marquee images mapped to artists — future: site:home:selected in Redis. */
export async function getHomeV2SelectedWorks(
  limit = 6,
  workTitleFallback = 'Editorial campaign',
): Promise<HomeSelectedWork[]> {
  const [marqueeItems, photographers] = await Promise.all([
    getProductionMarqueeItems(Math.max(limit * 2, 12)),
    getPhotographers(),
  ]);

  const byId = new Map(photographers.map((p) => [p.id, p]));
  const works: HomeSelectedWork[] = [];

  for (const item of marqueeItems) {
    if (works.length >= limit) break;
    if (works.some((w) => w.imageSrc === item.src)) continue;

    const photographer = byId.get(item.photographerId);
    const role = roleFromTitle(photographer?.title ?? 'PHOTOGRAPHER');

    works.push({
      imageSrc: item.src,
      workTitle: workTitleFromSrc(item.src, workTitleFallback),
      artistName: item.photographerName,
      role,
      href: `/${item.photographerId}`,
    });
  }

  return works;
}

export function buildHomeV2SelectedWorksFromMarquee(
  items: ProductionMarqueeItem[],
  photographerTitles: Map<string, string>,
  limit: number,
  workTitleFallback: string,
): HomeSelectedWork[] {
  const works: HomeSelectedWork[] = [];

  for (const item of items) {
    if (works.length >= limit) break;
    if (works.some((w) => w.imageSrc === item.src)) continue;

    const title = photographerTitles.get(item.photographerId) ?? 'PHOTOGRAPHER';
    works.push({
      imageSrc: item.src,
      workTitle: workTitleFromSrc(item.src, workTitleFallback),
      artistName: item.photographerName,
      role: roleFromTitle(title),
      href: `/${item.photographerId}`,
    });
  }

  return works;
}
