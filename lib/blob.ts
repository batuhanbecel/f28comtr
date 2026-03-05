/**
 * Vercel Blob URL utilities.
 *
 * Images can come in three forms:
 *  1. Local path:   /portfolios/photographer/image.webp
 *  2. Proxy URL:    /api/blob?u=https%3A%2F%2F...
 *  3. Direct blob:  https://xxx.public.blob.vercel-storage.com/...
 *
 * For next/image:
 *  - Local paths work natively.
 *  - Direct blob URLs work if remotePatterns is configured in next.config.ts.
 *  - Proxy URLs are local so they work, but next/image optimization adds
 *    overhead on top of the proxy fetch; we mark them unoptimized.
 */

const BLOB_DIRECT_RE = /^https:\/\/[a-z0-9]+\.(public|private)\.blob\.vercel-storage\.com\//;

/** True when the URL points directly at Vercel Blob storage */
export function isBlobUrl(url: string): boolean {
  return BLOB_DIRECT_RE.test(url);
}

/** True when the URL is a local /api/blob proxy */
export function isBlobProxy(url: string): boolean {
  return url.startsWith('/api/blob');
}

/** True when the URL is external (not a local path) */
export function isExternal(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Returns true when next/image optimization should be skipped.
 * - Proxy URLs (/api/blob): already proxied, double-optimizing adds latency
 * - Local paths are fine to optimize — Next.js Image handles them natively
 * - External blob URLs should go through optimization (remotePatterns configured)
 */
export function shouldSkipOptimization(url: string): boolean {
  return isBlobProxy(url);
}

