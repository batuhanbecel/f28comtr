export const SITE_HEADER_OFFSET_PX = 112;

export function readSiteHeaderOffsetPx(): number {
  if (typeof window === 'undefined') return SITE_HEADER_OFFSET_PX;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-offset').trim();
  if (!raw) return SITE_HEADER_OFFSET_PX;
  if (raw.endsWith('rem')) return parseFloat(raw) * 16;
  if (raw.endsWith('px')) return parseFloat(raw);
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n * 16 : SITE_HEADER_OFFSET_PX;
}

export function getHeroSnapScrollTarget(container: HTMLElement): number {
  const body = container.querySelector('.hero-snap-body');
  const scope = body instanceof HTMLElement ? body : container;
  const target =
    scope.querySelector('.hero-snap-target') ??
    scope.querySelector('.hero-snap-lead') ??
    (body instanceof HTMLElement ? body : null);

  if (!(target instanceof HTMLElement)) {
    return container.clientHeight;
  }

  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const usesPad = target.classList.contains('hero-snap-target--pad');
  const offset = usesPad ? 0 : readSiteHeaderOffsetPx();
  return container.scrollTop + (targetRect.top - containerRect.top) - offset;
}

export function scrollHeroSnapTo(
  container: HTMLElement,
  top: number,
  smooth = typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
) {
  container.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' });
}

export function scrollHeroSnapToContent(container: HTMLElement) {
  scrollHeroSnapTo(container, getHeroSnapScrollTarget(container));
}

export function scrollHeroSnapToHero(container: HTMLElement) {
  scrollHeroSnapTo(container, 0);
}

export function isHeroSnapOnHero(container: HTMLElement): boolean {
  const targetTop = getHeroSnapScrollTarget(container);
  return container.scrollTop < targetTop * 0.5;
}

export function isHeroSnapAtContentStart(container: HTMLElement): boolean {
  const targetTop = getHeroSnapScrollTarget(container);
  return container.scrollTop > 12 && container.scrollTop < targetTop + 80;
}
