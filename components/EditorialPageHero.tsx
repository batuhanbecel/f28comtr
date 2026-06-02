'use client';

import type { ReactNode } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { HeroReveal } from '@/components/HeroReveal';
import { ScrollIndicator } from '@/components/ScrollIndicator';
import { F28LogoBg } from '@/components/F28LogoBg';
import { translations, type Lang } from '@/lib/translations';

export type EditorialHeroPage = 'production' | 'aiPowered' | 'aiPoweredPortfolio' | 'about' | 'portfolios' | 'contact';

interface EditorialPageHeroProps {
  page: EditorialHeroPage;
  /** Server-resolved language — avoids hydration mismatch vs context default. */
  lang: Lang;
  /** When set, overrides translation defaults (e.g. Redis-backed page copy). */
  heroCopy?: { label: string; title: string; description?: string };
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
  lang,
  heroCopy,
  children,
  scrollSnap = false,
  showScroll = true,
  className = '',
}: EditorialPageHeroProps) {
  const t = translations[lang];

  const builtInCopy: { label: string; title: string; description?: string } = {
    production: {
      label: t.production.sectionLabel,
      title: t.production.heading,
      description: t.production.description,
    },
    aiPowered: {
      label: t.aiPowered.sectionLabel,
      title: t.aiPowered.heading,
      description: t.aiPowered.description,
    },
    aiPoweredPortfolio: {
      label: t.aiPoweredPortfolio.sectionLabel,
      title: t.aiPoweredPortfolio.heading,
      description: t.aiPoweredPortfolio.description,
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
    contact: {
      label: t.contact.sectionLabel,
      title: t.contact.heading,
      description: t.contact.description,
    },
  }[page];

  const copy = heroCopy ?? builtInCopy;

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
