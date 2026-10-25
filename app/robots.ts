import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/siteUrl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api/', '/home-v1'],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
