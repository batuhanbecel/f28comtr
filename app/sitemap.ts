import type { MetadataRoute } from 'next';
import { photographers as staticPhotographers } from '@/lib/data';
import { getPhotographers, getAiPoweredWorks } from '@/lib/cms';
import { buildStaticSitemapEntries } from '@/lib/siteRoutes';
import { getSiteUrl } from '@/lib/siteUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  let photographers = staticPhotographers;
  try {
    const dbPhotographers = await getPhotographers();
    if (dbPhotographers.length > 0) photographers = dbPhotographers;
  } catch {
    /* fallback to static */
  }

  const photographerUrls: MetadataRoute.Sitemap = photographers.map((p) => ({
    url: `${baseUrl}/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  let aiWorkUrls: MetadataRoute.Sitemap = [];
  try {
    const aiWorks = await getAiPoweredWorks();
    aiWorkUrls = aiWorks
      .filter((w) => Boolean(w.slug))
      .map((w) => ({
        url: `${baseUrl}/ai-powered/works/${w.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
  } catch {
    /* fallback to empty if fetch fails */
  }

  return [...buildStaticSitemapEntries(baseUrl), ...photographerUrls, ...aiWorkUrls];
}

