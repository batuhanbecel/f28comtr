import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { put, del } from '@vercel/blob';
import sharp from 'sharp';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';
import { getPhotographerImages, setPhotographerImages, getAIImages, setAIImages } from '@/lib/db';
import { Redis } from '@upstash/redis';

// Redis keys for new upload types
const REDIS_KEYS = {
  preview: 'site:preview',
  landing: 'site:landing',
  logos: 'site:logos',
  logos_clients: 'site:logos:clients',
  logos_partners: 'site:logos:partners',
  logos_f28: 'site:logos:f28',
  logos_social: 'site:logos:social',
} as const;
import { revalidatePath } from 'next/cache';

export const maxDuration = 30; // seconds (Sharp processing can take time for large files)

const MAX_DIMENSION = 2400;
const WEBP_QUALITY = 82;

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function POST(request: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await request.formData();
  const file = form.get('file') as File | null;
  const uploadType = (form.get('type') as string) || 'portfolio';
  const photographerId = form.get('photographerId') as string | null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (uploadType === 'portfolio' && !photographerId) {
    return NextResponse.json({ error: 'No photographerId provided' }, { status: 400 });
  }
  if (['preview', 'landing'].includes(uploadType) && !photographerId) {
    return NextResponse.json({ error: 'No identifier provided for ' + uploadType }, { status: 400 });
  }
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/tiff', 'image/avif', 'image/heic', 'image/heif'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported image format' }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not configured' }, { status: 500 });
  }

  try {
    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Optimize with Sharp: resize + convert to WebP
    const optimized = await sharp(inputBuffer)
      .rotate() // auto-rotate based on EXIF
      .resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    // Generate unique filename
    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 60);
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    let blobPath: string;
    
    switch (uploadType) {
      case 'ai':
        blobPath = `ai-images/${baseName}-${uniqueId}.webp`;
        break;
      case 'preview':
        blobPath = `previews/${photographerId}-${baseName}-${uniqueId}.webp`;
        break;
      case 'landing':
        blobPath = `landing/${photographerId}-${baseName}-${uniqueId}.webp`;
        break;
      case 'logos':
        blobPath = `logos/${baseName}-${uniqueId}.webp`;
        break;
      case 'logos_clients':
        blobPath = `logos/clients/${baseName}-${uniqueId}.webp`;
        break;
      case 'logos_partners':
        blobPath = `logos/partners/${baseName}-${uniqueId}.webp`;
        break;
      case 'logos_f28':
        blobPath = `logos/f28/${baseName}-${uniqueId}.webp`;
        break;
      case 'logos_social':
        blobPath = `logos/social/${baseName}-${uniqueId}.webp`;
        break;
      default:
        blobPath = `portfolios/${photographerId}/${baseName}-${uniqueId}.webp`;
    }

    // Upload to Vercel Blob (public access — direct CDN URL)
    const blob = await put(blobPath, optimized, {
      access: 'public',
      contentType: 'image/webp',
    });

    // Store in appropriate Redis key
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
    
    let redisKey: string | undefined;
    let revalidatePaths: string[] = [];
    let updatedImages: string[] = [];
    
    switch (uploadType) {
      case 'ai':
        const currentAI = await getAIImages();
        updatedImages = [...currentAI, blob.url];
        await setAIImages(updatedImages);
        revalidatePaths.push('/ai-based');
        break;
      case 'preview':
        redisKey = REDIS_KEYS.preview;
        revalidatePaths.push('/production', '/portfolios');
        break;
      case 'landing':
        redisKey = REDIS_KEYS.landing;
        revalidatePaths.push('/', '/production', '/ai-based');
        break;
      case 'logos':
      case 'logos_clients':
      case 'logos_partners':
      case 'logos_f28':
      case 'logos_social':
        redisKey = REDIS_KEYS[uploadType as keyof typeof REDIS_KEYS];
        revalidatePaths.push('/about');
        break;
      default:
        const currentImages = await getPhotographerImages(photographerId!);
        updatedImages = [...currentImages, blob.url];
        await setPhotographerImages(photographerId!, updatedImages);
        revalidatePaths.push(`/${photographerId}`, '/production', '/portfolios');
    }
    
    if (redisKey) {
      const current = await redis.get(redisKey) || [];
      updatedImages = [...(Array.isArray(current) ? current : []), blob.url];
      await redis.set(redisKey, JSON.stringify(updatedImages));
    }
    
    revalidatePaths.forEach(path => revalidatePath(path));

    return NextResponse.json({
      url: blob.url,
      originalSize: inputBuffer.length,
      optimizedSize: optimized.length,
      totalImages: updatedImages.length,
    });
  } catch (err) {
    console.error('[upload] failed:', err);
    return NextResponse.json({ error: (err as Error).message ?? 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { url, photographerId, type } = await request.json();
    const deleteType = type || 'portfolio';

    if (!url) {
      return NextResponse.json({ error: 'url required' }, { status: 400 });
    }
    if (['portfolio', 'preview', 'landing'].includes(deleteType) && !photographerId) {
      return NextResponse.json({ error: 'photographerId required for ' + deleteType }, { status: 400 });
    }

    // Delete from Vercel Blob (only if it's a blob URL)
    if (url.includes('.blob.vercel-storage.com')) {
      try {
        await del(url);
      } catch (e) {
        console.warn('[upload/delete] blob del failed (may already be deleted):', e);
      }
    }

    // Remove from appropriate Redis key
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
    
    let redisKey: string | undefined;
    let revalidatePaths: string[] = [];
    let updatedImages: string[] = [];
    
    switch (deleteType) {
      case 'ai':
        const currentAI = await getAIImages();
        updatedImages = currentAI.filter(img => img !== url);
        await setAIImages(updatedImages);
        revalidatePaths.push('/ai-based');
        break;
      case 'preview':
        redisKey = REDIS_KEYS.preview;
        revalidatePaths.push('/production', '/portfolios');
        break;
      case 'landing':
        redisKey = REDIS_KEYS.landing;
        revalidatePaths.push('/', '/production', '/ai-based');
        break;
      case 'logos':
      case 'logos_clients':
      case 'logos_partners':
      case 'logos_f28':
      case 'logos_social':
        redisKey = REDIS_KEYS[deleteType as keyof typeof REDIS_KEYS];
        revalidatePaths.push('/about');
        break;
      default:
        const currentImages = await getPhotographerImages(photographerId);
        updatedImages = currentImages.filter(img => img !== url);
        await setPhotographerImages(photographerId, updatedImages);
        revalidatePaths.push(`/${photographerId}`, '/production', '/portfolios');
    }
    
    if (redisKey) {
      const current = await redis.get(redisKey) || [];
      updatedImages = (Array.isArray(current) ? current : []).filter(img => img !== url);
      await redis.set(redisKey, JSON.stringify(updatedImages));
    }
    
    revalidatePaths.forEach(path => revalidatePath(path));

    return NextResponse.json({ success: true, totalImages: updatedImages.length });
  } catch (err) {
    console.error('[upload/delete] failed:', err);
    return NextResponse.json({ error: (err as Error).message ?? 'Delete failed' }, { status: 500 });
  }
}
