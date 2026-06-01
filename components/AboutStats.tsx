'use client';

import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/ScrollReveal';

interface AboutStatsProps {
  photographerCount: number;
  clientCount: number;
  partnerCount: number;
}

export function AboutStats({ photographerCount, clientCount, partnerCount }: AboutStatsProps) {
  const { lang } = useLanguage();

  const stats = lang === 'tr'
    ? [
        { value: '2008', label: 'Kuruluş' },
        { value: String(photographerCount), label: 'Sanatçı' },
        { value: String(clientCount) + '+', label: 'Müşteri' },
        { value: String(partnerCount), label: 'Partner Ajans' },
        { value: '6', label: 'Hizmet Alanı' },
        { value: 'IST', label: 'İstanbul' },
      ]
    : [
        { value: '2008', label: 'Established' },
        { value: String(photographerCount), label: 'Artists' },
        { value: String(clientCount) + '+', label: 'Clients' },
        { value: String(partnerCount), label: 'Partner Agencies' },
        { value: '6', label: 'Services' },
        { value: 'IST', label: 'Istanbul' },
      ];

  return (
    <section className="border-y border-th-fg/[0.07]">
      <div className="grid grid-cols-3 md:grid-cols-6">
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 0.05}>
            <div className="flex flex-col items-center justify-center py-10 md:py-14 border-r border-th-fg/[0.05] last:border-r-0 stats-cell">
              <span className="text-2xl md:text-4xl font-black tracking-tighter text-th-fg">
                {stat.value}
              </span>
              <span className="text-[8px] md:text-[9px] tracking-[0.45em] uppercase text-th-fg/25 mt-2">
                {stat.label}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
