'use client';

import type { ReactNode } from 'react';
import Image from '@/components/Image';
import { HeroReveal } from '@/components/HeroReveal';
import { DisplayCase } from '@/components/DisplayCase';
import { shouldSkipOptimization } from '@/lib/blob';
import { HERO_IMAGE_SIZES } from '@/lib/imageSizes';
import { translations, type Lang } from '@/lib/translations';

export type EditorialHeroPage = 'production' | 'aiPowered' | 'aiPoweredPortfolio' | 'about' | 'portfolios' | 'contact';

interface EditorialPageHeroProps {
  page: EditorialHeroPage;
  /** Server-resolved language — avoids hydration mismatch vs context default. */
  lang: Lang;
  /** When set, overrides translation defaults (e.g. Redis-backed page copy). */
  heroCopy?: { label: string; title: string; description?: string };
  children?: ReactNode;
  /** Full-bleed lead image under the title (the page's LCP when set). */
  media?: { src: string; alt: string };
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
  media,
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

  // Compact, left-aligned editorial header: title left, intro right on wide screens.
  // `scrollSnap` / `showScroll` are accepted for call-site compatibility but no longer used.
  void scrollSnap;
  void showScroll;

  return (
    <section className={`editorial-hero ${media ? 'editorial-hero--media' : ''} ${className}`.trim()}>
      <HeroReveal className="editorial-hero__inner">
        <div className="editorial-hero__title">
          {copy.label ? <span className="section-label">{copy.label}</span> : null}
          <h1 className="heading-hero" style={{ whiteSpace: 'pre-line' }}>
            <DisplayCase>{copy.title}</DisplayCase>
          </h1>
        </div>
        {copy.description ? (
          <p className="editorial-hero__intro body-text text-muted-body">{copy.description}</p>
        ) : null}
        {children ? <div className="editorial-hero__extra">{children}</div> : null}
      </HeroReveal>
      {media ? (
        <div className="editorial-hero__media">
          <Image
            src={media.src}
            alt={media.alt}
            fill
            className="object-cover"
            sizes={HERO_IMAGE_SIZES}
            loading="eager"
            fetchPriority="high"
            unoptimized={shouldSkipOptimization(media.src)}
          />
        </div>
      ) : null}
    </section>
  );
}
