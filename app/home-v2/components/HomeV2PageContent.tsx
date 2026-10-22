'use client';

import { Footer } from '@/components/Footer';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import type { Photographer } from '@/lib/data';
import type { HomeSelectedWork, HomeV2Copy } from '@/lib/homeV2.shared';
import { HomeV2Hero } from './HomeV2Hero';
import { HomeV2SelectedWorks } from './HomeV2SelectedWorks';
import { HomeV2ArtistsGrid } from './HomeV2ArtistsGrid';
import { HomeV2AiSplit, type HomeAiTeaserWork } from './HomeV2AiSplit';
import { HomeV2ClientLogosMarquee } from './HomeV2ClientLogosMarquee';

interface HomeV2PageContentProps {
  copy: HomeV2Copy;
  heroImages: string[];
  selectedWorks: HomeSelectedWork[];
  photographers: Photographer[];
  aiWorks: HomeAiTeaserWork[];
  clientLogos: string[];
}

/**
 * Home: work first. Hero image → selected work → artists → AI teaser → clients.
 * Studio numbers live on About only; services are described on Production.
 */
export function HomeV2PageContent({
  copy,
  heroImages,
  selectedWorks,
  photographers,
  aiWorks,
  clientLogos,
}: HomeV2PageContentProps) {
  return (
    <ProductionSnapContainer>
      <HomeV2Hero
        heroLabel={copy.heroLabel}
        heroTitle={copy.heroTitle}
        heroDescription={copy.heroDescription}
        heroImages={heroImages}
      />

      <HeroSnapBody className="bg-th-bg text-th-fg">
        <HomeV2SelectedWorks
          works={selectedWorks}
          sectionLabel={copy.selectedWorksLabel}
          heading={copy.selectedWorksHeading}
          viewAllLabel={copy.viewAllArtists}
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
          works={aiWorks}
        />

        <HomeV2ClientLogosMarquee label={copy.clientsMarqueeLabel} logos={clientLogos} />

        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}
