import type { MetadataRoute } from 'next';
import type { SeoPageKey } from '@/lib/seo';

export type SitemapChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]['changeFrequency']
>;

export type FooterNavKey =
  | 'home'
  | 'production'
  | 'aiPowered'
  | 'aiPoweredGallery'
  | 'aiPoweredPortfolio'
  | 'portfolios'
  | 'about'
  | 'contact';

export type FooterNavEntry =
  | { kind: 'link'; path: string; navKey: FooterNavKey }
  | {
      kind: 'group';
      labelKey: 'aiPowered';
      href: string;
      children: { path: string; navKey: 'aiPoweredGallery' | 'aiPoweredPortfolio' }[];
    };

/** Footer navigation — grouped AI links match main menu structure. */
export const FOOTER_NAV: FooterNavEntry[] = [
  { kind: 'link', path: '/', navKey: 'home' },
  { kind: 'link', path: '/production', navKey: 'production' },
  {
    kind: 'group',
    labelKey: 'aiPowered',
    href: '/ai-powered',
    children: [
      { path: '/ai-powered', navKey: 'aiPoweredGallery' },
      { path: '/ai-powered/portfolio', navKey: 'aiPoweredPortfolio' },
    ],
  },
  { kind: 'link', path: '/portfolios', navKey: 'portfolios' },
  { kind: 'link', path: '/about', navKey: 'about' },
  { kind: 'link', path: '/contact', navKey: 'contact' },
];

export interface PublicSiteRoute {
  path: string;
  navKey: FooterNavKey;
  seoKey: SeoPageKey;
  sitemap: {
    priority: number;
    changeFrequency: SitemapChangeFrequency;
  };
}

/** Public indexable pages — single source for sitemap and footer navigation. */
export const PUBLIC_SITE_ROUTES: PublicSiteRoute[] = [
  {
    path: '/',
    navKey: 'home',
    seoKey: 'home',
    sitemap: { priority: 1, changeFrequency: 'weekly' },
  },
  {
    path: '/production',
    navKey: 'production',
    seoKey: 'production',
    sitemap: { priority: 0.9, changeFrequency: 'weekly' },
  },
  {
    path: '/ai-powered',
    navKey: 'aiPoweredGallery',
    seoKey: 'aiPowered',
    sitemap: { priority: 0.8, changeFrequency: 'weekly' },
  },
  {
    path: '/ai-powered/portfolio',
    navKey: 'aiPoweredPortfolio',
    seoKey: 'aiPoweredPortfolio',
    sitemap: { priority: 0.75, changeFrequency: 'weekly' },
  },
  {
    path: '/portfolios',
    navKey: 'portfolios',
    seoKey: 'portfolios',
    sitemap: { priority: 0.9, changeFrequency: 'weekly' },
  },
  {
    path: '/about',
    navKey: 'about',
    seoKey: 'about',
    sitemap: { priority: 0.7, changeFrequency: 'monthly' },
  },
  {
    path: '/contact',
    navKey: 'contact',
    seoKey: 'contact',
    sitemap: { priority: 0.7, changeFrequency: 'monthly' },
  },
];

export function buildStaticSitemapEntries(baseUrl: string): MetadataRoute.Sitemap {
  return PUBLIC_SITE_ROUTES.map(({ path, sitemap }) => ({
    url: path === '/' ? baseUrl : `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: sitemap.changeFrequency,
    priority: sitemap.priority,
  }));
}
