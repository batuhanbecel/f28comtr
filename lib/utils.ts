import fs from 'fs';
import path from 'path';
import { imageManifest } from './image-manifest';

export function getPortfolioImages(photographerId: string): string[] {
  // Use pre-built manifest (works on Vercel serverless where fs can't access public/)
  if (imageManifest[photographerId] && imageManifest[photographerId].length > 0) {
    return imageManifest[photographerId];
  }

  // Fallback: read from filesystem (local dev only)
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

export function getBrandLogos(): string[] {
  const logosPath = path.join(process.cwd(), 'public', 'logos', 'brands');
  
  try {
    const files = fs.readdirSync(logosPath);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
      .map(file => `/logos/brands/${file}`)
      .sort();
  } catch (error) {
    console.error('Error reading brand logos:', error);
    return [];
  }
}

export async function getPartnerLogos(): Promise<string[]> {
  // Try Redis first
  try {
    const { Redis } = require('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
    });
    
    const logos = await redis.get('site:logos:partners');
    if (logos && Array.isArray(logos) && logos.length > 0) {
      return logos as string[];
    }
  } catch {}

  // Fallback to manifest
  if (imageManifest['__partners__'] && imageManifest['__partners__'].length > 0) {
    return imageManifest['__partners__'];
  }

  // Fallback to filesystem
  const logosPath = path.join(process.cwd(), 'public', 'logos', 'brands', 'partners');
  
  try {
    const files = fs.readdirSync(logosPath);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
      .map(file => `/logos/brands/partners/${file}`)
      .sort();
  } catch (error) {
    console.error('Error reading partner logos:', error);
    return [];
  }
}

export async function getClientLogos(): Promise<string[]> {
  // Try Redis first
  try {
    const { Redis } = require('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
    });
    
    const logos = await redis.get('site:logos:clients');
    if (logos && Array.isArray(logos) && logos.length > 0) {
      return logos as string[];
    }
  } catch {}

  // Fallback to manifest
  if (imageManifest['__clients__'] && imageManifest['__clients__'].length > 0) {
    return imageManifest['__clients__'];
  }

  // Fallback to filesystem
  const logosPath = path.join(process.cwd(), 'public', 'logos', 'brands', 'clients');
  
  try {
    const files = fs.readdirSync(logosPath);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
      .map(file => `/logos/brands/clients/${file}`)
      .sort();
  } catch (error) {
    console.error('Error reading client logos:', error);
    return [];
  }
}

export function getAIImages(): string[] {
  // Use pre-built manifest first
  if (imageManifest['__ai__'] && imageManifest['__ai__'].length > 0) {
    return imageManifest['__ai__'];
  }

  // Fallback: filesystem (local dev)
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
