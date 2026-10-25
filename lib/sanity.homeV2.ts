import { sanityFetch } from '@/lib/sanity.fetch';
import type { HomeAiSceneImage, HomeV2Copy } from '@/lib/homeV2.shared';
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
  clientsMarqueeLabel,
  aiSceneLeft,
  aiSceneRight,
  artistsIntro,
  clientsHeading,
  clientsIntro
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
  aiSceneLeft?: LocalizedField;
  aiSceneRight?: LocalizedField;
  artistsIntro?: LocalizedField;
  clientsHeading?: LocalizedField;
  clientsIntro?: LocalizedField;
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
    'aiSceneLeft',
    'aiSceneRight',
    'artistsIntro',
    'clientsHeading',
    'clientsIntro',
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

const HOME_AI_SCENE_QUERY = `*[_id == "homeV2PageCopy"][0].aiSceneItems[]->{
  "src": image.asset->url,
  "tags": tags[]->{ en, tr }
}`;

type RawSceneImage = { src?: string | null; tags?: LocalizedField[] | null } | null;

/** The AI Portfolio images picked for the home AI scene, in Studio order. */
export async function getHomeAiSceneImagesFromSanity(lang: Lang): Promise<HomeAiSceneImage[]> {
  const rows = await sanityFetch<RawSceneImage[] | null>(HOME_AI_SCENE_QUERY);
  const out: HomeAiSceneImage[] = [];
  for (const row of rows ?? []) {
    if (typeof row?.src !== 'string' || row.src.length === 0) continue;
    const tags = (row.tags ?? []).map((t) => pick(t, lang)).filter((t): t is string => !!t);
    out.push({ src: row.src, tags });
  }
  return out;
}
