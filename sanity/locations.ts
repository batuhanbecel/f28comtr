import type { PresentationPluginOptions } from 'sanity/presentation';
import { defineLocations } from 'sanity/presentation';

/**
 * Hangi Sanity doc'unun hangi public URL'lerde göründüğünü tanımlar.
 * Presentation Tool bunu kullanarak Studio'da bir doc açıldığında
 * iframe'de doğru sayfayı yükler ve "bu doc nerede görünüyor?" panelini
 * doldurur.
 */
export const locations: PresentationPluginOptions['resolve'] = {
  locations: {
    photographer: defineLocations({
      select: { slug: 'slug.current', fullName: 'fullName' },
      resolve: (doc) =>
        doc?.slug
          ? {
              locations: [
                { title: String(doc.fullName ?? 'Photographer'), href: `/${doc.slug}` },
                { title: 'Portfolios', href: '/portfolios' },
              ],
            }
          : null,
    }),

    aiPoweredCollection: defineLocations({
      message: '/ai-powered sayfasında listeleniyor',
      tone: 'positive',
      locations: [{ title: 'AI Powered', href: '/ai-powered' }],
    }),

    aiPortfolioItem: defineLocations({
      message: '/ai-powered/portfolio galerisinde gösteriliyor',
      tone: 'positive',
      locations: [{ title: 'AI Portfolio', href: '/ai-powered/portfolio' }],
    }),

    homeV2PageCopy: defineLocations({
      message: 'Anasayfa (home-v2) metinleri ve öne çıkan işler',
      tone: 'positive',
      locations: [
        { title: 'Home (preview)', href: '/home-v2' },
        { title: 'Home', href: '/' },
      ],
    }),

    siteAssets: defineLocations({
      message: 'Landing, about ve diğer sayfalardaki görseller',
      tone: 'positive',
      locations: [
        { title: 'Home', href: '/' },
        { title: 'About', href: '/about' },
      ],
    }),

    productionPageCopy: defineLocations({
      locations: [{ title: 'Production', href: '/production' }],
    }),

    aiPoweredPageCopy: defineLocations({
      locations: [{ title: 'AI Powered', href: '/ai-powered' }],
    }),

    contactPageCopy: defineLocations({
      locations: [{ title: 'Contact', href: '/contact' }],
    }),

    seoOverride: defineLocations({
      select: { pageKey: 'pageKey' },
      resolve: (doc) => {
        const pageKey = String(doc?.pageKey ?? '');
        const map: Record<string, { title: string; href: string }> = {
          home: { title: 'Home', href: '/' },
          production: { title: 'Production', href: '/production' },
          aiPowered: { title: 'AI Powered', href: '/ai-powered' },
          aiPoweredPortfolio: {
            title: 'AI Portfolio',
            href: '/ai-powered/portfolio',
          },
          portfolios: { title: 'Portfolios', href: '/portfolios' },
          about: { title: 'About', href: '/about' },
          contact: { title: 'Contact', href: '/contact' },
        };
        const target = map[pageKey];
        return target ? { locations: [target] } : null;
      },
    }),
  },
};
