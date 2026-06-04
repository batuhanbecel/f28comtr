#!/usr/bin/env node
/**
 * Faz 4 — Site assets migration (landing + logos).
 *
 * Sources:
 *   - Redis `site:landing` → siteAssets.landingImages
 *   - Redis `site:logos:clients`/`:partners`/`:f28`/`:social` → siteAssets.logos.*
 *   - Local fallback: public/logos/brands/{clients,partners}/
 *
 * Single document with _id "siteAssets" (matches structure.ts singleton).
 *
 * Run:
 *   node scripts/migrate-site-assets-to-sanity.mjs
 *   node scripts/migrate-site-assets-to-sanity.mjs --dry-run
 */

import { createClient } from '@sanity/client';
import { Redis } from '@upstash/redis';
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

async function main() {
  log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  log(`Sanity: projectId=${projectId} dataset=${dataset}`);
  log(`Redis:  ${redis ? 'connected' : 'not configured'}\n`);

  // ── Landing images ────────────────────────────────────────────────────────
  log('━━━ Landing Images ━━━');
  const landingUrls = await loadFromRedis('site:landing');
  log(`Found ${landingUrls.length} landing image(s).`);
  const landingAssets = await uploadAll(landingUrls, 'landing');

  // ── Logos ─────────────────────────────────────────────────────────────────
  log('\n━━━ Logos ━━━');
  const categories = [
    { key: 'clients', redisKey: 'site:logos:clients', fallbackDir: 'public/logos/brands/clients' },
    { key: 'partners', redisKey: 'site:logos:partners', fallbackDir: 'public/logos/brands/partners' },
    { key: 'f28', redisKey: 'site:logos:f28', fallbackDir: null },
    { key: 'social', redisKey: 'site:logos:social', fallbackDir: null },
  ];

  const logos = {};
  for (const cat of categories) {
    let urls = await loadFromRedis(cat.redisKey);
    if (urls.length === 0 && cat.fallbackDir) {
      urls = readLocalFolder(cat.fallbackDir);
    }
    log(`  ${cat.key}: ${urls.length} logo(s)`);
    logos[cat.key] = await uploadAll(urls, `logo-${cat.key}`);
  }

  // ── Upsert singleton ──────────────────────────────────────────────────────
  const doc = {
    _id: 'siteAssets',
    _type: 'siteAssets',
    landingImages: landingAssets,
    logos,
  };

  if (DRY_RUN) {
    log(`\n[dry] Would upsert _id="siteAssets":`);
    log(`  landingImages: ${landingAssets.length}`);
    for (const k of Object.keys(logos)) log(`  logos.${k}: ${logos[k].length}`);
  } else {
    await sanity.createOrReplace(doc);
    log('\n✓ Upserted singleton "siteAssets".');
  }

  log('\n✅ Done.');
}

async function loadFromRedis(key) {
  if (!redis) return [];
  try {
    const v = await redis.get(key);
    if (Array.isArray(v)) return v.filter((s) => typeof s === 'string');
  } catch {}
  return [];
}

function readLocalFolder(relativePath) {
  const dir = path.join(ROOT, relativePath);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f))
      .sort()
      .map((f) => `/${relativePath.split('/').slice(1).join('/')}/${f}`);
  } catch {
    return [];
  }
}

async function uploadAll(sources, hintPrefix) {
  const out = [];
  for (const [i, src] of sources.entries()) {
    process.stdout.write(`\r    Uploading ${i + 1}/${sources.length}... `);
    const asset = await uploadFromSource(src, `${hintPrefix}-${i}`);
    if (asset) {
      out.push({
        ...asset,
        _key: `${hintPrefix}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      });
    }
  }
  if (sources.length > 0) process.stdout.write('\n');
  return out;
}

async function uploadFromSource(source, hint) {
  if (!source || typeof source !== 'string') return null;
  try {
    let buffer, filename;
    if (source.startsWith('http://') || source.startsWith('https://')) {
      const res = await fetch(source);
      if (!res.ok) {
        log(`\n    ⚠️  fetch ${res.status} for ${source}`);
        return null;
      }
      buffer = Buffer.from(await res.arrayBuffer());
      filename = path.basename(new URL(source).pathname) || `${hint}.webp`;
    } else {
      const localPath = path.join(ROOT, 'public', source.replace(/^\/+/, ''));
      if (!fs.existsSync(localPath)) {
        log(`\n    ⚠️  missing local: ${localPath}`);
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
    log(`\n    ⚠️  upload error for ${source}: ${e.message}`);
    return null;
  }
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
