import sharp from 'sharp';
import { logoSlug } from '@/lib/logoNames';

/**
 * Logo files carry very different amounts of empty margin (27–100% of the
 * canvas is artwork), so in a contain-fit grid some marks look tiny. Measure
 * the artwork once per asset and crop to it with Sanity's `rect` param.
 * Also appends a vanity filename so the URL ends in a readable brand slug.
 */

const SAMPLE_WIDTH = 600;
const trimmed = new Map<string, string>();

export async function trimLogoUrl(url: string, originalFilename?: string | null): Promise<string> {
  const cached = trimmed.get(url);
  if (cached) return cached;

  const dims = url.match(/-(\d+)x(\d+)\.(\w+)$/);
  const vanity = originalFilename && dims ? `/${logoSlug(originalFilename)}.${dims[3]}` : '';
  let result = `${url}${vanity}`;

  if (dims) {
    try {
      const [width, height] = [Number(dims[1]), Number(dims[2])];
      const res = await fetch(`${url}?w=${SAMPLE_WIDTH}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const sampleWidth = (await sharp(buf).metadata()).width ?? width;
      const { info } = await sharp(buf).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });

      const scale = width / sampleWidth;
      // A little air so anti-aliased edges are not clipped
      const pad = Math.round(Math.max(info.width, info.height) * scale * 0.02);
      const left = Math.max(0, Math.round(-(info.trimOffsetLeft ?? 0) * scale) - pad);
      const top = Math.max(0, Math.round(-(info.trimOffsetTop ?? 0) * scale) - pad);
      const w = Math.min(width - left, Math.round(info.width * scale) + pad * 2);
      const h = Math.min(height - top, Math.round(info.height * scale) + pad * 2);

      if (w > 0 && h > 0 && (w < width || h < height)) {
        result = `${result}?rect=${left},${top},${w},${h}`;
      }
    } catch (error) {
      console.error('[logos] trim failed, using the full canvas:', url, error);
    }
  }

  trimmed.set(url, result);
  return result;
}
