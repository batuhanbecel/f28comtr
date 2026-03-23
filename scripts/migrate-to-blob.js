/**
 * Migration script: Upload all local portfolio images to Vercel Blob
 * and update Redis with blob URLs, preserving existing order.
 *
 * Usage: node scripts/migrate-to-blob.js
 * Requires: .env.local with BLOB_READ_WRITE_TOKEN, KV_REST_API_URL, KV_REST_API_TOKEN
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=["']?(.+?)["']?\s*$/);
  if (match) process.env[match[1].trim()] = match[2];
});

const { put } = require('@vercel/blob');
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MAX_DIMENSION = 2400;
const WEBP_QUALITY = 82;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// Photographer IDs (from data.ts)
const PHOTOGRAPHERS = [
  'ozan-cakmak',
  'emre-yunusoglu',
  'berkin-metin',
  'yonca-muslubas',
  'haldun-kirkbir',
  'omur-temel',
  'kerem-cakmak',
  'dogu-biricik',
  'batuhan-becel',
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function optimizeAndUpload(localPath, photographerId) {
  // localPath is like /portfolios/batuhan-becel/image.webp
  // Decode URL-encoded characters for filesystem access
  const decodedPath = decodeURIComponent(localPath);
  const filePath = path.join(PUBLIC_DIR, decodedPath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const inputBuffer = fs.readFileSync(filePath);

  // Optimize with Sharp
  const optimized = await sharp(inputBuffer)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  // Generate blob path from original filename
  const fileName = path.basename(decodedPath).replace(/\.[^.]+$/, '');
  const safeName = fileName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 60);
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const blobPath = `portfolios/${photographerId}/${safeName}-${uniqueId}.webp`;

  const blob = await put(blobPath, optimized, {
    access: 'public',
    contentType: 'image/webp',
    token: BLOB_TOKEN,
  });

  return {
    url: blob.url,
    originalSize: inputBuffer.length,
    optimizedSize: optimized.length,
  };
}

async function migratePhotographer(photographerId) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Migrating: ${photographerId}`);
  console.log('='.repeat(60));

  // Get current image list from Redis
  let images = [];
  try {
    const stored = await redis.get(`photographer:${photographerId}:images`);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      images = stored;
    }
  } catch (e) {
    console.log(`  No Redis data, checking manifest...`);
  }

  // If no Redis data, try to load from manifest
  if (images.length === 0) {
    try {
      // Read manifest file and extract this photographer's images
      const manifestPath = path.join(__dirname, '..', 'lib', 'image-manifest.ts');
      const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
      const regex = new RegExp(`"${photographerId}":\\s*\\[([^\\]]+)\\]`, 's');
      const match = manifestContent.match(regex);
      if (match) {
        images = match[1].match(/"([^"]+)"/g).map(s => s.replace(/"/g, ''));
      }
    } catch (e) {
      console.log(`  Could not read manifest: ${e.message}`);
    }
  }

  if (images.length === 0) {
    console.log(`  No images found, skipping.`);
    return { uploaded: 0, skipped: 0, failed: 0, saved: 0 };
  }

  console.log(`  Found ${images.length} images in current order`);

  const newImages = [];
  let uploaded = 0, skipped = 0, failed = 0, totalSaved = 0;

  for (let i = 0; i < images.length; i++) {
    const imgPath = images[i];

    // Skip if already a blob URL
    if (imgPath.includes('.blob.vercel-storage.com') || imgPath.startsWith('/api/blob')) {
      newImages.push(imgPath);
      skipped++;
      continue;
    }

    try {
      const result = await optimizeAndUpload(imgPath, photographerId);
      newImages.push(result.url);
      uploaded++;
      const saved = result.originalSize - result.optimizedSize;
      totalSaved += Math.max(0, saved);

      const progress = `[${i + 1}/${images.length}]`;
      const sizeInfo = `${(result.originalSize / 1024).toFixed(0)}KB → ${(result.optimizedSize / 1024).toFixed(0)}KB`;
      console.log(`  ${progress} ✓ ${path.basename(decodeURIComponent(imgPath))} (${sizeInfo})`);

      // Small delay to avoid rate limiting
      if (uploaded % 10 === 0) await sleep(200);
    } catch (err) {
      console.error(`  [${i + 1}/${images.length}] ✕ ${imgPath}: ${err.message}`);
      // Keep the original path so we don't lose the image reference
      newImages.push(imgPath);
      failed++;
    }
  }

  // Save updated image list to Redis
  if (uploaded > 0) {
    await redis.set(`photographer:${photographerId}:images`, JSON.stringify(newImages));
    console.log(`  ✓ Redis updated with ${newImages.length} images (${uploaded} new blob URLs)`);
  }

  console.log(`  Summary: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed, ${(totalSaved / 1024 / 1024).toFixed(1)}MB saved`);

  return { uploaded, skipped, failed, saved: totalSaved };
}

async function main() {
  console.log('Portfolio Migration: Local Files → Vercel Blob');
  console.log(`Blob store: public`);
  console.log(`Sharp: max ${MAX_DIMENSION}px, WebP quality ${WEBP_QUALITY}`);
  console.log(`Photographers: ${PHOTOGRAPHERS.length}`);

  if (!BLOB_TOKEN) {
    console.error('ERROR: BLOB_READ_WRITE_TOKEN not found in .env.local');
    process.exit(1);
  }

  const totals = { uploaded: 0, skipped: 0, failed: 0, saved: 0 };

  for (const id of PHOTOGRAPHERS) {
    const result = await migratePhotographer(id);
    totals.uploaded += result.uploaded;
    totals.skipped += result.skipped;
    totals.failed += result.failed;
    totals.saved += result.saved;
  }

  console.log('\n' + '='.repeat(60));
  console.log('MIGRATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`  Total uploaded:  ${totals.uploaded}`);
  console.log(`  Total skipped:   ${totals.skipped}`);
  console.log(`  Total failed:    ${totals.failed}`);
  console.log(`  Total saved:     ${(totals.saved / 1024 / 1024).toFixed(1)}MB`);

  if (totals.failed > 0) {
    console.log('\n⚠️  Some images failed. They still reference local paths in Redis.');
    console.log('   Re-run this script to retry failed images.');
  } else {
    console.log('\n✅ All images migrated to Vercel Blob.');
    console.log('   You can now safely delete /public/portfolios/{photographer}/ image files.');
    console.log('   Keep /public/portfolios/previews/ — those are still used for photographer cards.');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
