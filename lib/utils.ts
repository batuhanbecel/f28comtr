import fs from 'fs';
import path from 'path';
import { imageManifest } from './image-manifest';
import { getRedis } from './redis';

export function getPortfolioImages(photographerId: string): string[] {
  if (imageManifest[photographerId] && imageManifest[photographerId].length > 0) {
    return imageManifest[photographerId];
  }

  const portfolioPath = path.join(process.cwd(), 'public', 'portfolios', photographerId);
  try {
    const files = fs.readdirSync(portfolioPath);
    return files
      .filter(file => {
        if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) return false;
        const filePath = path.join(portfolioPath, file);
        const stats = fs.statSync(filePath);
        return stats.size > 1024;
      })
      .map(file => `/portfolios/${photographerId}/${file}`)
      .sort();
  } catch {
    return [];
  }
}

export async function getPartnerLogos(): Promise<string[]> {
  const redis = getRedis();
  if (redis) {
    try {
      const logos = await redis.get('site:logos:partners');
      if (logos && Array.isArray(logos) && logos.length > 0) return logos as string[];
    } catch {}
  }

  if (imageManifest['__partners__']?.length > 0) {
    return imageManifest['__partners__'];
  }

  const logosPath = path.join(process.cwd(), 'public', 'logos', 'brands', 'partners');
  try {
    const files = fs.readdirSync(logosPath);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
      .map(file => `/logos/brands/partners/${file}`)
      .sort();
  } catch {
    return [];
  }
}

export async function getClientLogos(): Promise<string[]> {
  const redis = getRedis();
  if (redis) {
    try {
      const logos = await redis.get('site:logos:clients');
      if (logos && Array.isArray(logos) && logos.length > 0) return logos as string[];
    } catch {}
  }

  if (imageManifest['__clients__']?.length > 0) {
    return imageManifest['__clients__'];
  }

  const logosPath = path.join(process.cwd(), 'public', 'logos', 'brands', 'clients');
  try {
    const files = fs.readdirSync(logosPath);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
      .map(file => `/logos/brands/clients/${file}`)
      .sort();
  } catch {
    return [];
  }
}

export function getAiPoweredImages(): string[] {
  if (imageManifest['__ai__']?.length > 0) {
    return imageManifest['__ai__'];
  }

  const aiImagesPath = path.join(process.cwd(), 'public', 'ai-images');
  try {
    const files = fs.readdirSync(aiImagesPath);
    return files
      .filter(file => {
        if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) return false;
        const filePath = path.join(aiImagesPath, file);
        const stats = fs.statSync(filePath);
        return stats.size > 1024;
      })
      .map(file => `/ai-images/${file}`)
      .sort();
  } catch {
    return [];
  }
}
