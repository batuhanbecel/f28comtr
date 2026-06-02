/** Hero background slides for /home-v2 — files in public/home/ */
export const HOME_V2_HERO_SLIDES = [
  { src: '/home/1.webp', alt: 'f/2.8 Production — selected work 1' },
  { src: '/home/2.webp', alt: 'f/2.8 Production — selected work 2' },
  { src: '/home/3.jpg', alt: 'f/2.8 Production — selected work 3' },
] as const;

/** Crossfade duration — keep in sync with CSS (--home-v2-hero-fade-ms). */
export const HOME_V2_HERO_FADE_MS = 2400;

/** Time each slide is primary before advancing. */
export const HOME_V2_HERO_HOLD_MS = 5600;

export const HOME_V2_HERO_INTERVAL_MS = HOME_V2_HERO_HOLD_MS + HOME_V2_HERO_FADE_MS;
