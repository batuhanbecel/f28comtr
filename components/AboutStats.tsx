'use client';

import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/ScrollReveal';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';

interface AboutStatsProps {
  photographerCount: number;
  clientCount: number;
  partnerCount: number;
  /** Studio-wide figures edited in the CMS (projects, brands, founding year). */
  production: Pick<ProductionPageCopy, 'stats' | 'statsValues'>;
}

/** The one place the studio's numbers live — large serif figures, left aligned. */
export function AboutStats({ photographerCount, clientCount, partnerCount, production }: AboutStatsProps) {
  const { lang } = useLanguage();
  const tr = lang === 'tr';

  const stats = [
    { value: production.statsValues.projects, label: production.stats.projects },
    { value: production.statsValues.brands, label: production.stats.brands },
    { value: String(photographerCount), label: tr ? 'Sanatçı' : 'Artists' },
    { value: `${clientCount}+`, label: tr ? 'Müşteri' : 'Clients' },
    { value: String(partnerCount), label: tr ? 'Partner ajans' : 'Partner agencies' },
    { value: production.statsValues.sinceYear, label: tr ? 'Kuruluş, İstanbul' : 'Founded in Istanbul' },
  ];

  return (
    <section className="about-stats page-section">
      <dl className="about-stats__grid">
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 0.05} className="about-stats__item">
            <dt className="about-stats__label">{stat.label}</dt>
            <dd className="about-stats__value">{stat.value}</dd>
          </ScrollReveal>
        ))}
      </dl>
    </section>
  );
}
