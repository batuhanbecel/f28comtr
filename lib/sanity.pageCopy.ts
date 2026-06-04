import { sanityFetch } from '@/lib/sanity.fetch';
import type {
  AiPoweredPageCopy,
  ContactPageCopy,
  PageCopyByKey,
  PageCopyKey,
  ProductionPageCopy,
  SeoCopy,
} from '@/lib/pageCopy.types';
import type { Lang } from '@/lib/translations';

// ── Helpers ─────────────────────────────────────────────────────────────────

type LocalizedField = { en?: string | null; tr?: string | null } | null | undefined;

function pick(v: LocalizedField, lang: Lang): string | undefined {
  if (!v) return undefined;
  const localized = v[lang] ?? v.en ?? v.tr;
  return localized && localized.length > 0 ? localized : undefined;
}

function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

// ── Production ──────────────────────────────────────────────────────────────

interface ProductionDoc {
  sectionLabel?: LocalizedField;
  heading?: LocalizedField;
  description?: LocalizedField;
  stats?: {
    projectsLabel?: LocalizedField;
    brandsLabel?: LocalizedField;
    sinceLabel?: LocalizedField;
    projectsValue?: string;
    brandsValue?: string;
    sinceYear?: string;
  };
  services?: {
    sectionLabel?: LocalizedField;
    heading?: LocalizedField;
    items?: Array<{
      title?: LocalizedField;
      description?: LocalizedField;
    }>;
  };
  process?: {
    sectionLabel?: LocalizedField;
    heading?: LocalizedField;
    steps?: Array<{
      title?: LocalizedField;
      sub?: LocalizedField;
    }>;
  };
  deliverables?: {
    sectionLabel?: LocalizedField;
    heading?: LocalizedField;
    items?: LocalizedField[];
  };
  team?: {
    sectionLabel?: LocalizedField;
    description?: LocalizedField;
    cta?: LocalizedField;
  };
  marqueeLabel?: LocalizedField;
  marqueeRow?: LocalizedField;
  marqueeViewImage?: LocalizedField;
  seo?: {
    title?: LocalizedField;
    description?: LocalizedField;
  };
}

function mapProduction(doc: ProductionDoc, lang: Lang): Partial<ProductionPageCopy> {
  const out: Partial<ProductionPageCopy> = {};
  const setIf = <K extends keyof ProductionPageCopy>(k: K, v: ProductionPageCopy[K] | undefined) => {
    if (v !== undefined) (out as Record<string, unknown>)[k as string] = v;
  };

  setIf('sectionLabel', pick(doc.sectionLabel, lang));
  setIf('heading', pick(doc.heading, lang));
  setIf('description', pick(doc.description, lang));

  if (doc.stats) {
    const stats = omitUndefined({
      projects: pick(doc.stats.projectsLabel, lang),
      brands: pick(doc.stats.brandsLabel, lang),
      since: pick(doc.stats.sinceLabel, lang),
    });
    if (Object.keys(stats).length > 0) setIf('stats', stats as ProductionPageCopy['stats']);

    const statsValues = omitUndefined({
      projects: doc.stats.projectsValue,
      brands: doc.stats.brandsValue,
      sinceYear: doc.stats.sinceYear,
    });
    if (Object.keys(statsValues).length > 0)
      setIf('statsValues', statsValues as ProductionPageCopy['statsValues']);
  }

  if (doc.services) {
    const items = (doc.services.items ?? [])
      .map((item) => {
        const title = pick(item.title, lang);
        const description = pick(item.description, lang);
        return title || description ? { title: title ?? '', description: description ?? '' } : null;
      })
      .filter((v): v is { title: string; description: string } => v !== null);

    const services = omitUndefined({
      sectionLabel: pick(doc.services.sectionLabel, lang),
      heading: pick(doc.services.heading, lang),
      items: items.length > 0 ? items : undefined,
    });
    if (Object.keys(services).length > 0)
      setIf('services', services as ProductionPageCopy['services']);
  }

  if (doc.process) {
    const steps = (doc.process.steps ?? [])
      .map((step) => {
        const title = pick(step.title, lang);
        const sub = pick(step.sub, lang);
        return title || sub ? { title: title ?? '', sub: sub ?? '' } : null;
      })
      .filter((v): v is { title: string; sub: string } => v !== null);

    const process = omitUndefined({
      sectionLabel: pick(doc.process.sectionLabel, lang),
      heading: pick(doc.process.heading, lang),
      steps: steps.length > 0 ? steps : undefined,
    });
    if (Object.keys(process).length > 0)
      setIf('process', process as ProductionPageCopy['process']);
  }

  if (doc.deliverables) {
    const items = (doc.deliverables.items ?? [])
      .map((i) => pick(i, lang))
      .filter((s): s is string => typeof s === 'string' && s.length > 0);

    const deliverables = omitUndefined({
      sectionLabel: pick(doc.deliverables.sectionLabel, lang),
      heading: pick(doc.deliverables.heading, lang),
      items: items.length > 0 ? items : undefined,
    });
    if (Object.keys(deliverables).length > 0)
      setIf('deliverables', deliverables as ProductionPageCopy['deliverables']);
  }

  if (doc.team) {
    const team = omitUndefined({
      sectionLabel: pick(doc.team.sectionLabel, lang),
      description: pick(doc.team.description, lang),
      cta: pick(doc.team.cta, lang),
    });
    if (Object.keys(team).length > 0) setIf('team', team as ProductionPageCopy['team']);
  }

  setIf('marqueeLabel', pick(doc.marqueeLabel, lang));
  setIf('marqueeRow', pick(doc.marqueeRow, lang));
  setIf('marqueeViewImage', pick(doc.marqueeViewImage, lang));

  if (doc.seo) {
    const seo = omitUndefined({
      title: pick(doc.seo.title, lang),
      description: pick(doc.seo.description, lang),
    });
    if (Object.keys(seo).length > 0) setIf('seo', seo as SeoCopy);
  }

  return out;
}

// ── AI Powered ──────────────────────────────────────────────────────────────

interface AiPoweredDoc {
  sectionLabel?: LocalizedField;
  heading?: LocalizedField;
  description?: LocalizedField;
  worksLabel?: LocalizedField;
  stats?: {
    projectsLabel?: LocalizedField;
    brandsLabel?: LocalizedField;
    sinceLabel?: LocalizedField;
    sinceYear?: string;
  };
  process?: {
    sectionLabel?: LocalizedField;
    heading?: LocalizedField;
    steps?: Array<{ title?: LocalizedField; sub?: LocalizedField }>;
  };
  filters?: Record<string, LocalizedField>;
  seo?: { title?: LocalizedField; description?: LocalizedField };
}

function mapAiPowered(doc: AiPoweredDoc, lang: Lang): Partial<AiPoweredPageCopy> {
  const out: Partial<AiPoweredPageCopy> = {};
  const setIf = <K extends keyof AiPoweredPageCopy>(k: K, v: AiPoweredPageCopy[K] | undefined) => {
    if (v !== undefined) (out as Record<string, unknown>)[k as string] = v;
  };

  setIf('sectionLabel', pick(doc.sectionLabel, lang));
  setIf('heading', pick(doc.heading, lang));
  setIf('description', pick(doc.description, lang));
  setIf('worksLabel', pick(doc.worksLabel, lang));

  if (doc.stats) {
    const stats = omitUndefined({
      projects: pick(doc.stats.projectsLabel, lang),
      brands: pick(doc.stats.brandsLabel, lang),
      since: pick(doc.stats.sinceLabel, lang),
    });
    if (Object.keys(stats).length > 0) setIf('stats', stats as AiPoweredPageCopy['stats']);

    if (doc.stats.sinceYear) {
      setIf('statsValues', { sinceYear: doc.stats.sinceYear });
    }
  }

  if (doc.process) {
    const steps = (doc.process.steps ?? [])
      .map((step) => {
        const title = pick(step.title, lang);
        const sub = pick(step.sub, lang);
        return title || sub ? { title: title ?? '', sub: sub ?? '' } : null;
      })
      .filter((v): v is { title: string; sub: string } => v !== null);

    const process = omitUndefined({
      sectionLabel: pick(doc.process.sectionLabel, lang),
      heading: pick(doc.process.heading, lang),
      steps: steps.length > 0 ? steps : undefined,
    });
    if (Object.keys(process).length > 0) setIf('process', process as AiPoweredPageCopy['process']);
  }

  if (doc.filters) {
    const filters: Record<string, string> = {};
    for (const [k, v] of Object.entries(doc.filters)) {
      const val = pick(v as LocalizedField, lang);
      if (val !== undefined) filters[k] = val;
    }
    if (Object.keys(filters).length > 0) setIf('filters', filters as AiPoweredPageCopy['filters']);
  }

  if (doc.seo) {
    const seo = omitUndefined({
      title: pick(doc.seo.title, lang),
      description: pick(doc.seo.description, lang),
    });
    if (Object.keys(seo).length > 0) setIf('seo', seo as SeoCopy);
  }

  return out;
}

// ── Contact ─────────────────────────────────────────────────────────────────

interface ContactDoc {
  sectionLabel?: LocalizedField;
  heading?: LocalizedField;
  description?: LocalizedField;
  channelsLabel?: LocalizedField;
  channelsHeading?: LocalizedField;
  emailLabel?: LocalizedField;
  instagramLabel?: LocalizedField;
  linkedinLabel?: LocalizedField;
  addressLabel?: LocalizedField;
  formLabel?: LocalizedField;
  formHeading?: LocalizedField;
  form?: Record<string, LocalizedField>;
  info?: {
    email?: string;
    instagram?: string;
    linkedin?: string;
    address?: string;
    city?: string;
  };
  seo?: { title?: LocalizedField; description?: LocalizedField };
}

function mapContact(doc: ContactDoc, lang: Lang): Partial<ContactPageCopy> {
  const out: Partial<ContactPageCopy> = {};
  const setIf = <K extends keyof ContactPageCopy>(k: K, v: ContactPageCopy[K] | undefined) => {
    if (v !== undefined) (out as Record<string, unknown>)[k as string] = v;
  };

  setIf('sectionLabel', pick(doc.sectionLabel, lang));
  setIf('heading', pick(doc.heading, lang));
  setIf('description', pick(doc.description, lang));
  setIf('channelsLabel', pick(doc.channelsLabel, lang));
  setIf('channelsHeading', pick(doc.channelsHeading, lang));
  setIf('emailLabel', pick(doc.emailLabel, lang));
  setIf('instagramLabel', pick(doc.instagramLabel, lang));
  setIf('linkedinLabel', pick(doc.linkedinLabel, lang));
  setIf('addressLabel', pick(doc.addressLabel, lang));
  setIf('formLabel', pick(doc.formLabel, lang));
  setIf('formHeading', pick(doc.formHeading, lang));

  if (doc.form) {
    const form: Record<string, string> = {};
    for (const [k, v] of Object.entries(doc.form)) {
      const val = pick(v as LocalizedField, lang);
      if (val !== undefined) form[k] = val;
    }
    if (Object.keys(form).length > 0) setIf('form', form as ContactPageCopy['form']);
  }

  if (doc.info) {
    const info: Record<string, string> = {};
    for (const [k, v] of Object.entries(doc.info)) {
      if (typeof v === 'string' && v.length > 0) info[k] = v;
    }
    if (Object.keys(info).length > 0) setIf('info', info as ContactPageCopy['info']);
  }

  if (doc.seo) {
    const seo = omitUndefined({
      title: pick(doc.seo.title, lang),
      description: pick(doc.seo.description, lang),
    });
    if (Object.keys(seo).length > 0) setIf('seo', seo as SeoCopy);
  }

  return out;
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function getPageCopyPatchFromSanity<K extends PageCopyKey>(
  page: K,
  lang: Lang,
): Promise<Partial<PageCopyByKey[K]> | null> {
  const docId = {
    production: 'productionPageCopy',
    aiPowered: 'aiPoweredPageCopy',
    contact: 'contactPageCopy',
  }[page];

  const doc = await sanityFetch<ProductionDoc & AiPoweredDoc & ContactDoc | null>(
    `*[_id == "${docId}"][0]`,
  );
  if (!doc) return null;

  if (page === 'production') return mapProduction(doc, lang) as Partial<PageCopyByKey[K]>;
  if (page === 'aiPowered') return mapAiPowered(doc, lang) as Partial<PageCopyByKey[K]>;
  return mapContact(doc, lang) as Partial<PageCopyByKey[K]>;
}

// ── SEO overrides ───────────────────────────────────────────────────────────

const SEO_QUERY = `*[_type == "seoOverride" && pageKey == $pageKey][0]{
  en, tr
}`;

interface SeoDoc {
  en?: Partial<SeoCopy> | null;
  tr?: Partial<SeoCopy> | null;
}

export async function getSeoOverrideFromSanity(
  pageKey: string,
  lang: Lang,
): Promise<Partial<SeoCopy> | null> {
  const doc = await sanityFetch<SeoDoc | null>(SEO_QUERY, { pageKey });
  if (!doc) return null;
  const v = lang === 'en' ? doc.en : doc.tr;
  if (!v) return null;
  const out: Partial<SeoCopy> = {};
  if (typeof v.title === 'string' && v.title.length > 0) out.title = v.title;
  if (typeof v.description === 'string' && v.description.length > 0)
    out.description = v.description;
  return Object.keys(out).length > 0 ? out : null;
}
