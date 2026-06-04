'use client';

import { AboutStats } from '@/components/AboutStats';
import { Footer } from '@/components/Footer';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import type { Photographer } from '@/lib/data';
import type { HomeSelectedWork, HomeV2Copy } from '@/lib/homeV2.shared';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';
import { HomeV2Hero } from './HomeV2Hero';
import { HomeV2ServicesMarquee } from './HomeV2ServicesMarquee';
import { HomeV2SelectedWorks } from './HomeV2SelectedWorks';
import { HomeV2ArtistsGrid } from './HomeV2ArtistsGrid';
import { HomeV2AiSplit } from './HomeV2AiSplit';
import { HomeV2ClientLogosMarquee } from './HomeV2ClientLogosMarquee';

interface HomeV2PageContentProps {
  copy: HomeV2Copy;
  heroImages: string[];
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
  heroImages,
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
    <ProductionSnapContainer snapMode="heroSnap">
      <HomeV2Hero
        heroLabel={copy.heroLabel}
        heroTitle={copy.heroTitle}
        heroDescription={copy.heroDescription}
        heroImages={heroImages}
        stats={productionCopy}
      />

      <HeroSnapBody className="bg-th-bg text-th-fg">
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
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}
