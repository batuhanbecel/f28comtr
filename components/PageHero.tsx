'use client';

import { useLanguage } from '@/context/LanguageContext';
import { PageHeader } from '@/components/PageHeader';

type HeroPage = 'production' | 'aiBased' | 'about';

interface LocalizedHeroProps {
  page: HeroPage;
  imageCount?: number;
}

export function PageHero({ page, imageCount }: LocalizedHeroProps) {
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
    <PageHeader
      label={config.label}
      title={config.heading}
      description={config.description}
      variant="hero"
      preline
    >
      {page === 'aiBased' && imageCount != null && imageCount > 0 ? (
        <p className="text-th-fg/25 text-[10px] tracking-[0.5em] uppercase font-mono">
          {imageCount} {t.aiBased.worksLabel}
        </p>
      ) : null}
    </PageHeader>
  );
}

export function LocalizedHero(props: LocalizedHeroProps) {
  return <PageHero {...props} />;
}
