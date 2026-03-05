/**
 * Migrate all public images to Vercel Blob storage.
 *
 * Usage:  npx tsx scripts/migrate-to-blob.ts
 *
 * Requires .env.local with:
 *   BLOB_READ_WRITE_TOKEN
 *   KV_REST_API_URL + KV_REST_API_TOKEN  (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';
import { Redis } from '@upstash/redis';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const CONCURRENCY = 6; // parallel uploads
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// ── Redis ──────────────────────────────────────────────────────────────────
function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('Redis env vars not set');
  return new Redis({ url, token });
}

// ── Helpers ────────────────────────────────────────────────────────────────
function collectImages(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectImages(full));
    } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      const stats = fs.statSync(full);
      if (stats.size > 1024) results.push(full); // skip tiny placeholders
    }
  }
  return results;
}

function localPath(absPath: string): string {
  // /portfolios/batuhan-becel/img.webp
  return '/' + path.relative(PUBLIC_DIR, absPath).replace(/\\/g, '/');
}

async function uploadFile(absPath: string): Promise<{ local: string; blob: string }> {
  const local = localPath(absPath);
  const blobPath = local.replace(/^\//, ''); // strip leading /
  const file = fs.readFileSync(absPath);
  const ext = path.extname(absPath).toLowerCase();
  const contentType =
    ext === '.webp' ? 'image/webp' :
    ext === '.png' ? 'image/png' :
    'image/jpeg';

  const blob = await put(blobPath, file, {
    access: 'private',
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  // Private store: use proxy URL for browser access
  const proxyUrl = `/api/blob?u=${encodeURIComponent(blob.url)}`;
  return { local, blob: proxyUrl };
}

async function runBatch<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    process.stdout.write(`\r  ${Math.min(i + concurrency, items.length)} / ${items.length}`);
  }
  process.stdout.write('\n');
  return results;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN not set. Run: vercel env pull .env.local');
    process.exit(1);
  }

  console.log('📦 Collecting images from public/ ...');

  const portfolioImages = collectImages(path.join(PUBLIC_DIR, 'portfolios'));
  const aiImages = collectImages(path.join(PUBLIC_DIR, 'ai-images'));
  const allImages = [...portfolioImages, ...aiImages];

  console.log(`   ${portfolioImages.length} portfolio images (incl. previews)`);
  console.log(`   ${aiImages.length} AI images`);
  console.log(`   ${allImages.length} total\n`);

  // Upload all
  console.log('☁️  Uploading to Vercel Blob ...');
  const mapping: { local: string; blob: string }[] = [];
  let failed = 0;

  const results = await runBatch(allImages, CONCURRENCY, async (absPath) => {
    try {
      return await uploadFile(absPath);
    } catch (err) {
      failed++;
      console.error(`\n   ❌ Failed: ${localPath(absPath)} — ${(err as Error).message}`);
      return { local: localPath(absPath), blob: '' };
    }
  });

  for (const r of results) {
    if (r.blob) mapping.push(r);
  }

  console.log(`\n✅ Uploaded ${mapping.length} images (${failed} failed)\n`);

  // Build lookup: local path → blob URL
  const urlMap = new Map<string, string>();
  for (const { local, blob } of mapping) {
    urlMap.set(local, blob);
  }

  // Update Redis
  console.log('🔄 Updating Redis ...');
  const redis = getRedis();

  // 1. Update photographer image lists
  const photographerDirs = fs.readdirSync(path.join(PUBLIC_DIR, 'portfolios'), { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== 'previews')
    .map(d => d.name);

  for (const id of photographerDirs) {
    const key = `photographer:${id}:images`;
    let existing: string[] = [];
    try {
      const stored = await redis.get(key);
      if (stored && Array.isArray(stored)) existing = stored as string[];
    } catch {}

    if (existing.length > 0) {
      // Map existing local paths to blob URLs
      const updated = existing.map(img => urlMap.get(img) ?? img);
      await redis.set(key, JSON.stringify(updated));
      console.log(`   ✓ ${id}: ${updated.length} images`);
    } else {
      // No Redis entry — build from filesystem
      const localImages = collectImages(path.join(PUBLIC_DIR, 'portfolios', id))
        .map(localPath)
        .sort();
      const blobImages = localImages.map(p => urlMap.get(p) ?? p);
      if (blobImages.length > 0) {
        await redis.set(key, JSON.stringify(blobImages));
        console.log(`   ✓ ${id}: ${blobImages.length} images (new)`);
      }
    }
  }

  // 2. Update AI images
  {
    let existing: string[] = [];
    try {
      const stored = await redis.get('ai:images');
      if (stored && Array.isArray(stored)) existing = stored as string[];
    } catch {}

    if (existing.length > 0) {
      const updated = existing.map(img => urlMap.get(img) ?? img);
      await redis.set('ai:images', JSON.stringify(updated));
      console.log(`   ✓ ai-images: ${updated.length} images`);
    } else {
      const localAI = aiImages.map(localPath).sort();
      const blobAI = localAI.map(p => urlMap.get(p) ?? p);
      if (blobAI.length > 0) {
        await redis.set('ai:images', JSON.stringify(blobAI));
        console.log(`   ✓ ai-images: ${blobAI.length} images (new)`);
      }
    }
  }

  // 3. Update photographer preview URLs
  {
    let photographers: any[] = [];
    try {
      const stored = await redis.get('photographers');
      if (stored && Array.isArray(stored)) photographers = stored as any[];
    } catch {}

    if (photographers.length > 0) {
      let changed = 0;
      for (const p of photographers) {
        const newPreview = urlMap.get(p.preview);
        if (newPreview) {
          p.preview = newPreview;
          changed++;
        }
      }
      if (changed > 0) {
        await redis.set('photographers', JSON.stringify(photographers));
        console.log(`   ✓ photographers: ${changed} preview URLs updated`);
      }
    }
  }

  console.log('\n🎉 Migration complete!');
  console.log(`   ${mapping.length} images now served from Vercel Blob`);
  console.log('   Run: vercel --prod to deploy\n');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
