#!/usr/bin/env node
/**
 * Copies works[] from legacy homeSelectedWorks → homeV2PageCopy.
 *
 * Run once after deploying merged Anasayfa schema:
 *   node scripts/merge-home-selected-into-home-v2.mjs
 *   node scripts/merge-home-selected-into-home-v2.mjs --dry-run
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
  const legacy = await sanity.fetch(`*[_id == "homeSelectedWorks"][0]{ works }`);
  const works = legacy?.works;
  if (!Array.isArray(works) || works.length === 0) {
    console.log('No legacy homeSelectedWorks.works to merge (already done or empty).');
    return;
  }

  const home = await sanity.fetch(`*[_id == "homeV2PageCopy"][0]{ works }`);
  if (Array.isArray(home?.works) && home.works.length > 0) {
    console.log(
      `homeV2PageCopy already has ${home.works.length} work(s). Skipping merge to avoid overwrite.`,
    );
    return;
  }

  if (DRY_RUN) {
    console.log(`[dry-run] Would copy ${works.length} work(s) to homeV2PageCopy.works`);
    return;
  }

  await sanity
    .transaction()
    .createIfNotExists({ _id: 'homeV2PageCopy', _type: 'homeV2PageCopy' })
    .patch('homeV2PageCopy', (p) => p.set({ works }))
    .commit();

  console.log(`✓ Merged ${works.length} featured work(s) into homeV2PageCopy.`);

  await syncDraftWorks(works);
}

async function syncDraftWorks(works) {
  const draft = await sanity.fetch(`*[_id == "drafts.homeV2PageCopy"][0]{ "n": count(works) }`);
  const draftCount = draft?.n ?? 0;
  if (draftCount >= works.length) return;

  if (DRY_RUN) {
    console.log(`[dry-run] Would sync ${works.length} work(s) to drafts.homeV2PageCopy`);
    return;
  }

  await sanity
    .transaction()
    .createIfNotExists({ _id: 'drafts.homeV2PageCopy', _type: 'homeV2PageCopy' })
    .patch('drafts.homeV2PageCopy', (p) => p.set({ works }))
    .commit();

  console.log(`✓ Synced ${works.length} work(s) into Studio draft (drafts.homeV2PageCopy).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
