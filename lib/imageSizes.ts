/** Full-bleed hero / parallax section backgrounds (w-full). */
export const HERO_IMAGE_SIZES = "100vw";


/** Lightbox images in max-w-7xl containers with horizontal padding (object-contain). */
export const LIGHTBOX_IMAGE_SIZES =
  "(max-width: 1280px) calc(100vw - 8rem), 1280px";

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

/** Work strip tile: min(82vw, clamp(360px, 72vh, 720px) × 0.8) — height-driven, so
 *  declare its largest width (576px) rather than a vw guess that undershoots. */
export const WORK_STRIP_SIZES = "(max-width: 702px) 82vw, 576px";

/** Edge-to-edge portrait grid: 2 cols phone, 3 tablet, 5 desktop. */
export const ARTIST_GRID_SIZES = "(max-width: 768px) 50vw, (max-width: 1280px) 34vw, 20vw";

/** Production projects: 1 col phone, 2 cols from tablet. */
export const PROJECT_GRID_SIZES = "(max-width: 768px) 100vw, 50vw";

/** Home disciplines: two half-width panels, stacked on phones. */
export const DISCIPLINE_PANEL_SIZES = "(max-width: 768px) 100vw, 50vw";

/** Home roster sticky preview (~37–40% of the viewport on desktop). Only shown
 *  from 1024px; the images are lazy, so phones never request them. */
export const ROSTER_PREVIEW_SIZES = "40vw";
