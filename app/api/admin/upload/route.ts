import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { put, del } from '@vercel/blob';
import sharp from 'sharp';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';
import { getPhotographerImages, setPhotographerImages, getAIImages, setAIImages } from '@/lib/db';
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
  if (uploadType !== 'ai' && !photographerId) return NextResponse.json({ error: 'No photographerId provided' }, { status: 400 });

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
    const folder = uploadType === 'ai' ? 'ai-images' : `portfolios/${photographerId}`;
    const blobPath = `${folder}/${baseName}-${uniqueId}.webp`;

    // Upload to Vercel Blob (public access — direct CDN URL)
    const blob = await put(blobPath, optimized, {
      access: 'public',
      contentType: 'image/webp',
    });

    // Append to the appropriate Redis image list
    let updatedImages: string[];
    if (uploadType === 'ai') {
      const currentImages = await getAIImages();
      updatedImages = [...currentImages, blob.url];
      await setAIImages(updatedImages);
      revalidatePath('/ai-based');
    } else {
      const currentImages = await getPhotographerImages(photographerId!);
      updatedImages = [...currentImages, blob.url];
      await setPhotographerImages(photographerId!, updatedImages);
      revalidatePath(`/${photographerId}`);
      revalidatePath('/production');
      revalidatePath('/portfolios');
    }

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
    if (deleteType !== 'ai' && !photographerId) {
      return NextResponse.json({ error: 'photographerId required for portfolio images' }, { status: 400 });
    }

    // Delete from Vercel Blob (only if it's a blob URL)
    if (url.includes('.blob.vercel-storage.com')) {
      try {
        await del(url);
      } catch (e) {
        console.warn('[upload/delete] blob del failed (may already be deleted):', e);
      }
    }

    // Remove from the appropriate Redis image list
    let updatedImages: string[];
    if (deleteType === 'ai') {
      const currentImages = await getAIImages();
      updatedImages = currentImages.filter(img => img !== url);
      await setAIImages(updatedImages);
      revalidatePath('/ai-based');
    } else {
      const currentImages = await getPhotographerImages(photographerId);
      updatedImages = currentImages.filter(img => img !== url);
      await setPhotographerImages(photographerId, updatedImages);
      revalidatePath(`/${photographerId}`);
      revalidatePath('/production');
      revalidatePath('/portfolios');
    }

    return NextResponse.json({ success: true, totalImages: updatedImages.length });
  } catch (err) {
    console.error('[upload/delete] failed:', err);
    return NextResponse.json({ error: (err as Error).message ?? 'Delete failed' }, { status: 500 });
  }
}
