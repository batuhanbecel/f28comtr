#!/usr/bin/env tsx
/**
 * Faz 6 (v2) — Page copy + SEO migration to **fully structured** Sanity docs.
 *
 * Seeds Sanity with the default content from `lib/translations.ts` so editors
 * can edit every field directly in Studio (no JSON, no code). Each text field
 * is localized as { en, tr } via the `localizedString` / `localizedText`
 * custom Sanity types.
 *
 * Run:
 *   npm run migrate:copy-seo
 *   npm run migrate:copy-seo -- --dry-run
 */

import { createClient } from '@sanity/client';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

import { translations } from '../lib/translations';
import { contactInfo } from '../lib/data';
import type { SeoPageKey } from '../lib/seo';

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
  projectId: projectId!,
  dataset,
  apiVersion: '2025-01-01',
  token: writeToken,
  useCdn: false,
});

const en = translations.en;
const tr = translations.tr;

function ls(enVal: string | undefined, trVal: string | undefined) {
  return { en: enVal ?? '', tr: trVal ?? '' };
}
const lt = ls; // shape identical, distinct name for readability

async function main() {
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);
  await seedProduction();
  await seedAiPowered();
  await seedContact();
  await seedSeoOverrides();
  console.log('\n✅ Done.');
}

// ── Production ──────────────────────────────────────────────────────────────
async function seedProduction() {
  console.log('━━━ Production Page ━━━');
  const enP = en.production;
  const trP = tr.production;

  const doc = {
    _id: 'productionPageCopy',
    _type: 'productionPageCopy',
    sectionLabel: ls(enP.sectionLabel, trP.sectionLabel),
    heading: ls(enP.heading, trP.heading),
    description: lt(enP.description, trP.description),
    stats: {
      projectsLabel: ls(enP.stats.projects, trP.stats.projects),
      brandsLabel: ls(enP.stats.brands, trP.stats.brands),
      sinceLabel: ls(enP.stats.since, trP.stats.since),
      projectsValue: '1000+',
      brandsValue: '150+',
      sinceYear: '2008',
    },
    services: {
      sectionLabel: ls(enP.services.sectionLabel, trP.services.sectionLabel),
      heading: ls(enP.services.heading, trP.services.heading),
      items: enP.services.items.map((item, i) => ({
        _type: 'service',
        _key: `service-${i}`,
        title: ls(item.title, trP.services.items[i]?.title),
        description: lt(item.description, trP.services.items[i]?.description),
      })),
    },
    process: {
      sectionLabel: ls(enP.process.sectionLabel, trP.process.sectionLabel),
      heading: ls(enP.process.heading, trP.process.heading),
      steps: enP.process.steps.map((step, i) => ({
        _type: 'processStep',
        _key: `step-${i}`,
        title: ls(step.title, trP.process.steps[i]?.title),
        sub: ls(step.sub, trP.process.steps[i]?.sub),
      })),
    },
    deliverables: {
      sectionLabel: ls(enP.deliverables.sectionLabel, trP.deliverables.sectionLabel),
      heading: ls(enP.deliverables.heading, trP.deliverables.heading),
      items: enP.deliverables.items.map((item, i) => ({
        _type: 'localizedString',
        _key: `deliverable-${i}`,
        ...ls(item, trP.deliverables.items[i]),
      })),
    },
    team: {
      sectionLabel: ls(enP.team.sectionLabel, trP.team.sectionLabel),
      description: lt(enP.team.description, trP.team.description),
      cta: ls(enP.team.cta, trP.team.cta),
    },
    marqueeLabel: ls(enP.marqueeLabel, trP.marqueeLabel),
    marqueeRow: ls(enP.marqueeRow, trP.marqueeRow),
    marqueeViewImage: ls(enP.marqueeViewImage, trP.marqueeViewImage),
    seo: {
      title: ls(en.seo.production.title, tr.seo.production.title),
      description: lt(en.seo.production.description, tr.seo.production.description),
    },
  };

  await upsert(doc, 'productionPageCopy');
}

// ── AI Powered ──────────────────────────────────────────────────────────────
async function seedAiPowered() {
  console.log('\n━━━ AI Powered Page ━━━');
  const enA = en.aiPowered;
  const trA = tr.aiPowered;

  const doc = {
    _id: 'aiPoweredPageCopy',
    _type: 'aiPoweredPageCopy',
    sectionLabel: ls(enA.sectionLabel, trA.sectionLabel),
    heading: ls(enA.heading, trA.heading),
    description: lt(enA.description, trA.description),
    worksLabel: ls(enA.worksLabel, trA.worksLabel),
    stats: {
      projectsLabel: ls(enA.stats.projects, trA.stats.projects),
      brandsLabel: ls(enA.stats.brands, trA.stats.brands),
      sinceLabel: ls(enA.stats.since, trA.stats.since),
      sinceYear: '2008',
    },
    process: {
      sectionLabel: ls(enA.process.sectionLabel, trA.process.sectionLabel),
      heading: ls(enA.process.heading, trA.process.heading),
      steps: enA.process.steps.map((step, i) => ({
        _type: 'processStep',
        _key: `step-${i}`,
        title: ls(step.title, trA.process.steps[i]?.title),
        sub: ls(step.sub, trA.process.steps[i]?.sub),
      })),
    },
    filters: {
      brand: ls(enA.filters.brand, trA.filters.brand),
      type: ls(enA.filters.type, trA.filters.type),
      all: ls(enA.filters.all, trA.filters.all),
      allBrands: ls(enA.filters.allBrands, trA.filters.allBrands),
      allTypes: ls(enA.filters.allTypes, trA.filters.allTypes),
      visual: ls(enA.filters.visual, trA.filters.visual),
      video: ls(enA.filters.video, trA.filters.video),
      hybrid: ls(enA.filters.hybrid, trA.filters.hybrid),
      resultsSuffix: ls(enA.filters.resultsSuffix, trA.filters.resultsSuffix),
      empty: ls(enA.filters.empty, trA.filters.empty),
    },
    seo: {
      title: ls(en.seo.aiPowered.title, tr.seo.aiPowered.title),
      description: lt(en.seo.aiPowered.description, tr.seo.aiPowered.description),
    },
  };

  await upsert(doc, 'aiPoweredPageCopy');
}

// ── Contact ─────────────────────────────────────────────────────────────────
async function seedContact() {
  console.log('\n━━━ Contact Page ━━━');
  const enC = en.contact;
  const trC = tr.contact;

  const doc = {
    _id: 'contactPageCopy',
    _type: 'contactPageCopy',
    sectionLabel: ls(enC.sectionLabel, trC.sectionLabel),
    heading: ls(enC.heading, trC.heading),
    description: lt(enC.description, trC.description),
    channelsLabel: ls(enC.channelsLabel, trC.channelsLabel),
    channelsHeading: ls(enC.channelsHeading, trC.channelsHeading),
    emailLabel: ls(enC.emailLabel, trC.emailLabel),
    instagramLabel: ls(enC.instagramLabel, trC.instagramLabel),
    linkedinLabel: ls(enC.linkedinLabel, trC.linkedinLabel),
    addressLabel: ls(enC.addressLabel, trC.addressLabel),
    formLabel: ls(enC.formLabel, trC.formLabel),
    formHeading: ls(enC.formHeading, trC.formHeading),
    form: {
      name: ls(enC.form.name, trC.form.name),
      email: ls(enC.form.email, trC.form.email),
      subject: ls(enC.form.subject, trC.form.subject),
      message: ls(enC.form.message, trC.form.message),
      submit: ls(enC.form.submit, trC.form.submit),
      sending: ls(enC.form.sending, trC.form.sending),
      success: ls(enC.form.success, trC.form.success),
      error: ls(enC.form.error, trC.form.error),
      required: ls(enC.form.required, trC.form.required),
      invalidEmail: ls(enC.form.invalidEmail, trC.form.invalidEmail),
    },
    info: {
      email: contactInfo.email,
      instagram: contactInfo.instagram,
      linkedin: contactInfo.linkedin,
      address: contactInfo.address,
      city: contactInfo.city,
    },
    seo: {
      title: ls(en.seo.contact.title, tr.seo.contact.title),
      description: lt(en.seo.contact.description, tr.seo.contact.description),
    },
  };

  await upsert(doc, 'contactPageCopy');
}

// ── SEO overrides (per page) ────────────────────────────────────────────────
async function seedSeoOverrides() {
  console.log('\n━━━ SEO Overrides ━━━');
  const pageKeys: SeoPageKey[] = [
    'home',
    'production',
    'aiPowered',
    'aiPoweredPortfolio',
    'portfolios',
    'about',
    'contact',
  ];

  for (const pageKey of pageKeys) {
    const enS = en.seo[pageKey];
    const trS = tr.seo[pageKey];
    if (!isSeoBlock(enS) || !isSeoBlock(trS)) continue;

    const doc = {
      _id: `seoOverride-${pageKey}`,
      _type: 'seoOverride',
      pageKey,
      en: { title: enS.title, description: enS.description },
      tr: { title: trS.title, description: trS.description },
    };
    await upsert(doc, `seoOverride-${pageKey}`);
  }
}

function isSeoBlock(v: unknown): v is { title: string; description: string } {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return typeof o.title === 'string' && typeof o.description === 'string';
}

// ── Helpers ─────────────────────────────────────────────────────────────────
async function upsert(doc: Record<string, unknown>, hint: string) {
  if (DRY_RUN) {
    console.log(`  [dry] Would upsert ${doc._id as string}`);
    return;
  }
  await sanity.createOrReplace(doc as Parameters<typeof sanity.createOrReplace>[0]);
  console.log(`  ✓ ${hint}`);
}

function die(msg: string): never {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
