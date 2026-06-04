import { sanityFetch } from '@/lib/sanity.fetch';
import type { HomeV2Copy } from '@/lib/homeV2.shared';
import type { Lang } from '@/lib/translations';

type LocalizedField = { en?: string | null; tr?: string | null } | null | undefined;

function pick(v: LocalizedField, lang: Lang): string | undefined {
  if (!v) return undefined;
  const localized = v[lang] ?? v.en ?? v.tr;
  return localized && localized.length > 0 ? localized : undefined;
}

const HOME_V2_COPY_QUERY = `*[_id == "homeV2PageCopy"][0]{
  heroLabel,
  heroTitle,
  heroDescription,
  selectedWorksLabel,
  selectedWorksHeading,
  workTitleFallback,
  artistsLabel,
  artistsHeading,
  viewAllArtists,
  aiSplitLabel,
  aiSplitTitle,
  aiSplitBody,
  aiSplitCta,
  aiWorksStat,
  servicesMarqueeLabel,
  clientsMarqueeLabel
}`;

interface HomeV2Doc {
  heroLabel?: LocalizedField;
  heroTitle?: LocalizedField;
  heroDescription?: LocalizedField;
  selectedWorksLabel?: LocalizedField;
  selectedWorksHeading?: LocalizedField;
  workTitleFallback?: LocalizedField;
  artistsLabel?: LocalizedField;
  artistsHeading?: LocalizedField;
  viewAllArtists?: LocalizedField;
  aiSplitLabel?: LocalizedField;
  aiSplitTitle?: LocalizedField;
  aiSplitBody?: LocalizedField;
  aiSplitCta?: LocalizedField;
  aiWorksStat?: LocalizedField;
  servicesMarqueeLabel?: LocalizedField;
  clientsMarqueeLabel?: LocalizedField;
}

function mapHomeV2Patch(doc: HomeV2Doc | null, lang: Lang): Partial<HomeV2Copy> {
  if (!doc) return {};
  const out: Partial<HomeV2Copy> = {};
  const fields: (keyof HomeV2Doc)[] = [
    'heroLabel',
    'heroTitle',
    'heroDescription',
    'selectedWorksLabel',
    'selectedWorksHeading',
    'workTitleFallback',
    'artistsLabel',
    'artistsHeading',
    'viewAllArtists',
    'aiSplitLabel',
    'aiSplitTitle',
    'aiSplitBody',
    'aiSplitCta',
    'aiWorksStat',
    'servicesMarqueeLabel',
    'clientsMarqueeLabel',
  ];
  for (const key of fields) {
    const value = pick(doc[key] as LocalizedField, lang);
    if (value) (out as Record<string, string>)[key] = value;
  }
  return out;
}

export async function getHomeV2CopyPatchFromSanity(
  lang: Lang,
): Promise<Partial<HomeV2Copy>> {
  const doc = await sanityFetch<HomeV2Doc | null>(HOME_V2_COPY_QUERY);
  return mapHomeV2Patch(doc, lang);
}
