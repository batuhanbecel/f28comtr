'use client';

import { ScrollReveal } from '@/components/ScrollReveal';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';

interface ProductionStatsProps {
  copy: Pick<ProductionPageCopy, 'stats' | 'statsValues'>;
  /** Inside HeroReveal — no per-stat scroll stagger */
  inHero?: boolean;
  className?: string;
}

export function ProductionStats({ copy, inHero = false, className = '' }: ProductionStatsProps) {
  const stats = [
    { value: copy.statsValues.projects, label: copy.stats.projects },
    { value: copy.statsValues.brands, label: copy.stats.brands },
    { value: copy.statsValues.sinceYear, label: copy.stats.since },
  ];

  return (
    <section className={`border-y border-th-fg/[0.12] w-full max-w-2xl mx-auto ${className}`.trim()}>
      <div className="flex items-stretch divide-x divide-th-fg/[0.12]">
        {stats.map((stat) => {
          const cell = (
            <div className="flex flex-col items-center justify-center gap-3 py-7 md:py-10 px-4">
              <span
                className="font-black tracking-tighter text-th-fg leading-none"
                style={{ fontSize: 'clamp(1.6rem, 3.8vw, 2.5rem)' }}
              >
                {stat.value}
              </span>
              <span className="stat-label">
                {stat.label}
              </span>
            </div>
          );
          return inHero ? (
            <div key={stat.label} className="flex-1">
              {cell}
            </div>
          ) : (
            <ScrollReveal key={stat.label} className="flex-1">
              {cell}
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
