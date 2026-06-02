import { renderRouteOgImage } from '@/lib/routeOgImage';

export const runtime = 'nodejs';
export const alt = 'Portfolios | f/2.8 Production Agency';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return renderRouteOgImage('portfolios');
}
