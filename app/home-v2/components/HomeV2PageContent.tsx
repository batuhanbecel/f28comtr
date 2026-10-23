'use client';

import { Footer } from '@/components/Footer';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import type { Photographer } from '@/lib/data';
import type { HomeSelectedWork, HomeV2Copy, HomeV2HeroSlide } from '@/lib/homeV2.shared';
import { HomeV2Hero } from './HomeV2Hero';
import { HomeAiScene, type AiSceneWork } from './HomeAiScene';
import { HomeV2SelectedWorks } from './HomeV2SelectedWorks';
import { HomeArtistRoster } from './HomeArtistRoster';
import { HomeV2ClientLogosMarquee } from './HomeV2ClientLogosMarquee';

interface HomeV2PageContentProps {
  copy: HomeV2Copy;
  heroSlides: HomeV2HeroSlide[];
  aiWorks: AiSceneWork[];
  selectedWorks: HomeSelectedWork[];
  photographers: Photographer[];
  clientLogos: string[];
}

/**
 * Home: numbered hero reel → AI scroll scene → selected work strip → artist
 * roster → clients. Every string comes from the Sanity "Anasayfa" document
 * (with translation fallbacks); the footer closes with the project CTA.
 */
export function HomeV2PageContent({
  copy,
  heroSlides,
  aiWorks,
  selectedWorks,
  photographers,
  clientLogos,
}: HomeV2PageContentProps) {
  return (
    <ProductionSnapContainer>
      <HomeV2Hero
        heroLabel={copy.heroLabel}
        heroTitle={copy.heroTitle}
        heroDescription={copy.heroDescription}
        slides={heroSlides}
        indexLabel={copy.selectedWorksLabel}
      />

      <HeroSnapBody className="bg-th-bg text-th-fg">
        <HomeAiScene
          works={aiWorks}
          label={copy.aiSplitLabel}
          title={copy.aiSplitTitle}
          body={copy.aiSplitBody}
          cta={copy.aiSplitCta}
          leftWord={copy.aiSceneLeft}
          rightWord={copy.aiSceneRight}
        />

        <HomeV2SelectedWorks
          works={selectedWorks}
          sectionLabel={copy.selectedWorksLabel}
          heading={copy.selectedWorksHeading}
          viewAllLabel={copy.viewAllArtists}
        />

        <HomeArtistRoster
          photographers={photographers}
          label={copy.artistsLabel}
          heading={copy.artistsHeading}
          intro={copy.artistsIntro}
          viewAllLabel={copy.viewAllArtists}
        />

        <HomeV2ClientLogosMarquee
          label={copy.clientsMarqueeLabel}
          title={copy.clientsHeading}
          intro={copy.clientsIntro}
          logos={clientLogos}
        />

        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}
