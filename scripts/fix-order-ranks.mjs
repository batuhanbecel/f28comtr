#!/usr/bin/env node
/**
 * One-shot: orderRank'i set edilmemiş orderable doc'lara (photographer,
 * aiPortfolioItem) artan lex-rank ata. Plugin uyarısını ("Invalid orderRank
 * value (expected string): null") düzeltir.
 *
 * Run:
 *   node scripts/fix-order-ranks.mjs
 *   node scripts/fix-order-ranks.mjs --dry-run
 */

import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';
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

const TYPES = ['photographer', 'aiPortfolioItem'];

async function main() {
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  for (const type of TYPES) {
    console.log(`━━━ ${type} ━━━`);
    const missing = await sanity.fetch(
      `*[_type == $type && !defined(orderRank)] | order(_createdAt asc){ _id, _createdAt }`,
      { type },
    );
    if (missing.length === 0) {
      console.log('  All docs have orderRank. ✓\n');
      continue;
    }
    console.log(`  ${missing.length} doc(s) missing orderRank.`);

    // Find the highest existing rank so new ones are appended after it.
    const existing = await sanity.fetch(
      `*[_type == $type && defined(orderRank)] | order(orderRank desc)[0]{ orderRank }`,
      { type },
    );

    let rank = existing?.orderRank ? LexoRank.parse(existing.orderRank) : LexoRank.min();

    if (DRY_RUN) {
      for (const doc of missing) {
        rank = rank.genNext().genNext();
        console.log(`  [dry] ${doc._id} → ${rank.toString()}`);
      }
      console.log();
      continue;
    }

    const tx = sanity.transaction();
    for (const doc of missing) {
      rank = rank.genNext().genNext();
      tx.patch(doc._id, { set: { orderRank: rank.toString() } });
    }
    await tx.commit();
    console.log(`  ✓ Patched ${missing.length} doc(s).\n`);
  }

  console.log('✅ Done.');
}

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
