'use client';

import { useLanguage } from '@/context/LanguageContext';

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
    <section className="border-y border-white/[0.07]">
      <div className="grid grid-cols-3 md:grid-cols-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center py-10 md:py-14 border-r border-white/[0.05] last:border-r-0 relative group"
          >
            <span className="text-2xl md:text-3xl font-black tracking-tight text-white/90">
              {stat.value}
            </span>
            <span className="text-[8px] md:text-[9px] tracking-[0.45em] uppercase text-white/25 mt-2">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
