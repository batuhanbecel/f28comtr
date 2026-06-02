'use client';

import { AboutStats } from '@/components/AboutStats';
import { Footer } from '@/components/Footer';
import type { Photographer } from '@/lib/data';
import type { HomeSelectedWork } from '@/lib/homeV2.shared';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';
import type { translations } from '@/lib/translations';
import { HomeV2Hero } from './HomeV2Hero';
import { HomeV2ServicesMarquee } from './HomeV2ServicesMarquee';
import { HomeV2SelectedWorks } from './HomeV2SelectedWorks';
import { HomeV2ArtistsGrid } from './HomeV2ArtistsGrid';
import { HomeV2AiSplit } from './HomeV2AiSplit';
import { HomeV2ClientLogosMarquee } from './HomeV2ClientLogosMarquee';

type HomeV2Copy = (typeof translations.en)['homeV2'];

interface HomeV2PageContentProps {
  copy: HomeV2Copy;
  productionCopy: Pick<ProductionPageCopy, 'stats' | 'statsValues' | 'services'>;
  selectedWorks: HomeSelectedWork[];
  photographers: Photographer[];
  photographerCount: number;
  clientCount: number;
  partnerCount: number;
  aiWorkCount: number;
  aiBrands: string[];
  clientLogos: string[];
}

export function HomeV2PageContent({
  copy,
  productionCopy,
  selectedWorks,
  photographers,
  photographerCount,
  clientCount,
  partnerCount,
  aiWorkCount,
  aiBrands,
  clientLogos,
}: HomeV2PageContentProps) {
  const serviceTitles = productionCopy.services.items.map((item) => item.title);

  return (
    <main className="min-h-screen bg-th-bg text-th-fg">
      <HomeV2Hero heroTitle={copy.heroTitle} stats={productionCopy} />

      <HomeV2ServicesMarquee label={copy.servicesMarqueeLabel} items={serviceTitles} />

      <HomeV2SelectedWorks
        works={selectedWorks}
        sectionLabel={copy.selectedWorksLabel}
        heading={copy.selectedWorksHeading}
      />

      <AboutStats
        photographerCount={photographerCount}
        clientCount={clientCount}
        partnerCount={partnerCount}
      />

      <HomeV2ArtistsGrid
        photographers={photographers}
        sectionLabel={copy.artistsLabel}
        heading={copy.artistsHeading}
        viewAllLabel={copy.viewAllArtists}
      />

      <HomeV2AiSplit
        label={copy.aiSplitLabel}
        title={copy.aiSplitTitle}
        body={copy.aiSplitBody}
        cta={copy.aiSplitCta}
        workCount={aiWorkCount}
        worksStatLabel={copy.aiWorksStat}
        brands={aiBrands}
      />

      <HomeV2ClientLogosMarquee label={copy.clientsMarqueeLabel} logos={clientLogos} />

      <Footer />
    </main>
  );
}
