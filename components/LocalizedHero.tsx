'use client';

import { useLanguage } from '@/context/LanguageContext';

type HeroPage = 'production' | 'aiBased' | 'about';

interface LocalizedHeroProps {
  page: HeroPage;
  imageCount?: number;
}

export function LocalizedHero({ page, imageCount }: LocalizedHeroProps) {
  const { t } = useLanguage();

  const config = {
    production: {
      label: t.production.sectionLabel,
      heading: t.production.heading,
      description: t.production.description,
    },
    aiBased: {
      label: t.aiBased.sectionLabel,
      heading: t.aiBased.heading,
      description: t.aiBased.description,
    },
    about: {
      label: t.about.sectionLabel,
      heading: t.about.heading,
      description: t.about.description,
    },
  }[page];

  return (
    <div className="text-center max-w-5xl mx-auto">
      <div className="hero-rule fade-in-up" style={{ animationDelay: '0.05s' }} />
      <span className="section-label fade-in-up" style={{ animationDelay: '0.1s' }}>
        {config.label}
      </span>
      <h1
        className="heading-hero gradient-text fade-in-up mt-2"
        style={{ animationDelay: '0.2s', whiteSpace: 'pre-line' }}
      >
        {config.heading}
      </h1>
      <p className="body-text max-w-3xl mx-auto opacity-50 mt-8 fade-in-up" style={{ animationDelay: '0.25s' }}>
        {config.description}
      </p>
      {page === 'aiBased' && imageCount != null && imageCount > 0 && (
        <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mt-6 fade-in-up" style={{ animationDelay: '0.35s' }}>
          {imageCount} {t.aiBased.worksLabel}
        </p>
      )}
    </div>
  );
}
