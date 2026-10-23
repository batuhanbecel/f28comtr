import type { Metadata } from 'next';
import HomeV2Page from './home-v2/shared';
import { generatePageMetadata } from '@/lib/seo';

// Full brand title on the home page (never the "Home" nav label) — Google uses
// it, together with the WebSite structured data, to name the site in results.
export function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('home', '/');
}

export const revalidate = 60;

export default HomeV2Page;
