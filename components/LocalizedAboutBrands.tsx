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
      <section className="py-20 md:py-28 px-8 md:px-16 border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div>
              <span className="section-label">{t.about.collaborationsLabel}</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter mt-2">{t.about.partnerAgencies}</h2>
            </div>
            <div className="flex-1 h-px bg-white/[0.06] hidden md:block" />
            <span className="text-white/15 font-mono text-[10px] tracking-[0.3em] hidden md:block">
              {String(partnerLogos.length).padStart(2, '0')}
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-[1px] bg-white/[0.04] border border-white/[0.06] overflow-hidden">
            {partnerLogos.map((logo) => {
              const name = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') ?? '';
              return (
                <div key={logo} className="relative aspect-square flex items-center justify-center bg-black group hover:bg-white/[0.03] transition-colors duration-500">
                  <Image
                    src={logo} alt={name} fill
                    className="object-contain brightness-0 invert opacity-25 group-hover:opacity-70 transition-all duration-500 p-5 md:p-6 group-hover:scale-105"
                    sizes="12vw" loading="eager"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="py-20 md:py-28 px-8 md:px-16 border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div>
              <span className="section-label">{t.about.whoWeWorkWith}</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter mt-2">{t.about.clientsHeading}</h2>
            </div>
            <div className="flex-1 h-px bg-white/[0.06] hidden md:block" />
            <span className="text-white/15 font-mono text-[10px] tracking-[0.3em] hidden md:block">
              {String(clientLogos.length).padStart(2, '0')}
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-[1px] bg-white/[0.04] border border-white/[0.06] overflow-hidden">
            {clientLogos.map((logo) => {
              const name = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') ?? '';
              return (
                <div key={logo} className="relative aspect-square flex items-center justify-center bg-black group hover:bg-white/[0.03] transition-colors duration-500">
                  <Image
                    src={logo} alt={name} fill
                    className="object-contain brightness-0 invert opacity-20 group-hover:opacity-65 transition-all duration-500 p-4 md:p-5 group-hover:scale-105"
                    sizes="10vw" loading="eager"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
