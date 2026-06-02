import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { Photographer } from '@/lib/data';
import { LANG_COOKIE, parseLang } from '@/lib/prefs';
import { absoluteUrl } from '@/lib/siteUrl';
import { translations, type Lang } from '@/lib/translations';

const SITE_NAME = 'f/2.8 Production Agency';

export type SeoPageKey = 'home' | 'production' | 'generativeWorkflow' | 'portfolios' | 'about';

export async function getMetadataLang(): Promise<Lang> {
  const cookieStore = await cookies();
  return parseLang(cookieStore.get(LANG_COOKIE)?.value);
}

export function getSeoCopy(lang: Lang, page: SeoPageKey) {
  return translations[lang].seo[page];
}

export function formatSeoTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
    template,
  );
}

export interface BuildPageMetadataInput {
  path: string;
  title: string;
  description: string;
  lang: Lang;
  image?: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  path,
  title,
  description,
  lang,
  image,
  noIndex,
}: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogLocale = lang === 'tr' ? 'tr_TR' : 'en_US';

  const metadata: Metadata = {
    title,
    description,
    ...(!noIndex
      ? {
          alternates: {
            canonical: url,
          },
        }
      : {}),
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: ogLocale,
      siteName: SITE_NAME,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };

  if (noIndex) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

export function buildPageMetadataFromSeoKey(
  lang: Lang,
  page: SeoPageKey,
  path: string,
  overrides?: Partial<Pick<BuildPageMetadataInput, 'title' | 'description' | 'image' | 'noIndex'>> & {
    absoluteTitle?: boolean;
  },
): Metadata {
  const copy = getSeoCopy(lang, page);
  const title = overrides?.title ?? copy.title;
  const base = buildPageMetadata({
    path,
    title,
    description: overrides?.description ?? copy.description,
    lang,
    image: overrides?.image,
    noIndex: overrides?.noIndex,
  });
  if (overrides?.absoluteTitle || page === 'home') {
    return { ...base, title: { absolute: title } };
  }
  return base;
}

export async function generatePageMetadata(
  page: SeoPageKey,
  path: string,
  overrides?: Partial<Pick<BuildPageMetadataInput, 'title' | 'description' | 'image' | 'noIndex'>> & {
    absoluteTitle?: boolean;
  },
): Promise<Metadata> {
  const lang = await getMetadataLang();
  return buildPageMetadataFromSeoKey(lang, page, path, overrides);
}

export async function generatePhotographerMetadata(
  photographer: Photographer | undefined,
  id: string,
): Promise<Metadata> {
  const lang = await getMetadataLang();
  const path = `/${id}`;

  if (!photographer) {
    const copy = translations[lang].seo.photographer;
    return buildPageMetadata({
      path,
      title: copy.notFoundTitle,
      description: copy.notFoundDescription,
      lang,
      noIndex: true,
    });
  }

  const copy = translations[lang].seo.photographer;
  const title = formatSeoTemplate(copy.titleTemplate, { name: photographer.fullName });
  let description = formatSeoTemplate(copy.descriptionTemplate, {
    name: photographer.fullName,
    title: photographer.title,
  });
  const bio = photographer.bio?.[lang]?.trim();
  if (bio) {
    description = bio.length > 160 ? `${bio.slice(0, 157)}…` : bio;
  }

  const preview = photographer.preview;
  const image = preview.startsWith('http') ? preview : absoluteUrl(preview);

  return buildPageMetadata({
    path,
    title,
    description,
    lang,
    image,
  });
}

export { SITE_NAME };
