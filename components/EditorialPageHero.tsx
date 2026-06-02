'use client';

import type { ReactNode } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PageHeader } from '@/components/PageHeader';
import { HeroReveal } from '@/components/HeroReveal';
import { ScrollIndicator } from '@/components/ScrollIndicator';
import { F28LogoBg } from '@/components/F28LogoBg';

export type EditorialHeroPage = 'production' | 'generativeWorkflow' | 'about' | 'portfolios';

interface EditorialPageHeroProps {
  page: EditorialHeroPage;
  children?: ReactNode;
  scrollSnap?: boolean;
  showScroll?: boolean;
  className?: string;
}

/**
 * Full-viewport editorial hero — shared layout, animation, and scroll hint
 * across Production, AI Based, About (with or without stats/footer slot).
 */
export function EditorialPageHero({
  page,
  children,
  scrollSnap = false,
  showScroll = true,
  className = '',
}: EditorialPageHeroProps) {
  const { t } = useLanguage();

  const copy: { label: string; title: string; description?: string } = {
    production: {
      label: t.production.sectionLabel,
      title: t.production.heading,
      description: t.production.description,
    },
    generativeWorkflow: {
      label: t.generativeWorkflow.sectionLabel,
      title: t.generativeWorkflow.heading,
      description: t.generativeWorkflow.description,
    },
    about: {
      label: t.about.sectionLabel,
      title: t.about.heading,
      description: t.about.description,
    },
    portfolios: {
      label: t.portfolios.sectionLabel,
      title: t.portfolios.heading,
    },
  }[page];

  return (
    <section
      className={`hero-screen h-screen flex flex-col items-center justify-center px-6 md:px-12 text-center relative overflow-hidden ${className}`.trim()}
      style={scrollSnap ? { scrollSnapAlign: 'start' } : undefined}
    >
      <F28LogoBg />
      <HeroReveal className="flex flex-col items-center w-full max-w-5xl flex-1 justify-center relative z-10">
        <PageHeader
          label={copy.label}
          title={copy.title}
          description={copy.description}
          variant="hero"
          preline
          animate={false}
          shell={false}
        />
        {children ? (
          <div className="mt-8 w-full flex flex-col items-center">{children}</div>
        ) : null}
      </HeroReveal>
      {showScroll ? <ScrollIndicator inHero /> : null}
    </section>

  );
}
