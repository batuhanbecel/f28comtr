import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { LANG_COOKIE, langFromAcceptLanguage, parseLang } from '@/lib/prefs';
import { getPageSeo, type Photographer, type SeoCopy } from '@/lib/cms';
import { absoluteUrl } from '@/lib/siteUrl';
import { translations, type Lang } from '@/lib/translations';

const SITE_NAME = 'f/2.8 Production Agency';

export type SeoPageKey =
  | 'home'
  | 'production'
  | 'aiPowered'
  | 'aiPoweredPortfolio'
  | 'portfolios'
  | 'about'
  | 'contact';

export async function getMetadataLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LANG_COOKIE)?.value;
  if (fromCookie) return parseLang(fromCookie);

  const headersList = await headers();
  return langFromAcceptLanguage(headersList.get('accept-language'));
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

function languageAlternates(path: string) {
  const en = absoluteUrl(path);
  const tr = absoluteUrl(path.includes('?') ? `${path}&lang=tr` : `${path}?lang=tr`);
  return {
    canonical: en,
    languages: {
      en,
      tr,
      'x-default': en,
    },
  };
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
  const ogLocaleAlternate = lang === 'tr' ? 'en_US' : 'tr_TR';

  const metadata: Metadata = {
    title,
    description,
    ...(!noIndex
      ? {
          alternates: languageAlternates(path),
        }
      : {}),
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: ogLocale,
      alternateLocale: [ogLocaleAlternate],
      siteName: SITE_NAME,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
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
  seoCopy?: SeoCopy,
): Metadata {
  const copy = seoCopy ?? getSeoCopy(lang, page);
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
  const seo = await getPageSeo(page, lang);
  return buildPageMetadataFromSeoKey(lang, page, path, overrides, seo);
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
  const description = formatSeoTemplate(copy.descriptionTemplate, {
    name: photographer.fullName,
    title: photographer.title,
  });

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
