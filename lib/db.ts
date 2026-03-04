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

export async function seedFromStatic(): Promise<{ photographers: number; imageSets: number }> {
  const redis = getRedis();
  if (!redis) throw new Error('Redis is not configured.');

  await redis.set('photographers', JSON.stringify(staticPhotographers));

  let imageSets = 0;
  for (const photographer of staticPhotographers) {
    const images = getPortfolioImages(photographer.id);
    if (images.length > 0) {
      await redis.set(`photographer:${photographer.id}:images`, JSON.stringify(images));
      imageSets++;
    }
  }

  return { photographers: staticPhotographers.length, imageSets };
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
