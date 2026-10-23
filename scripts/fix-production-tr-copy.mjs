#!/usr/bin/env node
/**
 * One-shot: "Production Sayfası" Türkçe metinlerinde kalan İngilizce
 * ifadeleri (compositing, high-end finishing, location, shot list…)
 * Türkçeleştirir. lib/translations.ts'teki yedek metinlerle aynıdır.
 *
 * Run:
 *   node scripts/fix-production-tr-copy.mjs
 *   node scripts/fix-production-tr-copy.mjs --dry-run
 */

import { createClient } from '@sanity/client';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

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

const SET = {
  'services.items[_key=="service-0"].description.tr':
    'Global markalar için kampanya, lookbook, e-ticaret, ürün ve dış mekân çekimleri.',
  'services.items[_key=="service-2"].description.tr':
    'Kompozit çalışmalar, güzellik rötuşu, set genişletme ve basılı/dijital için üst düzey post prodüksiyon.',
  'services.items[_key=="service-3"].description.tr':
    'Reklam filmi, sosyal medya içeriği, ürün videosu ve hareketle anlatılan marka hikâyeleri.',
  'services.items[_key=="service-4"].description.tr':
    'Offline ve online kurgu, renk düzenlemeye hazırlık ve platformlara hazır final kurgular.',
  'process.steps[_key=="step-0"].sub.tr': 'Marka ihtiyacı, yaratıcı yön, çekim listesi ve takvim',
  'process.steps[_key=="step-1"].sub.tr': 'Doğru ekip ve oyuncularla stüdyo ya da dış mekân çekimi',
  'process.steps[_key=="step-2"].title.tr': 'Post prodüksiyon & rötuş',
  'process.steps[_key=="step-2"].sub.tr': 'Kompozit, renk düzenleme ve üst düzey son dokunuşlar',
  'process.steps[_key=="step-3"].sub.tr': 'Her kanal için kırpım, format ve versiyonlar',
  'process.steps[_key=="step-4"].sub.tr': 'Final dosyalar, arşiv ve ekibinize teslim',
};

// Patch the published doc and, if one exists, the open draft so Studio shows the same text.
const ids = ['productionPageCopy', 'drafts.productionPageCopy'];
const existing = await sanity.fetch('*[_id in $ids]._id', { ids });

for (const id of existing) {
  if (DRY_RUN) {
    console.log(`[dry-run] ${id}: ${Object.keys(SET).length} fields`);
    continue;
  }
  const res = await sanity.patch(id).set(SET).commit();
  console.log(`patched ${res._id} (${res._rev})`);
}

function die(message) {
  console.error(message);
  process.exit(1);
}
