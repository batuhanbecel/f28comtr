#!/usr/bin/env node
/**
 * Faz 3 (revised) — AI-powered migration.
 *
 *   Works   → singleton "aiPoweredCollection" doc with `works` array (grid layout)
 *   Portfolio
 *     Tags  → individual aiPortfolioTag docs
 *     Items → individual aiPortfolioItem docs (orderable)
 *
 * Sources (Redis):
 *   - `ai:works` → AiPoweredWork[]
 *   - `ai:images` (legacy) → fallback work array
 *   - `ai:portfolio` → { tags, items }
 *
 * Also cleans up orphan aiPoweredWork docs from the previous schema.
 *
 * Run:
 *   node scripts/migrate-ai-powered-to-sanity.mjs
 *   node scripts/migrate-ai-powered-to-sanity.mjs --dry-run
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

const DRY_RUN = process.argv.includes('--dry-run');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) die('NEXT_PUBLIC_SANITY_PROJECT_ID not set');
if (!writeToken && !DRY_RUN) die('SANITY_API_WRITE_TOKEN not set');

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

function deriveSlug(s) {
  return (
    String(s ?? '')
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'tag'
  );
}

async function main() {
  log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  log(`Sanity: projectId=${projectId} dataset=${dataset}`);
  log(`Redis:  ${redis ? 'connected' : 'not configured'}\n`);

  await cleanupOldWorkDocs();
  await migrateWorksAsSingleton();
  await migratePortfolio();

  log('\n✅ Done.');
}

// ── Cleanup: drop legacy aiPoweredWork + aiPortfolioTag docs ───────────────
async function cleanupOldWorkDocs() {
  log('━━━ Cleanup ━━━');
  for (const type of ['aiPoweredWork', 'aiPortfolioTag']) {
    try {
      const old = await sanity.fetch(`*[_type == $type]{ _id }`, { type });
      if (old.length === 0) {
        log(`No orphan ${type} docs.`);
        continue;
      }
      log(`Found ${old.length} orphan ${type} doc(s).`);
      if (DRY_RUN) {
        log(`  [dry] Would delete ${old.length} ${type} doc(s)`);
        continue;
      }
      const tx = sanity.transaction();
      for (const d of old) tx.delete(d._id);
      await tx.commit();
      log(`  ✓ Deleted ${old.length} ${type} doc(s).`);
    } catch (e) {
      log(`  ⚠️  Cleanup skipped for ${type}: ${e.message}`);
    }
  }
}

// ── AI Powered Works → singleton ────────────────────────────────────────────
async function migrateWorksAsSingleton() {
  log('━━━ AI Powered Works (singleton) ━━━');
  const works = await loadWorks();
  if (works.length === 0) {
    log('No AI works to migrate.\n');
    return;
  }
  log(`Found ${works.length} work(s).\n`);

  const aggregated = [];
  for (const [i, w] of works.entries()) {
    process.stdout.write(`\r  Uploading ${i + 1}/${works.length}... `);
    const asset = await uploadFromSource(w.imageSrc, `ai-work-${w.id}`);
    if (!asset) {
      log(`\n  ⚠️  ${w.brand} skipped (image load failed).`);
      continue;
    }
    const slugSource = w.title || w.brand || `work-${i}`;
    const slug = `${deriveSlug(slugSource)}-${i}`;
    aggregated.push({
      _type: 'aiPoweredWork',
      _key: `work-${i}-${Math.random().toString(36).slice(2, 8)}`,
      slug: { _type: 'slug', current: slug },
      brand: w.brand,
      brandKey: w.brandKey,
      title: w.title || '',
      description: w.description || '',
      category: w.category || 'visual',
      image: asset,
      imageAlt: w.imageAlt || '',
      year: w.year ?? new Date().getFullYear(),
      tags: w.tags ?? [],
      instagramUrl: w.instagramUrl || null,
    });
  }
  if (works.length > 0) process.stdout.write('\n');

  const doc = {
    _id: 'aiPoweredCollection',
    _type: 'aiPoweredCollection',
    works: aggregated,
  };

  if (DRY_RUN) {
    log(`[dry] Would upsert singleton with ${aggregated.length} works.`);
  } else {
    await sanity.createOrReplace(doc);
    log(`✓ Upserted "aiPoweredCollection" with ${aggregated.length} works.`);
  }
}

async function loadWorks() {
  if (!redis) return [];
  try {
    const stored = await redis.get('ai:works');
    if (Array.isArray(stored) && stored.length > 0 && stored.every(isWork)) {
      return stored;
    }
  } catch {}
  try {
    const legacy = await redis.get('ai:images');
    if (Array.isArray(legacy) && legacy.length > 0) {
      return legacy.map((url, i) => ({
        id: `untagged-${i}`,
        brand: 'Other',
        brandKey: 'other',
        title: '',
        description: '',
        category: 'visual',
        imageSrc: url,
        imageAlt: 'AI-powered image',
        year: new Date().getFullYear(),
      }));
    }
  } catch {}
  return [];
}

function isWork(v) {
  return (
    v &&
    typeof v === 'object' &&
    typeof v.id === 'string' &&
    typeof v.imageSrc === 'string' &&
    typeof v.brandKey === 'string' &&
    typeof v.category === 'string'
  );
}

// ── AI Portfolio ────────────────────────────────────────────────────────────
async function migratePortfolio() {
  log('\n━━━ AI Portfolio ━━━');
  const data = await loadPortfolio();
  if (data.items.length === 0 && data.tags.length === 0) {
    log('No AI portfolio data to migrate.\n');
    return;
  }

  // Build tag lookup (id → { en, tr }) so each item can carry its tags
  // inline on the new schema (no more aiPortfolioTag references).
  log(`Tags collected: ${data.tags.length}`);
  const tagById = new Map();
  for (const tag of data.tags) {
    const tagId = tag.id || deriveSlug(tag.en);
    tagById.set(tagId, { en: tag.en, tr: tag.tr });
  }

  log(`Items: ${data.items.length}`);
  const ranks = [];
  let r = LexoRank.min();
  for (let i = 0; i < data.items.length; i++) {
    r = r.genNext().genNext();
    ranks.push(r.toString());
  }

  for (const [i, item] of data.items.entries()) {
    process.stdout.write(`\r  Uploading ${i + 1}/${data.items.length}... `);
    const asset = await uploadFromSource(item.src, `ai-portfolio-${i}`);
    if (!asset) {
      log(`\n  ⚠️  Item ${i + 1} skipped.`);
      continue;
    }
    const tags = (item.tagIds ?? [])
      .map((id) => tagById.get(id))
      .filter(Boolean)
      .map((t, idx) => ({
        _type: 'inlineTag',
        _key: `tag-${i}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        en: t.en,
        tr: t.tr,
      }));

    const doc = {
      _id: `aiPortfolioItem-${hashId(item.src)}`,
      _type: 'aiPortfolioItem',
      orderRank: ranks[i],
      image: asset,
      tags,
    };
    if (!DRY_RUN) await sanity.createOrReplace(doc);
  }
  if (data.items.length > 0) process.stdout.write('\n');
}

async function loadPortfolio() {
  const fallbackItems = readLocalFolder('public/ai-portfolio').map((src) => ({
    src,
    tagIds: [],
  }));

  if (!redis) return { tags: [], items: fallbackItems };

  try {
    const raw = await redis.get('ai:portfolio');
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const tags = Array.isArray(raw.tags) ? raw.tags : [];
      const items = Array.isArray(raw.items) ? raw.items : [];
      if (items.length > 0 || tags.length > 0) return { tags, items };
    }
    if (Array.isArray(raw)) {
      const items = raw.map((entry) =>
        typeof entry === 'string' ? { src: entry, tagIds: [] } : entry,
      );
      if (items.length > 0) return { tags: [], items };
    }
  } catch {}

  return { tags: [], items: fallbackItems };
}

function readLocalFolder(relativePath) {
  const dir = path.join(ROOT, relativePath);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .filter((f) => {
        try {
          return fs.statSync(path.join(dir, f)).size > 1024;
        } catch {
          return false;
        }
      })
      .sort()
      .map((f) => `/${relativePath.split('/').slice(1).join('/')}/${f}`);
  } catch {
    return [];
  }
}

async function uploadFromSource(source, hint) {
  if (!source || typeof source !== 'string') return null;
  try {
    let buffer, filename;
    if (source.startsWith('http://') || source.startsWith('https://')) {
      const res = await fetch(source);
      if (!res.ok) {
        log(`\n  ⚠️  fetch ${res.status} for ${source}`);
        return null;
      }
      buffer = Buffer.from(await res.arrayBuffer());
      filename = path.basename(new URL(source).pathname) || `${hint}.webp`;
    } else {
      const localPath = path.join(ROOT, 'public', source.replace(/^\/+/, ''));
      if (!fs.existsSync(localPath)) {
        log(`\n  ⚠️  missing local: ${localPath}`);
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
    log(`\n  ⚠️  upload error for ${source}: ${e.message}`);
    return null;
  }
}

function hashId(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
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
