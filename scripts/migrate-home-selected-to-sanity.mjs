#!/usr/bin/env node
/**
 * Faz 5 — Home Selected Works migration.
 *
 *   Redis `site:home:selected` → singleton "homeSelectedWorks" doc with `works` array
 *
 * Each entry has photographerId → resolved as a reference to the corresponding
 * photographer-<slug> document (already migrated in Faz 2).
 *
 * Run:
 *   node scripts/migrate-home-selected-to-sanity.mjs
 *   node scripts/migrate-home-selected-to-sanity.mjs --dry-run
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

  const entries = await loadStoredEntries();
  if (entries.length === 0) {
    log('No home selected works to migrate.');
    return;
  }
  log(`Found ${entries.length} entry(ies).\n`);

  // Verify all referenced photographer docs exist.
  const photographerIds = new Set(entries.map((e) => e.photographerId).filter(Boolean));
  const existing = await sanity.fetch(
    `*[_type == "photographer" && slug.current in $ids]{ "id": slug.current }`,
    { ids: [...photographerIds] },
  );
  const existingIds = new Set(existing.map((p) => p.id));
  const missing = [...photographerIds].filter((id) => !existingIds.has(id));
  if (missing.length > 0) {
    log(`⚠️  Photographers not yet in Sanity (run migrate:photographers first): ${missing.join(', ')}\n`);
  }

  const works = [];
  for (const [i, entry] of entries.entries()) {
    process.stdout.write(`\r  Uploading ${i + 1}/${entries.length}... `);

    if (!existingIds.has(entry.photographerId)) {
      log(`\n  ⚠️  Skipping (photographer "${entry.photographerId}" missing in Sanity)`);
      continue;
    }

    const asset = await uploadFromSource(entry.imageSrc, `home-${i}`);
    if (!asset) {
      log(`\n  ⚠️  Image upload failed for entry ${i + 1}`);
      continue;
    }

    works.push({
      _type: 'homeSelectedWork',
      _key: `home-${i}-${Math.random().toString(36).slice(2, 8)}`,
      image: asset,
      workTitle: entry.workTitle || '',
      photographer: {
        _type: 'reference',
        _ref: `photographer-${entry.photographerId}`,
      },
    });
  }
  if (entries.length > 0) process.stdout.write('\n');

  const doc = {
    _id: 'homeSelectedWorks',
    _type: 'homeSelectedWorks',
    works,
  };

  if (DRY_RUN) {
    log(`\n[dry] Would upsert singleton with ${works.length} works.`);
  } else {
    await sanity.createOrReplace(doc);
    log(`\n✓ Upserted "homeSelectedWorks" with ${works.length} works.`);
  }
}

async function loadStoredEntries() {
  if (!redis) return [];
  try {
    const stored = await redis.get('site:home:selected');
    if (Array.isArray(stored)) {
      return stored.filter(
        (e) =>
          e &&
          typeof e === 'object' &&
          typeof e.imageSrc === 'string' &&
          typeof e.photographerId === 'string',
      );
    }
  } catch {}
  return [];
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
