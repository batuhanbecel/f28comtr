#!/usr/bin/env node
/**
 * One-shot: the June 2026 migration uploaded portfolio images that
 * scripts/optimize-images.js had already shrunk to 1200px. The full-size
 * files still live in git history (commits before 74f96a5). For every
 * portfolio image at ≤1200px whose original is ≥20% larger, upload the
 * original and point every document that used the small asset at it
 * (hotspot/crop and array keys are kept). The small assets stay in the
 * dataset, so this can be undone by swapping the refs back.
 *
 * Run (needs SANITY_API_WRITE_TOKEN in .env.local and full git history):
 *   node scripts/upgrade-portfolio-originals.mjs --dry-run
 *   node scripts/upgrade-portfolio-originals.mjs
 */

import { createClient } from '@sanity/client';
import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
dotenv.config({ path: path.join(ROOT, '.env.local') });

const DRY_RUN = process.argv.includes('--dry-run');
const MAX_SMALL_SIDE = 1200;
const MIN_GAIN = 1.2;
/** Commits that still carry the unresized portfolio files. */
const ORIGINAL_COMMITS = ['dac55fe', '1a570d0', '152c085', '5e11081', '489de1d', '4f36594'];

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const writeToken = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId) die('NEXT_PUBLIC_SANITY_PROJECT_ID not set');
if (!writeToken && !DRY_RUN) die('SANITY_API_WRITE_TOKEN not set');

const sanity = createClient({ projectId, dataset, apiVersion: '2025-01-01', token: writeToken, useCdn: false });

/** "005_copy-1774298226315-qplz.webp" / "005 copy.webp" → "005copy" */
const norm = (name) =>
  name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/-\d{12,}-[a-z0-9]+$/, '')
    .replace(/[^a-z0-9]+/g, '');

// 1. Largest pre-resize file per photographer folder + normalized name
const originals = new Map();
for (const commit of ORIGINAL_COMMITS) {
  const out = execSync(`git ls-tree -r -l ${commit} -- public/portfolios`, { cwd: ROOT, maxBuffer: 1 << 26 }).toString();
  for (const line of out.trim().split('\n')) {
    const m = line.match(/^\S+ blob (\S+)\s+(\d+)\t(.+)$/);
    if (!m || m[3].includes('/previews/')) continue;
    const [, blob, size, file] = m;
    const key = `${file.split('/')[2]}/${norm(file.split('/').pop())}`;
    const prev = originals.get(key);
    if (!prev || Number(size) > prev.size) originals.set(key, { blob, size: Number(size), file });
  }
}

// 2. Small portfolio images that have a meaningfully larger original
const docs = await sanity.fetch(
  `*[_type == "photographer"]{ "id": slug.current, "imgs": portfolioImages[]{ "ref": asset._ref, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height, "name": asset->originalFilename } }`,
);
const plan = [];
for (const doc of docs) {
  for (const img of doc.imgs ?? []) {
    if (!img?.ref || !img.w || Math.max(img.w, img.h) > MAX_SMALL_SIDE) continue;
    const original = originals.get(`${doc.id}/${norm(img.name ?? '')}`);
    if (!original) continue;
    const buffer = execFileSync('git', ['cat-file', 'blob', original.blob], { cwd: ROOT, maxBuffer: 1 << 28 });
    const meta = await sharp(buffer).metadata();
    if (Math.max(meta.width, meta.height) < Math.max(img.w, img.h) * MIN_GAIN) continue;
    plan.push({ photographer: doc.id, oldRef: img.ref, from: `${img.w}x${img.h}`, to: `${meta.width}x${meta.height}`, file: original.file, buffer });
  }
}
console.log(`${plan.length} images have a larger original in git`);

// 3. Upload each original once, then swap the ref everywhere the old asset is used
const done = new Map();
for (const [i, item] of plan.entries()) {
  if (done.has(item.oldRef)) continue;
  const label = `[${i + 1}/${plan.length}] ${item.photographer} ${path.basename(item.file)} ${item.from} → ${item.to}`;
  const users = await sanity.fetch(`*[references($ref)]{ _id }`, { ref: item.oldRef });
  if (DRY_RUN) {
    console.log(`${label} (${users.length} doc${users.length === 1 ? '' : 's'})`);
    continue;
  }
  const asset = await sanity.assets.upload('image', item.buffer, { filename: path.basename(item.file) });
  for (const { _id } of users) {
    const doc = await sanity.getDocument(_id);
    const paths = refPaths(doc, item.oldRef);
    if (paths.length === 0) continue;
    await sanity
      .patch(_id)
      .set(Object.fromEntries(paths.map((p) => [p, asset._id])))
      .commit();
  }
  done.set(item.oldRef, asset._id);
  console.log(`${label} ✓ ${asset._id}`);
}

if (!DRY_RUN) {
  const log = path.join(ROOT, `upgrade-portfolio-originals.${Date.now()}.json`);
  fs.writeFileSync(log, JSON.stringify(Object.fromEntries(done), null, 1));
  console.log(`old → new asset map: ${path.relative(ROOT, log)}`);
}

/** JSON paths of every `_ref` equal to `ref`, keyed by array `_key` so patches stay stable. */
function refPaths(node, ref, prefix = '') {
  if (Array.isArray(node)) {
    return node.flatMap((item, i) =>
      refPaths(item, ref, `${prefix}[${item && item._key ? `_key=="${item._key}"` : i}]`),
    );
  }
  if (node && typeof node === 'object') {
    return Object.entries(node).flatMap(([k, v]) => {
      if (k === '_ref' && v === ref) return [`${prefix}._ref`];
      if (k.startsWith('_') && k !== '_ref') return [];
      return refPaths(v, ref, prefix ? `${prefix}.${k}` : k);
    });
  }
  return [];
}

function die(message) {
  console.error(message);
  process.exit(1);
}
