'use client';

import { ScrollReveal } from '@/components/ScrollReveal';
import type { AiPoweredPageCopy } from '@/lib/pageCopy.types';

interface AiPoweredStatsProps {
  workCount: number;
  brandCount: number;
  copy: Pick<AiPoweredPageCopy, 'stats' | 'statsValues'>;
  inHero?: boolean;
}

export function AiPoweredStats({ workCount, brandCount, copy, inHero = false }: AiPoweredStatsProps) {
  const stats = [
    { value: `${workCount}+`, label: copy.stats.projects },
    { value: `${brandCount}+`, label: copy.stats.brands },
    { value: copy.statsValues.sinceYear, label: copy.stats.since },
  ];

  return (
    <section className="border-y border-th-fg/[0.12] w-full max-w-2xl mx-auto">
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
              <span className="text-[8px] md:text-[9px] tracking-[0.38em] uppercase font-mono text-th-fg/35 text-center leading-relaxed">
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
