#!/usr/bin/env node
/**
 * Faz 2 — Photographers + portfolio images migration.
 *
 * Source:
 *   - Static list: lib/data.ts (compiled JSON-like list inlined below)
 *   - Redis override: `photographers` key (full Photographer[] override)
 *   - Per-photographer images: `photographer:<id>:images` key (array of URLs)
 *   - Preview override: `site:preview` (array of URLs)
 *
 * Target: Sanity dataset (one `photographer` document per person)
 *
 * Run:
 *   node scripts/migrate-photographers-to-sanity.mjs
 *   node scripts/migrate-photographers-to-sanity.mjs --dry-run
 *   node scripts/migrate-photographers-to-sanity.mjs --only=ozan-cakmak
 */

import { createClient } from '@sanity/client';
import { Redis } from '@upstash/redis';
import { LexoRank } from 'lexorank';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

dotenv.config({ path: path.join(ROOT, '.env.local') });

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const ONLY = [...args].find((a) => a.startsWith('--only='))?.split('=')[1];

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) die('NEXT_PUBLIC_SANITY_PROJECT_ID not set in .env.local');
if (!writeToken && !DRY_RUN) die('SANITY_API_WRITE_TOKEN not set in .env.local');

const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token: writeToken,
  useCdn: false,
});

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

// Mirror of lib/data.ts — kept in sync manually since scripts/ is excluded from tsconfig.
const STATIC_PHOTOGRAPHERS = [
  { id: 'ozan-cakmak', name: 'Ozan', fullName: 'OZAN ÇAKMAK', title: 'PHOTOGRAPHER', preview: '/portfolios/previews/ozan-cakmak.webp', tags: ['commercial', 'portrait', 'fashion'] },
  { id: 'emre-yunusoglu', name: 'Emre', fullName: 'EMRE YUNUSOĞLU', title: 'PHOTOGRAPHER', preview: '/portfolios/previews/emre-yunusoglu.webp', tags: ['commercial', 'portrait', 'lifestyle'] },
  { id: 'berkin-metin', name: 'Berkin', fullName: 'BERKİN METİN', title: 'PHOTOGRAPHER', preview: '/portfolios/previews/berkin-metin.webp', tags: ['fashion', 'editorial', 'portrait'] },
  { id: 'yonca-muslubas', name: 'Yonca', fullName: 'YONCA MUSLUBAŞ', title: 'PHOTOGRAPHER', preview: '/portfolios/previews/yonca-muslubas.webp', tags: ['fashion', 'beauty', 'editorial'] },
  { id: 'haldun-kirkbir', name: 'Haldun', fullName: 'HALDUN KIRKBİR', title: 'PHOTOGRAPHER', preview: '/portfolios/previews/haldun-kirkbir.webp', tags: ['commercial', 'portrait'] },
  { id: 'omur-temel', name: 'Ömür', fullName: 'ÖMÜR TEMEL', title: 'PHOTOGRAPHER', preview: '/portfolios/previews/omur-temel.webp', tags: ['commercial', 'product', 'lifestyle'] },
  { id: 'kerem-cakmak', name: 'Kerem', fullName: 'KEREM ÇAKMAK', title: 'RETOUCHER', preview: '/portfolios/previews/kerem-cakmak.webp', tags: ['beauty', 'fashion', 'portrait'] },
  { id: 'dogu-biricik', name: 'Doğu', fullName: 'DOĞU BİRİCİK', title: 'RETOUCHER', preview: '/portfolios/previews/dogu-biricik.webp', tags: ['commercial', 'beauty', 'product'] },
  { id: 'batuhan-becel', name: 'Batuhan', fullName: 'BATUHAN BECEL', title: 'RETOUCHER', preview: '/portfolios/previews/batuhan-becel.jpg', tags: ['portrait', 'beauty', 'editorial'] },
];

async function main() {
  log(`Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);
  log(`Sanity: projectId=${projectId} dataset=${dataset}`);
  log(`Redis:  ${redis ? 'connected' : 'not configured (will use static list only)'}`);

  const photographers = await loadPhotographers();
  const filtered = ONLY ? photographers.filter((p) => p.id === ONLY) : photographers;
  if (ONLY && filtered.length === 0) die(`No photographer matched --only=${ONLY}`);

  log(`\nPhotographers to migrate: ${filtered.length}`);

  // Generate LexoRank values for orderable-document-list plugin.
  // Match plugin's spacing convention: rank = prev.genNext().genNext()
  const ranks = [];
  let rank = LexoRank.min();
  for (let i = 0; i < filtered.length; i++) {
    rank = rank.genNext().genNext();
    ranks.push(rank.toString());
  }

  for (const [i, p] of filtered.entries()) {
    log(`\n[${i + 1}/${filtered.length}] ${p.fullName} (${p.id})`);
    await migrateOne(p, ranks[i]);
  }

  log('\n✅ Done.');
}

async function loadPhotographers() {
  let list = STATIC_PHOTOGRAPHERS;

  if (redis) {
    try {
      const override = await redis.get('photographers');
      if (Array.isArray(override) && override.length > 0) {
        log('Using Redis override for photographer list.');
        list = override;
      }
    } catch (e) {
      log(`Redis photographers fetch failed: ${e.message}`);
    }

    try {
      const previewUrls = await redis.get('site:preview');
      if (Array.isArray(previewUrls) && previewUrls.length > 0) {
        list = list.map((p) => {
          if (p.preview?.includes('.blob.vercel-storage.com')) return p;
          const match = previewUrls.find((u) => typeof u === 'string' && u.includes(p.id));
          return match ? { ...p, preview: match } : p;
        });
      }
    } catch {}
  }

  return list;
}

async function migrateOne(p, orderRank) {
  // 1. Preview image
  const previewAsset = await uploadFromSource(p.preview, `preview-${p.id}`);
  if (!previewAsset) {
    log(`  ⚠️  Skipping ${p.id} — preview image could not be loaded.`);
    return;
  }

  // 2. Portfolio images
  const portfolioUrls = await loadPortfolioUrls(p.id);
  log(`  Portfolio images: ${portfolioUrls.length}`);

  const portfolioAssets = [];
  for (const [i, url] of portfolioUrls.entries()) {
    process.stdout.write(`\r  Uploading ${i + 1}/${portfolioUrls.length}... `);
    const asset = await uploadFromSource(url, `${p.id}-${i + 1}`);
    if (asset) portfolioAssets.push({ ...asset, _key: keyFor(p.id, i) });
  }
  if (portfolioUrls.length > 0) process.stdout.write('\n');

  // 3. Document upsert
  const docId = `photographer-${p.id}`;
  const doc = {
    _id: docId,
    _type: 'photographer',
    orderRank,
    slug: { _type: 'slug', current: p.id },
    name: p.name,
    fullName: p.fullName,
    title: p.title,
    tags: p.tags ?? [],
    preview: previewAsset,
    portfolioImages: portfolioAssets,
    bio: p.bio ?? { en: '', tr: '' },
    instagram: p.instagram ?? null,
    website: p.website ?? null,
  };

  if (DRY_RUN) {
    log(`  [dry] Would upsert ${docId} with ${portfolioAssets.length} portfolio images`);
    return;
  }

  await sanity.createOrReplace(doc);
  log(`  ✓ Upserted ${docId}`);
}

async function loadPortfolioUrls(photographerId) {
  if (!redis) return [];
  try {
    const stored = await redis.get(`photographer:${photographerId}:images`);
    if (Array.isArray(stored)) return stored.filter((s) => typeof s === 'string');
  } catch {}
  return [];
}

async function uploadFromSource(source, hint) {
  if (!source || typeof source !== 'string') return null;

  try {
    let buffer;
    let filename;

    if (source.startsWith('http://') || source.startsWith('https://')) {
      const res = await fetch(source);
      if (!res.ok) {
        log(`  ⚠️  Fetch failed (${res.status}) for ${source}`);
        return null;
      }
      buffer = Buffer.from(await res.arrayBuffer());
      const pathname = new URL(source).pathname;
      filename = path.basename(pathname) || `${hint}.webp`;
    } else {
      const localPath = path.join(ROOT, 'public', source.replace(/^\/+/, ''));
      if (!fs.existsSync(localPath)) {
        log(`  ⚠️  Local file missing: ${localPath}`);
        return null;
      }
      buffer = fs.readFileSync(localPath);
      filename = path.basename(localPath);
    }

    if (DRY_RUN) {
      return { _type: 'image', asset: { _type: 'reference', _ref: `image-dryrun-${hint}` } };
    }

    const asset = await sanity.assets.upload('image', buffer, { filename });
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  } catch (e) {
    log(`  ⚠️  Upload failed for ${source}: ${e.message}`);
    return null;
  }
}

function keyFor(photographerId, index) {
  return `${photographerId}-${index}-${Math.random().toString(36).slice(2, 8)}`;
}

function log(...m) {
  console.log(...m);
}

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
