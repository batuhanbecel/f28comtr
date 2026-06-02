'use client';

import { HeroReveal } from '@/components/HeroReveal';
import { PageHeader } from '@/components/PageHeader';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';
import { HomeV2HeroSlider } from './HomeV2HeroSlider';

interface HomeV2HeroProps {
  heroTitle: string;
  stats: Pick<ProductionPageCopy, 'stats' | 'statsValues'>;
}

export function HomeV2Hero({ heroTitle, stats }: HomeV2HeroProps) {
  const statItems = [
    { value: stats.statsValues.sinceYear, label: stats.stats.since },
    { value: stats.statsValues.projects, label: stats.stats.projects },
    { value: stats.statsValues.brands, label: stats.stats.brands },
  ];

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

      <div className="relative z-10 flex flex-1 flex-col px-6 md:px-12 pt-28 pb-10 md:pb-14">
        <HeroReveal className="flex flex-1 flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-6 w-full max-w-7xl mx-auto">
          <div className="flex flex-1 items-center justify-center md:flex-[1.2] w-full min-w-0">
            <PageHeader
              title={heroTitle}
              variant="hero"
              shell={false}
              animate={false}
              align="center"
              className="w-full max-w-5xl"
            />
          </div>

          <aside className="flex shrink-0 flex-row md:flex-col items-stretch justify-center md:items-end md:justify-center gap-0 md:gap-0 border border-th-fg/10 md:min-w-[200px] divide-x md:divide-x-0 md:divide-y divide-th-fg/10">
            {statItems.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-1 md:flex-none flex-col items-center md:items-end justify-center gap-1.5 py-5 md:py-6 px-4 md:px-6 text-center md:text-right"
              >
                <span
                  className="font-black tracking-tighter text-th-fg leading-none"
                  style={{ fontSize: 'clamp(1.35rem, 3.2vw, 2.25rem)' }}
                >
                  {stat.value}
                </span>
                <span className="text-[8px] md:text-[9px] tracking-[0.38em] uppercase font-mono text-th-fg/40 max-w-[10rem] leading-relaxed">
                  {stat.label}
                </span>
              </div>
            ))}
          </aside>
        </HeroReveal>
      </div>
    </section>
  );
}
