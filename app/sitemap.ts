import type { MetadataRoute } from 'next';
import { photographers as staticPhotographers } from '@/lib/data';
import { getPhotographers } from '@/lib/db';
import { getSiteUrl } from '@/lib/siteUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  let photographers = staticPhotographers;
  try {
    const dbPhotographers = await getPhotographers();
    if (dbPhotographers.length > 0) photographers = dbPhotographers;
  } catch { /* fallback to static */ }

  const photographerUrls: MetadataRoute.Sitemap = photographers.map((p) => ({
    url: `${baseUrl}/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/production`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-powered`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolios`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...photographerUrls,
  ];
}
