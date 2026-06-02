import { createOgImage, OG_CONTENT_TYPE, OG_IMAGE_SIZE } from '@/lib/createOgImage';
import { getMetadataLang, type SeoPageKey } from '@/lib/seo';
import { getPageSeo } from '@/lib/siteSeo';
import type { Lang } from '@/lib/translations';

const OG_FOOTER: Record<Lang, string> = {
  en: 'Istanbul, Turkey — Since 2008',
  tr: 'İstanbul — 2008’den beri',
};

const OG_SUBTITLE: Partial<Record<SeoPageKey, Record<Lang, string>>> = {
  home: {
    en: 'Photography · Retouching · AI-Powered',
    tr: 'Fotoğraf · Retouch · AI-Powered',
  },
  production: {
    en: 'Photography · Retouching · Commercial',
    tr: 'Fotoğraf · Retouch · Ticari',
  },
};

function ogHeadline(metaTitle: string): string {
  const short = metaTitle.split('|')[0]?.trim() ?? metaTitle;
  if (short.length <= 36) return short;
  return `${short.slice(0, 33)}…`;
}

export async function renderRouteOgImage(
  page: SeoPageKey,
  options?: { subtitle?: string },
) {
  const lang = await getMetadataLang();
  const seo = await getPageSeo(page, lang);
  const subtitle = options?.subtitle ?? OG_SUBTITLE[page]?.[lang];

  return createOgImage({
    alt: seo.title,
    title: ogHeadline(seo.title),
    subtitle,
    footer: OG_FOOTER[lang],
  });
}
