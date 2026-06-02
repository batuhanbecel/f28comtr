'use client';

import { EditorialButton } from '@/components/EditorialButton';
import { HeroReveal } from '@/components/HeroReveal';
import { ProductionStats } from '@/components/ProductionStats';
import { useLanguage } from '@/context/LanguageContext';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';
import { HomeV2HeroLogo } from './HomeV2HeroLogo';
import { HomeV2HeroSlider } from './HomeV2HeroSlider';

interface HomeV2HeroProps {
  heroTitle: string;
  stats: Pick<ProductionPageCopy, 'stats' | 'statsValues'>;
}

export function HomeV2Hero({ heroTitle, stats }: HomeV2HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="home-v2-hero relative h-screen min-h-[560px] overflow-hidden flex flex-col">
      <div className="home-v2-hero-media absolute inset-0" aria-hidden>
        <HomeV2HeroSlider />
        <div className="home-v2-hero-scrim absolute inset-0" />
        <div className="home-v2-hero-grain absolute inset-0" />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--c-bg)/0.65)] via-[rgb(var(--c-bg)/0.5)] to-[rgb(var(--c-bg)/0.94)] pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col px-6 md:px-12 pt-28 pb-16 md:pb-20">
        <HeroReveal className="home-v2-hero-content flex flex-1 flex-col items-center justify-center w-full max-w-5xl mx-auto text-center">
          <HomeV2HeroLogo title={heroTitle} />

          <div className="home-v2-hero-ctas flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <EditorialButton href="/production" variant="primary">
              {t.nav.production}
            </EditorialButton>
            <EditorialButton href="/ai-powered" variant="light">
              {t.nav.aiPowered}
            </EditorialButton>
          </div>

          <ProductionStats
            copy={stats}
            inHero
            className="home-v2-hero-stats w-full max-w-3xl border-th-fg/12"
          />
        </HeroReveal>
      </div>
    </section>
  );
}
