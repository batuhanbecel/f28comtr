import { sanityFetch } from '@/lib/sanity.fetch';
import { trimLogoUrl } from '@/lib/logoTrim';

export type LogoCategory = 'clients' | 'partners' | 'f28' | 'social';

const SITE_ASSETS_QUERY = `*[_id == "siteAssets"][0]{
  "landingImages": landingImages[].asset->url,
  "logos": {
    "clients": logos.clients[]{ "url": asset->url, "name": asset->originalFilename },
    "partners": logos.partners[]{ "url": asset->url, "name": asset->originalFilename },
    "f28": logos.f28[].asset->url,
    "social": logos.social[].asset->url
  }
}`;

interface LogoAsset {
  url: string | null;
  name: string | null;
}

interface SiteAssetsResponse {
  landingImages: (string | null)[] | null;
  logos: {
    clients: (LogoAsset | null)[] | null;
    partners: (LogoAsset | null)[] | null;
    f28: (string | null)[] | null;
    social: (string | null)[] | null;
  } | null;
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
  if (category === 'f28' || category === 'social') return cleanUrls(data?.logos?.[category]);
  // Brand walls: crop each mark to its artwork and give it a readable filename
  const assets = (data?.logos?.[category] ?? []).filter(
    (a): a is LogoAsset & { url: string } => typeof a?.url === 'string' && a.url.length > 0,
  );
  return Promise.all(assets.map((a) => trimLogoUrl(a.url, a.name)));
}
