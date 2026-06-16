#!/usr/bin/env node
/**
 * One-shot: AI Powered çalışma türlerini yeni iki-türlü sisteme taşı.
 *   'visual' → 'fullAi'
 *   'video'  → 'fullAi'
 *   'hybrid' → 'hybrid' (değişmez)
 *
 * Veri tek dokümanda (aiPoweredCollection.works[]) tutulur; her work _key ile
 * tek tek patch'lenir.
 *
 * Run:
 *   node scripts/migrate-ai-categories.mjs
 *   node scripts/migrate-ai-categories.mjs --dry-run
 */

import { createClient } from '@sanity/client';
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

// Old value → new value. 'hybrid' kept as-is and skipped.
const MAP = { visual: 'fullAi', video: 'fullAi' };

const DOC_ID = 'aiPoweredCollection';

async function main() {
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  const works = await sanity.fetch(
    `*[_id == $id][0].works[]{ _key, brand, category }`,
    { id: DOC_ID },
  );

  if (!Array.isArray(works) || works.length === 0) {
    console.log('No works found.');
    return;
  }

  const changes = works.filter((w) => w?._key && MAP[w.category]);
  console.log(`${works.length} work(s); ${changes.length} need remapping.\n`);

  if (changes.length === 0) {
    console.log('Nothing to migrate. ✓');
    return;
  }

  for (const w of changes) {
    console.log(`  ${w.brand ?? w._key}: ${w.category} → ${MAP[w.category]}`);
  }

  if (DRY_RUN) {
    console.log('\n[dry] No changes written.');
    return;
  }

  let patch = sanity.patch(DOC_ID);
  for (const w of changes) {
    patch = patch.set({ [`works[_key=="${w._key}"].category`]: MAP[w.category] });
  }
  await patch.commit();

  console.log(`\n✓ Patched ${changes.length} work(s).`);
}

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
