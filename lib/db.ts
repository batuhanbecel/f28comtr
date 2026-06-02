import { photographers as staticPhotographers, Photographer } from './data';
import { getPortfolioImages, getAiPoweredImages as getStaticAiPoweredImages } from './utils';
import { getRedis } from './redis';

export async function getPhotographers(): Promise<Photographer[]> {
  const redis = getRedis();
  let photographers = [...staticPhotographers];

  if (redis) {
    try {
      const list = await redis.get('photographers');
      if (list && Array.isArray(list) && list.length > 0) {
        photographers = list as Photographer[];
      }

      const previewImages = await redis.get('site:preview') || [];
      const previewUrls = Array.isArray(previewImages) ? previewImages : [];

      if (previewUrls.length > 0) {
        photographers = photographers.map((photographer) => {
          if (photographer.preview?.includes('.blob.vercel-storage.com')) {
            return photographer;
          }
          const matchingPreview = previewUrls.find((url: string) =>
            url.includes(photographer.id)
          );
          return matchingPreview ? { ...photographer, preview: matchingPreview } : photographer;
        });
      }
    } catch {}
  }

  return photographers;
}

export async function getLandingImages(): Promise<string[]> {
  const redis = getRedis();
  if (redis) {
    try {
      const images = await redis.get('site:landing');
      if (images && Array.isArray(images) && images.length > 0) {
        return images as string[];
      }
    } catch {}
  }
  return [];
}

export async function setPhotographers(list: Photographer[]): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error('Redis is not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.');
  await redis.set('photographers', JSON.stringify(list));
}

export async function getPhotographerImages(photographerId: string): Promise<string[]> {
  const redis = getRedis();
  if (redis) {
    try {
      const images = await redis.get(`photographer:${photographerId}:images`);
      if (images && Array.isArray(images) && images.length > 0) return images as string[];
    } catch {}
  }
  return getPortfolioImages(photographerId);
}

export async function setPhotographerImages(photographerId: string, images: string[]): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error('Redis is not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.');
  await redis.set(`photographer:${photographerId}:images`, JSON.stringify(images));
}

export async function getAiPoweredImages(): Promise<string[]> {
  const redis = getRedis();
  if (redis) {
    try {
      const images = await redis.get('ai:images');
      if (images && Array.isArray(images) && images.length > 0) return images as string[];
    } catch {}
  }
  return getStaticAiPoweredImages();
}

export async function setAiPoweredImages(images: string[]): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error('Redis is not configured.');
  await redis.set('ai:images', JSON.stringify(images));
}

export function isRedisConfigured(): boolean {
  return !!(
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  );
}
