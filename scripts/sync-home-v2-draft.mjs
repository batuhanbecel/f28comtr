#!/usr/bin/env node
/**
 * Studio edits drafts.homeV2PageCopy. If copy-seo seed ran after works migration,
 * the draft can lack works[] while published still has them — Studio shows empty.
 *
 * Copies works[] (and optional fields) from published → draft.
 *
 *   node scripts/sync-home-v2-draft.mjs
 *   node scripts/sync-home-v2-draft.mjs --dry-run
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

if (!projectId) {
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID not set');
  process.exit(1);
}
if (!writeToken && !DRY_RUN) {
  console.error('SANITY_API_WRITE_TOKEN not set');
  process.exit(1);
}

const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token: writeToken,
  useCdn: false,
});

async function main() {
  const published = await sanity.fetch(`*[_id == "homeV2PageCopy"][0]`);
  if (!published) {
    console.log('homeV2PageCopy (published) not found.');
    return;
  }

  const works = published.works;
  if (!Array.isArray(works) || works.length === 0) {
    console.log('Published homeV2PageCopy has no works. Run npm run migrate:home-selected first.');
    return;
  }

  const draft = await sanity.fetch(`*[_id == "drafts.homeV2PageCopy"][0]{ "n": count(works) }`);
  const draftCount = draft?.n ?? 0;

  if (draftCount >= works.length) {
    console.log(`Draft already has ${draftCount} work(s). Nothing to sync.`);
    return;
  }

  if (DRY_RUN) {
    console.log(`[dry-run] Would set drafts.homeV2PageCopy.works (${works.length} items).`);
    return;
  }

  await sanity
    .transaction()
    .createIfNotExists({
      _id: 'drafts.homeV2PageCopy',
      _type: 'homeV2PageCopy',
    })
    .patch('drafts.homeV2PageCopy', (p) => p.set({ works }))
    .commit();

  console.log(`✓ Synced ${works.length} featured work(s) into drafts.homeV2PageCopy.`);
  console.log('  Reload Studio (Öne Çıkan İşler tab) to see them.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
