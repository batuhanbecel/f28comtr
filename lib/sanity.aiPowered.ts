import { sanityFetch } from '@/lib/sanity.fetch';
import type { AiPoweredWork } from '@/lib/aiPoweredWorks';
import type { AiPortfolioData } from '@/lib/aiPoweredPortfolio.shared';

const AI_WORKS_QUERY = `*[_id == "aiPoweredCollection"][0]{
  "works": works[]{
    "id": _key,
    "slug": coalesce(slug.current, _key),
    brand,
    brandKey,
    title,
    description,
    category,
    "imageSrc": image.asset->url,
    imageAlt,
    year,
    tags,
    instagramUrl,
    agency,
    "credits": {
      "photographers": credits.photographers[]->{ "slug": slug.current, fullName },
      "aiArtists": credits.aiArtists,
      "retouchers": credits.retouchers[]->{ "slug": slug.current, fullName }
    }
  }
}.works`;

const AI_PORTFOLIO_QUERY = `*[_type == "aiPortfolioItem"] | order(orderRank asc) {
  "src": image.asset->url,
  "tags": tags[]{ en, tr }
}`;

function deriveTagId(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'tag'
  );
}

export async function getAiPoweredWorksFromSanity(): Promise<AiPoweredWork[]> {
  const result = await sanityFetch<AiPoweredWork[] | null>(AI_WORKS_QUERY);
  return (result ?? []).filter(
    (w): w is AiPoweredWork => Boolean(w?.id && w?.imageSrc && w?.brandKey),
  );
}

export async function getAiPoweredPortfolioFromSanity(): Promise<AiPortfolioData> {
  const result = await sanityFetch<
    | { src: string | null; tags: { en: string | null; tr: string | null }[] | null }[]
    | null
  >(AI_PORTFOLIO_QUERY);

  // Collect unique tags across all items. Items sharing the same EN label
  // (case-insensitive) get merged into a single filter group.
  const tagMap = new Map<string, { id: string; en: string; tr: string }>();
  const items: AiPortfolioData['items'] = [];

  for (const item of result ?? []) {
    if (typeof item?.src !== 'string' || item.src.length === 0) continue;
    const itemTagIds: string[] = [];
    for (const t of item.tags ?? []) {
      if (!t || typeof t.en !== 'string' || t.en.length === 0) continue;
      const id = deriveTagId(t.en);
      if (!tagMap.has(id)) {
        tagMap.set(id, {
          id,
          en: t.en,
          tr: typeof t.tr === 'string' && t.tr.length > 0 ? t.tr : t.en,
        });
      }
      if (!itemTagIds.includes(id)) itemTagIds.push(id);
    }
    items.push({ src: item.src, tagIds: itemTagIds });
  }

  const tags = Array.from(tagMap.values()).sort((a, b) => a.en.localeCompare(b.en));
  return { tags, items };
}

export async function getAiPoweredPortfolioImagesFromSanity(): Promise<string[]> {
  const { items } = await getAiPoweredPortfolioFromSanity();
  return items.map((i) => i.src);
}

const AI_IMAGES_QUERY = `*[_id == "aiPoweredCollection"][0]{
  "urls": works[].image.asset->url
}.urls`;

export async function getAiPoweredImagesFromSanity(): Promise<string[]> {
  const result = await sanityFetch<(string | null)[] | null>(AI_IMAGES_QUERY);
  return (result ?? []).filter((u): u is string => typeof u === 'string' && u.length > 0);
}
