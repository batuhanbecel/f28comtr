'use client';

import { useLanguage } from '@/context/LanguageContext';
import { BlockHead } from '@/components/gallery/BlockHead';
import { ScrollReveal } from '@/components/ScrollReveal';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';

interface AboutStatsProps {
  photographerCount: number;
  /** Studio-wide figures edited in the CMS (projects, brands, founding year). */
  production: Pick<ProductionPageCopy, 'stats' | 'statsValues'>;
}

/** The one place the studio's numbers live — large figures on hairlines. */
export function AboutStats({ photographerCount, production }: AboutStatsProps) {
  const { lang, t } = useLanguage();
  const tr = lang === 'tr';

  // Client and partner counts were logo counts (18+ clients next to 150+ brands);
  // the logo walls below already show them
  const stats = [
    { value: production.statsValues.projects, label: production.stats.projects },
    { value: production.statsValues.brands, label: production.stats.brands },
    { value: String(photographerCount), label: tr ? 'Sanatçı' : 'Artists' },
    { value: production.statsValues.sinceYear, label: tr ? 'Kuruluş, İstanbul' : 'Founded in Istanbul' },
  ];

  return (
    <section className="g-section" aria-labelledby="about-stats-title">
      <BlockHead id="about-stats-title" label={t.about.statsLabel} title={t.about.statsHeading} />
      <div className="g-inner">
        <dl className="about-stats__grid">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.05} className="about-stats__item">
              <dt className="about-stats__label">{stat.label}</dt>
              <dd className="about-stats__value">{stat.value}</dd>
            </ScrollReveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
