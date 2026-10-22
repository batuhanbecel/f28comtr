'use client';

import { EditorialButton } from '@/components/EditorialButton';
import { DisplayCase } from '@/components/DisplayCase';
import { HeroReveal } from '@/components/HeroReveal';
import { useLanguage } from '@/context/LanguageContext';
import type { HomeV2HeroSlide } from '@/lib/homeV2.shared';
import { HomeV2HeroSlider } from './HomeV2HeroSlider';

interface HomeV2HeroProps {
  heroLabel: string;
  heroTitle: string;
  heroDescription: string;
  heroImages: string[];
}

/**
 * Full-bleed, full-colour work with the copy anchored bottom-left.
 * Only the strip behind the text is darkened — the photograph stays the subject.
 */
export function HomeV2Hero({ heroLabel, heroTitle, heroDescription, heroImages }: HomeV2HeroProps) {
  const slides: HomeV2HeroSlide[] | undefined =
    heroImages.length > 0
      ? heroImages.map((src, i) => ({
          src,
          alt: `f/2.8 Production — selected work ${i + 1}`,
        }))
      : undefined;
  const { t } = useLanguage();

  return (
    <section className="home-v2-hero relative h-[100svh] min-h-[560px] flex flex-col">
      <div className="home-v2-hero-media absolute inset-0 overflow-hidden">
        <HomeV2HeroSlider slides={slides} />
        <div className="home-v2-hero-scrim absolute inset-0 z-[3] pointer-events-none" aria-hidden />
      </div>

      {/* Wrapper ignores pointer events so the slide dots below the copy stay clickable */}
      <div className="relative z-10 mt-auto w-full px-6 md:px-12 pb-16 md:pb-20 pointer-events-none">
        <HeroReveal className="home-v2-hero-content max-w-[80rem] mx-auto text-white pointer-events-auto">
          <span className="section-label text-white">{heroLabel}</span>
          <h1 className="heading-hero home-v2-hero-title">
            <DisplayCase>{heroTitle}</DisplayCase>
          </h1>
          <div className="home-v2-hero-foot">
            <p className="home-v2-hero-intro">{heroDescription}</p>
            <div className="home-v2-hero-ctas flex flex-wrap items-center gap-3">
              <EditorialButton href="/production" variant="light" className="home-v2-hero-cta--solid">
                {t.nav.production}
              </EditorialButton>
              <EditorialButton href="/ai-powered" variant="light">
                {t.nav.aiPowered}
              </EditorialButton>
            </div>
          </div>
        </HeroReveal>
      </div>
    </section>
  );
}
