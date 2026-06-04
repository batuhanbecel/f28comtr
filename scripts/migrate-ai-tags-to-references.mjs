#!/usr/bin/env node
/**
 * Migrates aiPortfolioItem inline tags { en, tr } to aiTag document references.
 *
 * Run:
 *   node scripts/migrate-ai-tags-to-references.mjs
 *   node scripts/migrate-ai-tags-to-references.mjs --dry-run
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

function tagKey(en, tr) {
  return `${(en || '').trim().toLowerCase()}::${(tr || '').trim().toLowerCase()}`;
}

async function main() {
  const items = await sanity.fetch(
    `*[_type == "aiPortfolioItem"]{ _id, tags }`,
  );

  const tagCache = new Map();
  let createdTags = 0;
  let patchedItems = 0;

  for (const item of items) {
    const tags = item.tags ?? [];
    if (tags.length === 0) continue;

    const first = tags[0];
    if (first?._ref) continue;

    const newRefs = [];
    for (const t of tags) {
      const en = typeof t?.en === 'string' ? t.en.trim() : '';
      const tr = typeof t?.tr === 'string' ? t.tr.trim() : '';
      if (!en) continue;

      const key = tagKey(en, tr || en);
      let tagId = tagCache.get(key);

      if (!tagId) {
        const existing = await sanity.fetch(
          `*[_type == "aiTag" && lower(en) == $en][0]._id`,
          { en: en.toLowerCase() },
        );

        if (existing) {
          tagId = existing;
        } else {
          tagId = `aiTag-${en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'tag'}`;
          let suffix = 0;
          while (await sanity.fetch(`*[_id == $id][0]._id`, { id: tagId })) {
            suffix += 1;
            tagId = `${tagId}-${suffix}`;
          }

          const doc = {
            _id: tagId,
            _type: 'aiTag',
            en,
            tr: tr || en,
          };

          if (DRY_RUN) {
            console.log('[dry-run] create aiTag:', doc);
          } else {
            await sanity.createOrReplace(doc);
          }
          createdTags += 1;
        }
        tagCache.set(key, tagId);
      }

      newRefs.push({
        _type: 'reference',
        _ref: tagId,
        _key: `tag-${tagId}`,
      });
    }

    if (newRefs.length === 0) continue;

    if (DRY_RUN) {
      console.log(`[dry-run] patch ${item._id}:`, newRefs.map((r) => r._ref));
    } else {
      await sanity.patch(item._id).set({ tags: newRefs }).commit();
    }
    patchedItems += 1;
  }

  console.log(
    DRY_RUN
      ? `[dry-run] would create ${createdTags} tags, patch ${patchedItems} items`
      : `Done: created ${createdTags} tags, patched ${patchedItems} items`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
