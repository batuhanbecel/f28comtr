#!/usr/bin/env node
/**
 * One-shot: sanatçı rolleri ve AI künyeleri.
 *
 * 1. Tek ünvanı (`title`) çoklu rol listesine (`roles`) taşı.
 *      title: 'PHOTOGRAPHER' → roles: ['PHOTOGRAPHER']
 *      title: 'RETOUCHER'    → roles: ['RETOUCHER']
 *    `roles` zaten dolu olan dokümanlara dokunulmaz.
 *
 * 2. AI işlerinde elle yazılmış AI sanatçısı isimlerinden, "AI Artist" rolü
 *    olan bir sanatçıyla eşleşenleri `credits.aiArtistProfiles`'a referans
 *    olarak ekle (sitede portfolyosuna link verir).
 *
 * Eski alanlar silinmez — `title` ve yazılı isimler, eski deploy'lar onları
 * okumaya devam edebilsin diye kalır. Site aynı ismi bir kez gösterir.
 * Yayınlanmış dokümanlar ve taslakları (drafts.*) ayrı ayrı patch'lenir.
 *
 * Run:
 *   node scripts/migrate-artist-roles.mjs --dry-run
 *   node scripts/migrate-artist-roles.mjs
 */

import { createClient } from '@sanity/client';
import { randomUUID } from 'node:crypto';
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
  // Drafts are only visible with a token; the dry run without one sees published docs.
  perspective: 'raw',
});

// Same list as lib/artistRoles.ts — anything else falls back to photographer.
const KNOWN = ['PHOTOGRAPHER', 'RETOUCHER', 'AI_ARTIST'];

const AI_DOC_ID = 'aiPoweredCollection';

/** Names are typed in caps in Studio — compare them Turkish-lowercased. */
const nameKey = (name) => String(name ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('tr');

async function main() {
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}  ·  dataset: ${dataset}\n`);

  let tx = sanity.transaction();
  const roleCount = await planRoles(tx);
  const creditCount = await planAiCredits(tx);

  if (roleCount + creditCount === 0) {
    console.log('\nNothing to migrate. ✓');
    return;
  }

  if (DRY_RUN) {
    console.log(`\n[dry] ${roleCount} artist(s), ${creditCount} AI work(s) would change. No changes written.`);
    return;
  }

  await tx.commit();
  console.log(`\n✓ Patched ${roleCount} artist(s), ${creditCount} AI work(s).`);
}

async function planRoles(tx) {
  const docs = await sanity.fetch(
    `*[_type == "photographer" && (!defined(roles) || count(roles) == 0)]{ _id, fullName, title }`,
  );
  console.log(`Roles: ${docs.length} artist(s) without roles`);

  for (const d of docs) {
    const role = String(d.title ?? '').trim().toUpperCase();
    const roles = [KNOWN.includes(role) ? role : 'PHOTOGRAPHER'];
    console.log(`  ${d.fullName ?? d._id} (${d._id}): ${d.title ?? '—'} → [${roles.join(', ')}]`);
    tx.patch(d._id, (p) => p.set({ roles }));
  }
  return docs.length;
}

async function planAiCredits(tx) {
  const artists = await sanity.fetch(
    `*[_type == "photographer" && !(_id in path("drafts.**")) && "AI_ARTIST" in coalesce(roles, [title])]{ _id, fullName }`,
  );
  const byName = new Map(artists.map((a) => [nameKey(a.fullName), a]));
  console.log(`\nAI credits: ${artists.length} AI artist profile(s) — ${artists.map((a) => a.fullName).join(', ') || '—'}`);

  const docs = await sanity.fetch(
    `*[_id in [$id, "drafts." + $id]]{ _id, "works": works[]{ _key, brand, title, "typed": credits.aiArtists, "linked": credits.aiArtistProfiles[]._ref } }`,
    { id: AI_DOC_ID },
  );

  let changed = 0;
  for (const doc of docs) {
    for (const w of doc.works ?? []) {
      const linked = new Set(w.linked ?? []);
      const add = [];
      for (const name of w.typed ?? []) {
        const artist = byName.get(nameKey(name));
        if (!artist || linked.has(artist._id)) continue;
        linked.add(artist._id);
        add.push(artist);
      }
      if (add.length === 0) continue;

      const label = [w.brand, w.title].filter(Boolean).join(' — ') || w._key;
      console.log(`  ${doc._id} · ${label}: + ${add.map((a) => a.fullName).join(', ')}`);
      const refs = add.map((a) => ({ _key: randomUUID().replace(/-/g, '').slice(0, 12), _type: 'reference', _ref: a._id }));
      const field = `works[_key=="${w._key}"].credits.aiArtistProfiles`;
      tx.patch(doc._id, (p) =>
        (w.linked?.length ? p.insert('after', `${field}[-1]`, refs) : p.set({ [field]: refs })),
      );
      changed++;
    }
  }
  return changed;
}

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
