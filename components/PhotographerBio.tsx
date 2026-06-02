'use client';

import { useLanguage } from '@/context/LanguageContext';

interface PhotographerBioProps {
  bio?: { en: string; tr: string };
  instagram?: string;
  website?: string;
}

export function PhotographerBio({ bio, instagram, website }: PhotographerBioProps) {
  const { lang, t } = useLanguage();
  const text = bio ? bio[lang]?.trim() : '';
  const hasLinks = Boolean(instagram || website);

  if (!text && !hasLinks) return null;

  return (
    <section className="px-6 md:px-12 max-w-3xl mx-auto pt-12 md:pt-16 pb-2">
      {text ? (
        <p className="body-text text-muted-body leading-relaxed whitespace-pre-line">{text}</p>
      ) : null}

      {hasLinks ? (
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <span className="section-label">{t.footer.follow}</span>
          {instagram ? (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-chip hover:border-th-fg/30 transition-colors"
            >
              Instagram
            </a>
          ) : null}
          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-chip hover:border-th-fg/30 transition-colors"
            >
              Website
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
