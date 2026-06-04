'use client';

import { EditorialButton } from '@/components/EditorialButton';
import { HeroReveal } from '@/components/HeroReveal';
import { PageHeader } from '@/components/PageHeader';
import { ProductionStats } from '@/components/ProductionStats';
import { ScrollIndicator } from '@/components/ScrollIndicator';
import { useLanguage } from '@/context/LanguageContext';
import type { HomeV2HeroSlide } from '@/lib/homeV2.shared';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';
import { HomeV2HeroSlider } from './HomeV2HeroSlider';

interface HomeV2HeroProps {
  heroLabel: string;
  heroTitle: string;
  heroDescription: string;
  heroImages: string[];
  stats: Pick<ProductionPageCopy, 'stats' | 'statsValues'>;
}

export function HomeV2Hero({
  heroLabel,
  heroTitle,
  heroDescription,
  heroImages,
  stats,
}: HomeV2HeroProps) {
  const slides: HomeV2HeroSlide[] | undefined =
    heroImages.length > 0
      ? heroImages.map((src, i) => ({
          src,
          alt: `f/2.8 Production — selected work ${i + 1}`,
        }))
      : undefined;
  const { t } = useLanguage();

  return (
    <section className="home-v2-hero relative h-screen min-h-[560px] flex flex-col">
      <div className="home-v2-hero-media absolute inset-0 overflow-hidden" aria-hidden>
        <HomeV2HeroSlider slides={slides} />
        <div className="home-v2-hero-scrim absolute inset-0" />
        <div className="home-v2-hero-grain absolute inset-0" />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--c-bg)/0.65)] via-[rgb(var(--c-bg)/0.5)] to-[rgb(var(--c-bg)/0.94)] pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col px-6 md:px-12 pt-28 pb-12 md:pb-16">
        <HeroReveal className="home-v2-hero-content flex flex-1 flex-col items-center justify-center w-full max-w-5xl mx-auto text-center">
          <div className="home-v2-hero-headline w-full">
            <PageHeader
              label={heroLabel}
              title={heroTitle}
              description={heroDescription}
              variant="hero"
              shell={false}
              animate={false}
              align="center"
              className="w-full"
            />

            <div className="home-v2-hero-ctas flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <EditorialButton href="/production" variant="primary">
                {t.nav.production}
              </EditorialButton>
              <EditorialButton href="/ai-powered" variant="light">
                {t.nav.aiPowered}
              </EditorialButton>
            </div>
          </div>

          <ProductionStats
            copy={stats}
            inHero
            className="home-v2-hero-stats w-full max-w-3xl border-th-fg/12"
          />
        </HeroReveal>
        <ScrollIndicator inHero />
      </div>
    </section>
  );
}
