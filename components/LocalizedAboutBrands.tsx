'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface LocalizedAboutBrandsProps {
  partnerLogos: string[];
  clientLogos: string[];
}

export function LocalizedAboutBrands({ partnerLogos, clientLogos }: LocalizedAboutBrandsProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Partner Agencies */}
      <section className="py-24 px-8 md:px-16 border-t border-white/[0.07]">
        <div className="mb-14">
          <span className="section-label">{t.about.collaborationsLabel}</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mt-3">{t.about.partnerAgencies}</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-px border border-white/[0.07]">
          {partnerLogos.map((logo) => {
            const name = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') ?? '';
            return (
              <div key={logo} className="relative aspect-square flex items-center justify-center border-r border-b border-white/[0.05] group">
                <Image
                  src={logo} alt={name} fill
                  className="object-contain brightness-0 invert opacity-30 group-hover:opacity-65 transition-opacity duration-500 p-5"
                  sizes="12vw" loading="eager"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Clients */}
      <section className="py-24 px-8 md:px-16 border-t border-white/[0.07]">
        <div className="mb-14">
          <span className="section-label">{t.about.whoWeWorkWith}</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mt-3">{t.about.clientsHeading}</h2>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-px border border-white/[0.07]">
          {clientLogos.map((logo) => {
            const name = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') ?? '';
            return (
              <div key={logo} className="relative aspect-square flex items-center justify-center border-r border-b border-white/[0.05] group">
                <Image
                  src={logo} alt={name} fill
                  className="object-contain brightness-0 invert opacity-25 group-hover:opacity-60 transition-opacity duration-500 p-4"
                  sizes="10vw" loading="eager"
                />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
