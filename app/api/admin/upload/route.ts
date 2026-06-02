import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import sharp from 'sharp';
import { checkAuth } from '@/lib/auth';
import { getRedis } from '@/lib/redis';
import { getPhotographerImages, setPhotographerImages, getAiPoweredImages, setAiPoweredImages, getAiPoweredPortfolio, setAiPoweredPortfolio } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const REDIS_KEYS = {
  preview: 'site:preview',
  landing: 'site:landing',
  logos: 'site:logos',
  logos_clients: 'site:logos:clients',
  logos_partners: 'site:logos:partners',
  logos_f28: 'site:logos:f28',
  logos_social: 'site:logos:social',
} as const;

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_DIMENSION = 3200;
const WEBP_QUALITY = 90;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export async function POST(request: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await request.formData();
  const file = form.get('file') as File | null;
  const uploadType = (form.get('type') as string) || 'portfolio';
  const photographerId = form.get('photographerId') as string | null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File too large (max 50 MB)' }, { status: 413 });
  }

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
    return NextResponse.json({ error: 'Storage is not configured' }, { status: 500 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const optimized = await sharp(inputBuffer)
      .rotate()
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 60);
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    let blobPath: string;

    switch (uploadType) {
      case 'ai':      blobPath = `ai-images/${baseName}-${uniqueId}.webp`; break;
      case 'ai_portfolio': blobPath = `ai-portfolio/${baseName}-${uniqueId}.webp`; break;
      case 'preview': blobPath = `previews/${photographerId}-${baseName}-${uniqueId}.webp`; break;
      case 'landing': blobPath = `landing/${photographerId}-${baseName}-${uniqueId}.webp`; break;
      case 'logos':         blobPath = `logos/${baseName}-${uniqueId}.webp`; break;
      case 'logos_clients': blobPath = `logos/clients/${baseName}-${uniqueId}.webp`; break;
      case 'logos_partners':blobPath = `logos/partners/${baseName}-${uniqueId}.webp`; break;
      case 'logos_f28':     blobPath = `logos/f28/${baseName}-${uniqueId}.webp`; break;
      case 'logos_social':  blobPath = `logos/social/${baseName}-${uniqueId}.webp`; break;
      default: blobPath = `portfolios/${photographerId}/${baseName}-${uniqueId}.webp`;
    }

    const blob = await put(blobPath, optimized, { access: 'public', contentType: 'image/webp' });

    const redis = getRedis();
    let redisKey: string | undefined;
    let revalidatePaths: string[] = [];
    let updatedImages: string[] = [];

    switch (uploadType) {
      case 'ai':
        updatedImages = [...await getAiPoweredImages(), blob.url];
        await setAiPoweredImages(updatedImages);
        revalidatePaths.push('/ai-powered');
        break;
      case 'ai_portfolio': {
        const tagIdsRaw = form.get('tagIds') as string | null;
        let tagIds: string[] = [];
        if (tagIdsRaw) {
          try {
            const parsed = JSON.parse(tagIdsRaw);
            if (Array.isArray(parsed)) tagIds = parsed.filter((id) => typeof id === 'string');
          } catch {}
        }
        const portfolio = await getAiPoweredPortfolio();
        portfolio.items.push({ src: blob.url, tagIds });
        await setAiPoweredPortfolio(portfolio);
        revalidatePaths.push('/ai-powered/portfolio');
        break;
      }
      case 'preview':
        redisKey = REDIS_KEYS.preview;
        revalidatePaths.push('/production', '/portfolios');
        break;
      case 'landing':
        redisKey = REDIS_KEYS.landing;
        revalidatePaths.push('/', '/production', '/ai-powered');
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
        updatedImages = [...await getPhotographerImages(photographerId!), blob.url];
        await setPhotographerImages(photographerId!, updatedImages);
        revalidatePaths.push(`/${photographerId}`, '/production', '/portfolios');
    }

    if (redisKey && redis) {
      const current = await redis.get(redisKey) || [];
      updatedImages = [...(Array.isArray(current) ? current : []), blob.url];
      await redis.set(redisKey, JSON.stringify(updatedImages));
    }

    revalidatePaths.forEach(p => revalidatePath(p));

    return NextResponse.json({
      url: blob.url,
      originalSize: inputBuffer.length,
      optimizedSize: optimized.length,
      totalImages: updatedImages.length,
    });
  } catch (err) {
    console.error('[upload] failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { url, photographerId, type } = await request.json();
    const deleteType = type || 'portfolio';

    if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });
    if (['portfolio', 'preview', 'landing'].includes(deleteType) && !photographerId) {
      return NextResponse.json({ error: 'photographerId required for ' + deleteType }, { status: 400 });
    }

    if (url.includes('.blob.vercel-storage.com')) {
      try { await del(url); } catch (e) {
        console.warn('[upload/delete] blob del failed:', e);
      }
    }

    const redis = getRedis();
    let redisKey: string | undefined;
    let revalidatePaths: string[] = [];
    let updatedImages: string[] = [];

    switch (deleteType) {
      case 'ai':
        updatedImages = (await getAiPoweredImages()).filter(img => img !== url);
        await setAiPoweredImages(updatedImages);
        revalidatePaths.push('/ai-powered');
        break;
      case 'ai_portfolio': {
        const portfolio = await getAiPoweredPortfolio();
        portfolio.items = portfolio.items.filter((item) => item.src !== url);
        await setAiPoweredPortfolio(portfolio);
        revalidatePaths.push('/ai-powered/portfolio');
        break;
      }
      case 'preview':
        redisKey = REDIS_KEYS.preview;
        revalidatePaths.push('/production', '/portfolios');
        break;
      case 'landing':
        redisKey = REDIS_KEYS.landing;
        revalidatePaths.push('/', '/production', '/ai-powered');
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
        updatedImages = (await getPhotographerImages(photographerId)).filter(img => img !== url);
        await setPhotographerImages(photographerId, updatedImages);
        revalidatePaths.push(`/${photographerId}`, '/production', '/portfolios');
    }

    if (redisKey && redis) {
      const current = await redis.get(redisKey) || [];
      updatedImages = (Array.isArray(current) ? current : []).filter(img => img !== url);
      await redis.set(redisKey, JSON.stringify(updatedImages));
    }

    revalidatePaths.forEach(p => revalidatePath(p));

    return NextResponse.json({ success: true, totalImages: updatedImages.length });
  } catch (err) {
    console.error('[upload/delete] failed:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
