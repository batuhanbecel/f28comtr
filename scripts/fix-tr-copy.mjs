#!/usr/bin/env node
/**
 * One-shot: Anasayfa, Production, AI-Powered ve İletişim sayfalarının Türkçe
 * metinlerinde kalan İngilizce ifadeleri (compositing, location, cutdown,
 * "Hybrid rötüş"…) ve tekrar eden etiketleri düzeltir.
 * lib/translations.ts'teki yedek metinlerle aynıdır.
 *
 * Run:
 *   node scripts/fix-tr-copy.mjs
 *   node scripts/fix-tr-copy.mjs --dry-run
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

const PRODUCTION = {
  'team.sectionLabel.tr': 'Ağımız',
  'team.description.tr':
    "Geniş bir fotoğrafçı ve rötuşçu ağıyla çalışıyoruz. Her proje için brief'e en uygun ekibi çekimden final teslimata kadar biz kuruyoruz.",
  'deliverables.items[_key=="deliverable-0"].tr': 'Kampanya ana görselleri',
  'deliverables.items[_key=="deliverable-1"].tr': 'E-ticaret ürün çekimleri',
  'deliverables.items[_key=="deliverable-2"].tr': 'Sosyal medya kısa versiyonları',
  'deliverables.items[_key=="deliverable-3"].tr': 'Marka filmi master dosyaları',
  'deliverables.items[_key=="deliverable-5"].tr': 'Platforma özel çıktılar',
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

const AI_POWERED = {
  'process.steps[_key=="step-2"].title.tr': 'Hibrit rötuş',
  'process.steps[_key=="step-2"].sub.tr': 'AI destekli iş akışı ve geleneksel post prodüksiyon',
};

// Hero label repeated the "BİZE ULAŞIN" channels heading
const CONTACT = {
  'sectionLabel.tr': 'İletişime geçin',
};

// Labels no longer repeat their titles ("Seçili iş / Seçili işler",
// "Sanatçılarımız / Sanatçılar"); one word per term: rötuş, portföy
const HOME_V2 = {
  'selectedWorksLabel.tr': 'Portföy',
  'selectedWorksLabel.en': 'Portfolio',
  'artistsLabel.tr': 'Ekip',
  'artistsLabel.en': 'Team',
  'aiSplitLabel.tr': 'AI-Powered prodüksiyon',
  'aiSplitCta.tr': 'Portföyü gör',
  'aiSplitBody.tr':
    "Brief'ten teslimata kadar: model seçimi, prompt, iterasyon ve hibrit rötuş. AI iş akışı ile geleneksel post-prodüksiyon bir arada.",
};

const AI_POWERED_TERMS = {
  'description.tr':
    'Geleneksel rötuş disiplinini en güncel AI modelleriyle harmanlayarak hibrit bir prodüksiyon süreci sunuyoruz. Sektör standartlarındaki ustalığımızı inovatif teknolojilerle birleştirerek, markalarımız için hem yaratıcı hem de yüksek verimli görsel ve video içerikler üretiyoruz.',
  'filters.hybrid.tr': 'Hibrit',
};

const DOCS = {
  productionPageCopy: PRODUCTION,
  aiPoweredPageCopy: { ...AI_POWERED, ...AI_POWERED_TERMS },
  contactPageCopy: CONTACT,
  homeV2PageCopy: HOME_V2,
};

// Patch the published doc and, if one exists, the open draft so Studio shows the same text.
for (const [docId, set] of Object.entries(DOCS)) {
  const ids = [docId, `drafts.${docId}`];
  const existing = await sanity.fetch('*[_id in $ids]._id', { ids });

  for (const id of existing) {
    if (DRY_RUN) {
      console.log(`[dry-run] ${id}: ${Object.keys(set).length} fields`);
      continue;
    }
    const res = await sanity.patch(id).set(set).commit();
    console.log(`patched ${res._id} (${res._rev})`);
  }
}

function die(message) {
  console.error(message);
  process.exit(1);
}
