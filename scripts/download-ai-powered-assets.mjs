#!/usr/bin/env node
/**
 * Download all AI Powered images from Sanity CDN to disk.
 *
 *   works/     → aiPoweredCollection.works[].images (legacy single image included)
 *   portfolio/ → aiPortfolioItem gallery images
 *
 * Run:
 *   node scripts/download-ai-powered-assets.mjs
 *   node scripts/download-ai-powered-assets.mjs --dry-run
 *   node scripts/download-ai-powered-assets.mjs --out ./my-backup
 */

import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

dotenv.config({ path: path.join(ROOT, '.env.local') });

const DRY_RUN = process.argv.includes('--dry-run');
const outArg = process.argv.find((a) => a.startsWith('--out='));
const OUT_ROOT = path.resolve(
  ROOT,
  outArg ? outArg.slice('--out='.length) : 'downloads/ai-powered',
);

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token =
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN ||
  undefined;

if (!projectId) die('NEXT_PUBLIC_SANITY_PROJECT_ID not set in .env.local');

const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

const WORKS_QUERY = `*[_id == "aiPoweredCollection"][0]{
  works[]{
    "slug": coalesce(slug.current, _key),
    brand,
    "images": select(
      count(images) > 0 => images[]{
        "url": asset->url,
        "filename": asset->originalFilename,
        "ext": asset->extension
      },
      defined(image.asset) => [{
        "url": image.asset->url,
        "filename": image.asset->originalFilename,
        "ext": image.asset->extension
      }],
      []
    )
  }
}.works`;

const PORTFOLIO_QUERY = `*[_type == "aiPortfolioItem"] | order(orderRank asc) {
  _id,
  "url": image.asset->url,
  "filename": image.asset->originalFilename,
  "ext": image.asset->extension
}`;

function die(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

function log(msg) {
  console.log(msg);
}

function sanitizeSegment(value, fallback) {
  const s = String(value ?? '')
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
  return (s || fallback).slice(0, 80);
}

function extFromAsset(img) {
  if (typeof img.ext === 'string' && img.ext.length > 0) {
    return img.ext.startsWith('.') ? img.ext : `.${img.ext}`;
  }
  try {
    const u = new URL(img.url);
    const m = u.pathname.match(/\.([a-z0-9]+)$/i);
    if (m) return `.${m[1].toLowerCase()}`;
  } catch {
    /* ignore */
  }
  return '.jpg';
}

function baseName(img, index) {
  const raw = typeof img.filename === 'string' ? img.filename : '';
  const stem = sanitizeSegment(
    raw.replace(/\.[^.]+$/, '') || `image-${String(index + 1).padStart(2, '0')}`,
    `image-${String(index + 1).padStart(2, '0')}`,
  );
  return stem;
}

async function downloadFile(url, destPath) {
  if (DRY_RUN) {
    log(`  [dry] ${destPath}`);
    return;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
  await fs.promises.writeFile(destPath, buf);
  log(`  ✓ ${path.relative(OUT_ROOT, destPath)} (${(buf.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  log(`Mode:     ${DRY_RUN ? 'DRY RUN' : 'DOWNLOAD'}`);
  log(`Sanity:   ${projectId} / ${dataset}`);
  log(`Output:   ${OUT_ROOT}\n`);

  if (!DRY_RUN) {
    await fs.promises.mkdir(OUT_ROOT, { recursive: true });
  }

  const worksDir = path.join(OUT_ROOT, 'works');
  const portfolioDir = path.join(OUT_ROOT, 'portfolio');

  let workFiles = 0;
  let portfolioFiles = 0;

  log('━━━ Çalışmalar (works) ━━━');
  const works = (await sanity.fetch(WORKS_QUERY)) ?? [];
  for (const work of works) {
    const images = Array.isArray(work?.images) ? work.images : [];
    const urls = images.filter((i) => typeof i?.url === 'string' && i.url.length > 0);
    if (urls.length === 0) continue;

    const folder = sanitizeSegment(work.slug, sanitizeSegment(work.brand, 'work'));
    const dir = path.join(worksDir, folder);
    log(`\n${folder} (${urls.length} görsel)`);

    for (let i = 0; i < urls.length; i++) {
      const img = urls[i];
      const ext = extFromAsset(img);
      const name = `${String(i + 1).padStart(2, '0')}-${baseName(img, i)}${ext}`;
      const dest = path.join(dir, name);
      try {
        await downloadFile(img.url, dest);
        workFiles += 1;
      } catch (e) {
        log(`  ✗ ${name}: ${e.message}`);
      }
    }
  }

  log('\n━━━ Portfolyo (aiPortfolioItem) ━━━');
  const portfolio = (await sanity.fetch(PORTFOLIO_QUERY)) ?? [];
  log(`${portfolio.length} öğe\n`);

  for (let i = 0; i < portfolio.length; i++) {
    const item = portfolio[i];
    if (typeof item?.url !== 'string' || item.url.length === 0) continue;
    const ext = extFromAsset(item);
    const name = `${String(i + 1).padStart(3, '0')}-${baseName(item, i)}${ext}`;
    const dest = path.join(portfolioDir, name);
    try {
      await downloadFile(item.url, dest);
      portfolioFiles += 1;
    } catch (e) {
      log(`  ✗ ${name}: ${e.message}`);
    }
  }

  const manifest = {
    downloadedAt: new Date().toISOString(),
    dataset,
    projectId,
    counts: { works: workFiles, portfolio: portfolioFiles, total: workFiles + portfolioFiles },
    paths: { works: 'works/<slug>/', portfolio: 'portfolio/' },
  };

  if (!DRY_RUN) {
    await fs.promises.writeFile(
      path.join(OUT_ROOT, 'manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
      'utf8',
    );
  }

  log(`\n✅ Bitti — ${workFiles} çalışma görseli, ${portfolioFiles} portfolyo görseli.`);
  if (!DRY_RUN) log(`   ${OUT_ROOT}`);
}

main().catch((e) => die(e.message));
