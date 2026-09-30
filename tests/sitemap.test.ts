import { describe, it, expect } from 'vitest';
import { buildStaticSitemapEntries, PUBLIC_SITE_ROUTES } from '@/lib/siteRoutes';

describe('sitemap routes', () => {
  it('builds static entries with correct base URL', () => {
    const entries = buildStaticSitemapEntries('https://f28.com.tr');
    expect(entries.length).toBe(PUBLIC_SITE_ROUTES.length);

    const homeEntry = entries.find((e) => e.url === 'https://f28.com.tr');
    expect(homeEntry).toBeDefined();
    expect(homeEntry?.priority).toBe(1);

    const contactEntry = entries.find((e) => e.url === 'https://f28.com.tr/contact');
    expect(contactEntry).toBeDefined();
    expect(contactEntry?.priority).toBe(0.7);
  });

  it('contains all essential public pages', () => {
    const paths = PUBLIC_SITE_ROUTES.map((r) => r.path);
    expect(paths).toContain('/');
    expect(paths).toContain('/production');
    expect(paths).toContain('/ai-powered');
    expect(paths).toContain('/ai-powered/portfolio');
    expect(paths).toContain('/portfolios');
    expect(paths).toContain('/about');
    expect(paths).toContain('/contact');
  });
});
