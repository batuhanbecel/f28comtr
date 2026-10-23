import type { ImageLoaderProps } from 'next/image';

/**
 * Sanity image CDN loader for next/image.
 *
 * Sanity originals can be 10k+ px wide; letting /_next/image download and
 * resize them is slow (504s in dev) and burns Vercel optimization quota.
 * Sanity's CDN resizes at its own edge, so we hand it width/quality/format
 * params instead and keep /public images on the default optimizer.
 */

const SANITY_CDN_RE = /^https:\/\/cdn\.sanity\.io\/images\//;

/** True when the URL is served by Sanity's image CDN */
export function isSanityImageUrl(url: string): boolean {
  return SANITY_CDN_RE.test(url);
}

export function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 75));
  url.searchParams.set('fit', 'max');
  url.searchParams.set('auto', 'format');
  return url.toString();
}
