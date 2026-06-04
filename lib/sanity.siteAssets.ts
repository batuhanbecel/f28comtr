import { sanityFetch } from '@/lib/sanity.fetch';

export type LogoCategory = 'clients' | 'partners' | 'f28' | 'social';

const SITE_ASSETS_QUERY = `*[_id == "siteAssets"][0]{
  "landingImages": landingImages[].asset->url,
  "logos": {
    "clients": logos.clients[].asset->url,
    "partners": logos.partners[].asset->url,
    "f28": logos.f28[].asset->url,
    "social": logos.social[].asset->url
  }
}`;

interface SiteAssetsResponse {
  landingImages: (string | null)[] | null;
  logos: Record<LogoCategory, (string | null)[] | null> | null;
}

function cleanUrls(v: (string | null)[] | null | undefined): string[] {
  return (v ?? []).filter((u): u is string => typeof u === 'string' && u.length > 0);
}

export async function getLandingImagesFromSanity(): Promise<string[]> {
  const data = await sanityFetch<SiteAssetsResponse | null>(SITE_ASSETS_QUERY);
  return cleanUrls(data?.landingImages);
}

export async function getLogosFromSanity(category: LogoCategory): Promise<string[]> {
  const data = await sanityFetch<SiteAssetsResponse | null>(SITE_ASSETS_QUERY);
  return cleanUrls(data?.logos?.[category]);
}
