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
  if (redis) {
    try {
      const list = await redis.get('photographers');
      if (list && Array.isArray(list) && list.length > 0) return list as Photographer[];
    } catch {}
  }
  return [...staticPhotographers];
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

export async function seedFromStatic(): Promise<{ photographers: number; imageSets: number; aiImages: number; newImages: number }> {
  const redis = getRedis();
  if (!redis) throw new Error('Redis is not configured.');

  await redis.set('photographers', JSON.stringify(staticPhotographers));

  let imageSets = 0;
  let newImagesCount = 0;
  
  for (const photographer of staticPhotographers) {
    const filesystemImages = getPortfolioImages(photographer.id);
    
    if (filesystemImages.length > 0) {
      // Get existing order from Redis
      const existingImages = await redis.get(`photographer:${photographer.id}:images`) as string[] | null;
      
      if (existingImages && Array.isArray(existingImages)) {
        // Preserve existing order and only add new images at the end
        const existingSet = new Set(existingImages);
        const newImages = filesystemImages.filter(img => !existingSet.has(img));
        
        // Remove images that no longer exist in filesystem
        const filesystemSet = new Set(filesystemImages);
        const validExisting = existingImages.filter(img => filesystemSet.has(img));
        
        const mergedImages = [...validExisting, ...newImages];
        await redis.set(`photographer:${photographer.id}:images`, JSON.stringify(mergedImages));
        newImagesCount += newImages.length;
      } else {
        // No existing order, use filesystem order
        await redis.set(`photographer:${photographer.id}:images`, JSON.stringify(filesystemImages));
      }
      imageSets++;
    }
  }

  // Seed AI images (preserve order here too)
  const filesystemAIImages = getStaticAIImages();
  if (filesystemAIImages.length > 0) {
    const existingAI = await redis.get('ai:images') as string[] | null;
    
    if (existingAI && Array.isArray(existingAI)) {
      const existingSet = new Set(existingAI);
      const newAI = filesystemAIImages.filter(img => !existingSet.has(img));
      const filesystemSet = new Set(filesystemAIImages);
      const validExisting = existingAI.filter(img => filesystemSet.has(img));
      const mergedAI = [...validExisting, ...newAI];
      await redis.set('ai:images', JSON.stringify(mergedAI));
    } else {
      await redis.set('ai:images', JSON.stringify(filesystemAIImages));
    }
  }

  return { photographers: staticPhotographers.length, imageSets, aiImages: filesystemAIImages.length, newImages: newImagesCount };
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
