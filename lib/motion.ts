/** Shared motion constants — mirrored in globals.css custom properties. */
export const MOTION = {
  ease: {
    brand: 'cubic-bezier(0.76, 0, 0.24, 1)',
    morph: 'cubic-bezier(0.32, 0.72, 0, 1)',
    snappy: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  duration: {
    reveal: '0.65s',
    hover: '0.35s',
    ui: '0.2s',
    vtOut: '0.3s',
    vtIn: '0.45s',
    vtGroup: '0.55s',
    vtPhoto: '0.6s',
  },
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function canUseFinePointerParallax(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    !prefersReducedMotion() &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}
