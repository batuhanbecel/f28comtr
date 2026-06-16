import { sanityFetch } from '@/lib/sanity.fetch';
import type { AiPoweredWork, AiPoweredWorkImage } from '@/lib/aiPoweredWorks';
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
    "images": select(
      count(images) > 0 => images[]{
        "src": asset->url,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      },
      defined(image.asset) => [{
        "src": image.asset->url,
        "width": image.asset->metadata.dimensions.width,
        "height": image.asset->metadata.dimensions.height
      }],
      []
    ),
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
  "tags": tags[]{
    "en": coalesce(@->en, en),
    "tr": coalesce(@->tr, tr)
  }
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

interface RawCreditPerson {
  slug?: string | null;
  fullName?: string | null;
}

interface RawCredits {
  photographers?: RawCreditPerson[] | null;
  aiArtists?: (string | null)[] | null;
  retouchers?: RawCreditPerson[] | null;
}

interface RawWorkImage {
  src?: string | null;
  width?: number | null;
  height?: number | null;
}

interface RawAiWork {
  id: string;
  slug: string;
  brand: string;
  brandKey: string;
  title: string;
  description: string;
  category: AiPoweredWork['category'];
  images?: RawWorkImage[] | null;
  imageAlt: string;
  year: number;
  tags?: string[];
  instagramUrl?: string;
  agency?: string;
  credits?: RawCredits | null;
}

function normalizeWorkImages(raw: RawWorkImage[] | null | undefined): AiPoweredWorkImage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((img): img is RawWorkImage & { src: string } =>
      typeof img?.src === 'string' && img.src.length > 0,
    )
    .map((img) => ({
      src: img.src,
      ...(typeof img.width === 'number' && img.width > 0 ? { width: img.width } : {}),
      ...(typeof img.height === 'number' && img.height > 0 ? { height: img.height } : {}),
    }));
}

function withCoverFields(
  work: Omit<AiPoweredWork, 'imageSrc' | 'imageWidth' | 'imageHeight'>,
): AiPoweredWork | null {
  const cover = work.images[0];
  if (!cover) return null;
  return {
    ...work,
    imageSrc: cover.src,
    imageWidth: cover.width,
    imageHeight: cover.height,
  };
}

function normalizePerson(p: RawCreditPerson): { slug?: string; fullName: string } | null {
  const fullName = typeof p?.fullName === 'string' && p.fullName.length > 0 ? p.fullName : null;
  if (!fullName) return null;
  return {
    fullName,
    ...(typeof p.slug === 'string' && p.slug.length > 0 ? { slug: p.slug } : {}),
  };
}

function normalizeCredits(raw: RawCredits | null | undefined): AiPoweredWork['credits'] {
  const photographers = Array.isArray(raw?.photographers)
    ? raw.photographers.map(normalizePerson).filter((p): p is NonNullable<typeof p> => p !== null)
    : [];
  const retouchers = Array.isArray(raw?.retouchers)
    ? raw.retouchers.map(normalizePerson).filter((p): p is NonNullable<typeof p> => p !== null)
    : [];
  const aiArtists = Array.isArray(raw?.aiArtists)
    ? raw.aiArtists.filter((s): s is string => typeof s === 'string' && s.length > 0)
    : [];
  if (photographers.length === 0 && retouchers.length === 0 && aiArtists.length === 0) {
    return undefined;
  }
  return { photographers, aiArtists, retouchers };
}

export async function getAiPoweredWorksFromSanity(): Promise<AiPoweredWork[]> {
  const result = await sanityFetch<RawAiWork[] | null>(AI_WORKS_QUERY);
  const works: AiPoweredWork[] = [];

  for (const w of result ?? []) {
    // brandKey is an optional editor field ("leave empty; automatic"). Do NOT
    // drop works that lack it — cms.ts derives a key from the brand name. Only
    // an id and at least one image are truly required.
    if (!w?.id) continue;
    const images = normalizeWorkImages(w.images);
    if (images.length === 0) continue;

    const base = {
      id: w.id,
      slug: w.slug,
      brand: w.brand,
      brandKey: w.brandKey,
      title: w.title,
      description: w.description,
      category: w.category,
      images,
      imageAlt: w.imageAlt,
      year: w.year,
      tags: w.tags,
      instagramUrl: w.instagramUrl,
      agency: typeof w.agency === 'string' && w.agency.length > 0 ? w.agency : undefined,
      credits: normalizeCredits(w.credits),
    };

    const normalized = withCoverFields(base);
    if (normalized) works.push(normalized);
  }

  return works;
}

export async function getAiPoweredPortfolioFromSanity(): Promise<AiPortfolioData> {
  const result = await sanityFetch<
    | { src: string | null; tags: { en: string | null; tr: string | null }[] | null }[]
    | null
  >(AI_PORTFOLIO_QUERY);

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
  "urls": array::unique(array::compact(
    works[].images[].asset->url + works[].image.asset->url
  ))
}.urls`;

export async function getAiPoweredImagesFromSanity(): Promise<string[]> {
  const result = await sanityFetch<(string | null)[] | null>(AI_IMAGES_QUERY);
  return (result ?? []).filter((u): u is string => typeof u === 'string' && u.length > 0);
}
