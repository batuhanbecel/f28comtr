/** Pages with large image grids where heavy overlays hurt scroll performance. */
export function isGalleryHeavyPage(pathname: string): boolean {
  if (pathname === '/ai-powered' || pathname === '/ai-powered/portfolio' || pathname === '/portfolios') return true;
  const staticRoutes = new Set(['/', '/home-v2', '/production', '/about']);
  const segments = pathname.split('/').filter(Boolean);
  return segments.length === 1 && !staticRoutes.has(pathname);
}

/** Full-viewport pages with parallax / large imagery — skip grain overlay. */
export function isPerfHeavyPage(pathname: string): boolean {
  if (isGalleryHeavyPage(pathname)) return true;
  return pathname === '/' || pathname === '/home-v2' || pathname === '/production';
}
