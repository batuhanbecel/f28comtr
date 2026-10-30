/** Full-bleed hero / parallax section backgrounds (w-full). */
export const HERO_IMAGE_SIZES = "100vw";

/** Sanity asset URLs end in `-{width}x{height}.{ext}`. */
const SANITY_DIMENSIONS_RE = /-(\d+)x(\d+)\.[a-z0-9]+(?:\?|$)/i;

/**
 * `sizes` for an `object-cover` image filling a full-width frame `frameVh`
 * viewport heights tall. On a portrait phone a landscape photo is scaled to
 * the frame's height, so it renders far wider than the screen: 100vw would
 * fetch a ~1200px file and stretch it 3–5×, which reads as blur. When the
 * viewport is narrower than the image (relative to the frame) the rendered
 * width is aspect × frame height. Falls back to 100vw when the URL carries no
 * dimensions (non-Sanity images).
 */
export function coverImageSizes(src: string, frameVh = 100): string {
  const match = SANITY_DIMENSIONS_RE.exec(src);
  if (!match) return HERO_IMAGE_SIZES;
  const aspect = Number(match[1]) / Number(match[2]);
  if (!Number.isFinite(aspect) || aspect <= 0) return HERO_IMAGE_SIZES;
  const renderedVh = Math.ceil(aspect * frameVh);
  return `(max-aspect-ratio: ${renderedVh}/100) ${renderedVh}vh, 100vw`;
}

/**
 * `sizes` for an `object-cover` image in a fixed-ratio box `boxVw` viewport
 * widths wide (`boxAspect` = width / height). An image wider than the box is
 * scaled to the box height and cropped, so it renders boxVw × (image aspect ÷
 * box aspect) wide — a landscape cover in a 3:4 box needs ~2.7× the box width.
 */
export function coverSizesInBox(src: string, boxVw: number, boxAspect: number): string {
  const match = SANITY_DIMENSIONS_RE.exec(src);
  if (!match) return `${boxVw}vw`;
  const aspect = Number(match[1]) / Number(match[2]);
  if (!Number.isFinite(aspect) || aspect <= 0) return `${boxVw}vw`;
  return `${Math.ceil(boxVw * Math.max(1, aspect / boxAspect))}vw`;
}


/** Lightbox image (object-contain) on `.lightbox-stage`: full width minus the
 *  arrow gutters (13rem) from 768px, minus 1.5rem on phones. */
export const LIGHTBOX_IMAGE_SIZES =
  "(max-width: 767px) calc(100vw - 1.5rem), calc(100vw - 13rem)";

/** AI gallery masonry card — WorkGrid: 2 columns on phones, 3 from 768px. */
export const AI_WORK_CARD_SIZES = "(max-width: 768px) 50vw, 34vw";

/** AI work detail — full width of 3fr column up to source resolution. */
export const AI_WORK_DETAIL_SIZES =
  '(max-width: 1024px) 100vw, (max-width: 1280px) min(1200px, calc(100vw - 8rem)), 1200px';

/** Production page closing marquee — fixed-height filmstrip cells. */
export const MARQUEE_THUMB_SIZES = '320px';

/** Portfolio / masonry thumbnail grid — 2 columns on phones, 3 from 768px. */
export const MASONRY_THUMB_SIZES = "(max-width: 768px) 50vw, 34vw";

/** Landing page split panel imagery. */
export const LANDING_PANEL_SIZES = "(max-width: 768px) 100vw, 50vw";

/** About page partner logo grid (grid-cols-4 sm:5 md:6 lg:8). */
export const PARTNER_LOGO_SIZES =
  "(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 12vw";

/** Logo wall cells — .logo-wall is 3 / 5 / 6 columns (768px, 1280px). */
export const CLIENT_LOGO_SIZES =
  "(max-width: 767px) 34vw, (max-width: 1279px) 20vw, 17vw";

/** Production projects — asymmetric 12-col grid; feature tiles span ~7/12. */
export const EDITORIAL_FEATURE_SIZES = "(max-width: 768px) 100vw, 60vw";
export const EDITORIAL_TILE_SIZES = "(max-width: 768px) 100vw, 34vw";

/** One `sizes` slot for an `object-cover` box: its width and height in `unit`. */
export interface CoverSlot {
  media?: string;
  width: number;
  height: number;
  unit?: 'vw' | 'px';
}

/**
 * `sizes` for an `object-cover` image whose box size is known per breakpoint.
 * The rendered width is the box width, or — when the image is wider than the
 * box — the box height × the image aspect (the crop). A landscape photo in a
 * 4:5 tile needs ~1.9× the tile width; declaring only the tile width fetches a
 * file that gets stretched, which reads as blur. Non-Sanity URLs (no
 * dimensions) fall back to the box width.
 */
export function coverSizes(src: string, slots: CoverSlot[]): string {
  const match = SANITY_DIMENSIONS_RE.exec(src);
  const aspect = match ? Number(match[1]) / Number(match[2]) : 0;
  return slots
    .map(({ media, width, height, unit = 'vw' }) => {
      const rendered = aspect > 0 ? Math.max(width, height * aspect) : width;
      const value = `${Math.ceil(rendered)}${unit}`;
      return media ? `${media} ${value}` : value;
    })
    .join(', ');
}

/** Work strip tile: 4:5, min(82vw, clamp(360px, 72vh, 720px) × 0.8) wide — at
 *  most 576 × 720px. Use with coverSizes() for each image. */
export const WORK_STRIP_SLOTS: CoverSlot[] = [
  { media: '(max-width: 702px)', width: 82, height: 102.5 },
  { width: 576, height: 720, unit: 'px' },
];

/** Compact work strip tile (artist page credits): 4:5, min(56vw,
 *  clamp(220px, 38vh, 380px) × 0.8) wide — at most 304 × 380px. */
export const WORK_STRIP_COMPACT_SLOTS: CoverSlot[] = [
  { media: '(max-width: 542px)', width: 56, height: 70 },
  { width: 304, height: 380, unit: 'px' },
];

/** Edge-to-edge 3:4 portrait grid (/portfolios): 2 columns up to 1279px, 5 from
 *  1280px. Per image, since landscape covers are cropped to the tile height. */
export function artistGridSizes(src: string): string {
  return `(max-width: 1279px) ${coverSizesInBox(src, 50, 3 / 4)}, ${coverSizesInBox(src, 20, 3 / 4)}`;
}

/** Production projects: 4:3 tiles, 1 col phone, 2 cols from tablet. Use with coverSizes(). */
export const PROJECT_GRID_SLOTS: CoverSlot[] = [
  { media: '(max-width: 768px)', width: 100, height: 75 },
  { width: 50, height: 37.5 },
];

/** Home disciplines: two half-width panels, stacked on phones. */
export const DISCIPLINE_PANEL_SIZES = "(max-width: 768px) 100vw, 50vw";

/** Home roster sticky preview: a 3:4 box ~37–40% of the viewport wide, only
 *  shown from 1024px (lazy, so phones never request it). Use with
 *  coverSizesInBox() — landscape covers are cropped to the box height. */
export const ROSTER_PREVIEW_VW = 40;
export const ROSTER_PREVIEW_ASPECT = 3 / 4;
