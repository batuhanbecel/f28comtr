import { photographers as staticPhotographers, Photographer } from './data';
import { getPortfolioImages, getAIImages as getStaticAIImages } from './utils';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const { Redis } = require('@upstash/redis');
  return new Redis({ url, token });
}

export async function getPhotographers(): Promise<Photographer[]> {
  const redis = getRedis();
  let photographers = [...staticPhotographers];
  
  if (redis) {
    try {
      // Get photographer list from Redis if available
      const list = await redis.get('photographers');
      if (list && Array.isArray(list) && list.length > 0) {
        photographers = list as Photographer[];
      }
      
      // Get migrated preview images from Redis
      const previewImages = await redis.get('site:preview') || [];
      const previewUrls = Array.isArray(previewImages) ? previewImages : [];
      
      if (previewUrls.length > 0) {
        photographers = photographers.map((photographer) => {
          // Only apply blob preview if photographer still has a local path
          // If preview is already a blob URL, the admin has set it — don't overwrite
          if (photographer.preview && photographer.preview.includes('.blob.vercel-storage.com')) {
            return photographer;
          }
          
          // Find preview image that matches this photographer's ID
          const matchingPreview = previewUrls.find((url: string) => 
            url.includes(photographer.id)
          );
          
          if (matchingPreview) {
            return {
              ...photographer,
              preview: matchingPreview
            };
          }
          return photographer;
        });
      }
    } catch {}
  }
  
  return photographers;
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

export async function getAIImages(): Promise<string[]> {
  const redis = getRedis();
  if (redis) {
    try {
      const images = await redis.get('ai:images');
      if (images && Array.isArray(images) && images.length > 0) return images as string[];
    } catch {}
  }
  return getStaticAIImages();
}

export async function setAIImages(images: string[]): Promise<void> {
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
