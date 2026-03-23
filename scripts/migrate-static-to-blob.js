#!/usr/bin/env node

// Migrate static assets (previews, landing, logos) to Vercel Blob
// Usage: node scripts/migrate-static-to-blob.js

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');
const sharp = require('sharp');
const { Redis } = require('@upstash/redis');

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=[""']?(.+?)[""']?\s*$/);
    if (match) process.env[match[1].trim()] = match[2];
  });
}

// ── Config ──────────────────────────────────────────────────────────────────
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const MAX_DIMENSION = 2400;
const WEBP_QUALITY = 82;

// Redis keys for different asset types
const REDIS_KEYS = {
  preview: 'site:preview',
  landing: 'site:landing',
  logos_clients: 'site:logos:clients',
  logos_partners: 'site:logos:partners',
  logos_f28: 'site:logos:f28',
  logos_social: 'site:logos:social',
};

// Asset categories to migrate
const ASSET_CATEGORIES = [
  {
    key: 'preview',
    localDir: 'portfolios/previews',
    redisKey: REDIS_KEYS.preview,
    description: 'Photographer previews'
  },
  {
    key: 'landing',
    localDir: '', // root of public for landing-*.webp
    redisKey: REDIS_KEYS.landing,
    description: 'Landing hero images',
    pattern: /^landing-\d+\.webp$/
  },
  {
    key: 'logos_clients',
    localDir: 'logos/brands/clients',
    redisKey: REDIS_KEYS.logos_clients,
    description: 'Client logos'
  },
  {
    key: 'logos_partners',
    localDir: 'logos/brands/partners',
    redisKey: REDIS_KEYS.logos_partners,
    description: 'Partner logos'
  },
  {
    key: 'logos_f28',
    localDir: 'logos/f28',
    redisKey: REDIS_KEYS.logos_f28,
    description: 'F/28 logos'
  },
  {
    key: 'logos_social',
    localDir: 'logos/social',
    redisKey: REDIS_KEYS.logos_social,
    description: 'Social icons'
  }
];

// ── Redis ──────────────────────────────────────────────────────────────────
function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

// ── Image Processing ───────────────────────────────────────────────────────
async function optimizeImage(buffer) {
  return await sharp(buffer)
    .rotate() // auto-rotate based on EXIF
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

// ── Migration ────────────────────────────────────────────────────────────
async function migrateCategory(category) {
  const redis = getRedis();
  const categoryPath = path.join(PUBLIC_DIR, category.localDir);
  let files = [];

  if (category.key === 'landing') {
    // Special handling for landing images in root public dir
    const allFiles = fs.readdirSync(PUBLIC_DIR);
    files = allFiles.filter(file => category.pattern.test(file));
  } else if (fs.existsSync(categoryPath)) {
    files = fs.readdirSync(categoryPath);
  }

  if (files.length === 0) {
    console.log(`✓ ${category.description}: No files found`);
    return { uploaded: 0, skipped: 0, failed: 0 };
  }

  console.log(`\n============================================================`);
  console.log(`Migrating: ${category.description}`);
  console.log(`============================================================`);
  console.log(`  Found ${files.length} files`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  let totalSizeSaved = 0;

  // Get current images from Redis
  const currentImages = await redis.get(category.redisKey) || [];
  const currentUrls = Array.isArray(currentImages) ? currentImages : [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = category.key === 'landing' 
      ? path.join(PUBLIC_DIR, file)
      : path.join(categoryPath, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`  [${i + 1}/${files.length}] ✗ ${file} (file not found)`);
      failed++;
      continue;
    }

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const originalSize = fileBuffer.length;

      // Optimize image
      const optimized = await optimizeImage(fileBuffer);
      const sizeSaved = originalSize - optimized.length;
      totalSizeSaved += sizeSaved;

      // Generate blob path
      const baseName = file.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 60);
      const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      
      let blobPath;
      if (category.key === 'preview') {
        const photographerId = baseName.replace(/_preview$/, '');
        blobPath = `previews/${photographerId}-${uniqueId}.webp`;
      } else if (category.key === 'landing') {
        blobPath = `landing/${baseName}-${uniqueId}.webp`;
      } else {
        blobPath = `${category.localDir}/${baseName}-${uniqueId}.webp`;
      }

      // Upload to Vercel Blob
      const blob = await put(blobPath, optimized, {
        access: 'public',
        contentType: 'image/webp',
      });

      // Add to Redis
      const updatedUrls = [...currentUrls, blob.url];
      await redis.set(category.redisKey, JSON.stringify(updatedUrls));

      uploaded++;
      console.log(`  [${i + 1}/${files.length}] ✓ ${file} (${(originalSize/1024).toFixed(0)}KB → ${(optimized.length/1024).toFixed(0)}KB)`);
    } catch (error) {
      failed++;
      console.log(`  [${i + 1}/${files.length}] ✗ ${file} (${error.message})`);
    }
  }

  const summary = `Summary: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed, ${(totalSizeSaved/1024/1024).toFixed(1)}MB saved`;
  console.log(`  ${summary}`);

  return { uploaded, skipped, failed, totalSizeSaved };
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Starting static assets migration to Vercel Blob...\n');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN environment variable is required');
    process.exit(1);
  }

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error('❌ Redis environment variables are required');
    process.exit(1);
  }

  const results = {
    totalUploaded: 0,
    totalSkipped: 0,
    totalFailed: 0,
    totalSizeSaved: 0,
  };

  for (const category of ASSET_CATEGORIES) {
    const result = await migrateCategory(category);
    results.totalUploaded += result.uploaded;
    results.totalSkipped += result.skipped;
    results.totalFailed += result.failed;
    results.totalSizeSaved += result.totalSizeSaved;
  }

  console.log(`\n============================================================`);
  console.log('MIGRATION COMPLETE');
  console.log(`============================================================`);
  console.log(`  Total uploaded:  ${results.totalUploaded}`);
  console.log(`  Total skipped:   ${results.totalSkipped}`);
  console.log(`  Total failed:    ${results.totalFailed}`);
  console.log(`  Total saved:     ${(results.totalSizeSaved/1024/1024).toFixed(1)}MB`);

  if (results.totalUploaded > 0) {
    console.log(`\n✅ All static assets migrated to Vercel Blob.`);
    console.log(`   You can now safely delete local asset folders:`);
    console.log(`   - /public/portfolios/previews/`);
    console.log(`   - /public/landing-*.webp`);
    console.log(`   - /public/logos/`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
