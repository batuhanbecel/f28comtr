'use client';

import { useLanguage } from '@/context/LanguageContext';
import { BlockHead } from '@/components/gallery/BlockHead';
import { LogoWall } from '@/components/gallery/LogoWall';

interface LocalizedAboutBrandsProps {
  partnerLogos: string[];
  clientLogos: string[];
}

/** Clients and partner agencies — the same hairline logo wall as the home page. */
export function LocalizedAboutBrands({ partnerLogos, clientLogos }: LocalizedAboutBrandsProps) {
  const { t } = useLanguage();

  return (
    <>
      {clientLogos.length > 0 ? (
        <section className="g-section g-section--flush" aria-labelledby="about-clients-title">
          <BlockHead
            id="about-clients-title"
            label={t.about.whoWeWorkWith}
            title={t.about.clientsHeading}
            actions={<span className="mono-label">{String(clientLogos.length).padStart(2, '0')}</span>}
          />
          <LogoWall logos={clientLogos} label={t.about.clientsHeading} />
        </section>
      ) : null}

      {partnerLogos.length > 0 ? (
        <section className="g-section g-section--flush" aria-labelledby="about-partners-title">
          <BlockHead
            id="about-partners-title"
            label={t.about.collaborationsLabel}
            title={t.about.partnerAgencies}
            actions={<span className="mono-label">{String(partnerLogos.length).padStart(2, '0')}</span>}
          />
          <LogoWall logos={partnerLogos} label={t.about.partnerAgencies} />
        </section>
      ) : null}
    </>
  );
}
