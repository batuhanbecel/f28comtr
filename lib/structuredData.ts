import type { SiteContactInfo } from '@/context/LanguageContext';
import { PUBLIC_SITE_ROUTES } from '@/lib/siteRoutes';
import { absoluteUrl } from '@/lib/siteUrl';
import { SITE_NAME } from '@/lib/seo';
import type { Lang } from '@/lib/translations';

const ORG_DESCRIPTION: Record<Lang, string> = {
  en: 'Professional photography, video, CGI, and AI-powered production agency in Istanbul since 2008.',
  tr: '2008’den beri İstanbul merkezli profesyonel fotoğraf, video, CGI ve AI destekli prodüksiyon ajansı.',
};

export function getOrganizationStructuredData(
  siteUrl: string,
  info: SiteContactInfo,
  lang: Lang,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: absoluteUrl('/icon'),
    email: info.email,
    description: ORG_DESCRIPTION[lang],
    address: {
      '@type': 'PostalAddress',
      streetAddress: info.address,
      addressLocality: 'Şişli',
      addressRegion: 'İstanbul',
      postalCode: '34387',
      addressCountry: 'TR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: info.email,
      url: `${siteUrl}/contact`,
      availableLanguage: ['English', 'Turkish'],
    },
    sameAs: [info.instagram, info.linkedin],
    foundingDate: '2008',
    knowsAbout: [
      'Photography',
      'Videography',
      'Retouching',
      'CGI',
      'AI-Powered Production',
      'Commercial Photography',
    ],
  };
}

export function getWebsiteStructuredData(siteUrl: string, photographerIds: string[] = []) {
  const staticParts = PUBLIC_SITE_ROUTES.map((route) => ({
    '@type': 'WebPage' as const,
    url: `${siteUrl}${route.path}`,
  }));

  const photographerParts = photographerIds.map((id) => ({
    '@type': 'WebPage' as const,
    url: `${siteUrl}/${id}`,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: siteUrl },
    inLanguage: ['en', 'tr'],
    hasPart: [...staticParts, ...photographerParts],
  };
}
