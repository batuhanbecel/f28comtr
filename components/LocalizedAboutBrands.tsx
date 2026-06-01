'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { PageSection } from '@/components/PageSection';
import { SectionHeader } from '@/components/PageHeader';
import { CLIENT_LOGO_SIZES, PARTNER_LOGO_SIZES } from '@/lib/imageSizes';

interface LocalizedAboutBrandsProps {
  partnerLogos: string[];
  clientLogos: string[];
}

export function LocalizedAboutBrands({ partnerLogos, clientLogos }: LocalizedAboutBrandsProps) {
  const { t } = useLanguage();

  return (
    <>
      <PageSection border>
        <SectionHeader
          label={t.about.collaborationsLabel}
          title={t.about.partnerAgencies}
          action={
            <span className="mono-label hidden md:block">
              {String(partnerLogos.length).padStart(2, '0')}
            </span>
          }
        />
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-[1px] bg-th-fg/[0.04] border border-th-fg/[0.06] overflow-hidden">
          {partnerLogos.map((logo) => {
            const name = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') ?? '';
            return (
              <div key={logo} className="relative aspect-square flex items-center justify-center bg-th-bg group hover:bg-th-fg/[0.03] transition-colors duration-hover ease-snappy">
                <Image
                  src={logo} alt={name} fill
                  className="object-contain brightness-0 dark:invert opacity-25 group-hover:opacity-70 transition-all duration-hover ease-snappy p-5 md:p-6 group-hover:scale-[1.04]"
                  sizes={PARTNER_LOGO_SIZES}
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </PageSection>

      <PageSection border>
        <SectionHeader
          label={t.about.whoWeWorkWith}
          title={t.about.clientsHeading}
          action={
            <span className="mono-label hidden md:block">
              {String(clientLogos.length).padStart(2, '0')}
            </span>
          }
        />
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-[1px] bg-th-fg/[0.04] border border-th-fg/[0.06] overflow-hidden">
          {clientLogos.map((logo) => {
            const name = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') ?? '';
            return (
              <div key={logo} className="relative aspect-square flex items-center justify-center bg-th-bg group hover:bg-th-fg/[0.03] transition-colors duration-hover ease-snappy">
                <Image
                  src={logo} alt={name} fill
                  className="object-contain brightness-0 dark:invert opacity-20 group-hover:opacity-65 transition-all duration-hover ease-snappy p-4 md:p-5 group-hover:scale-[1.04]"
                  sizes={CLIENT_LOGO_SIZES}
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </PageSection>
    </>
  );
}
