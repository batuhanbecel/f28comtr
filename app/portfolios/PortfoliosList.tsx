'use client';

import type { Photographer } from '@/lib/data';
import type { Lang } from '@/lib/translations';
import { Footer } from '@/components/Footer';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { ArtistGrid } from '@/components/gallery/ArtistGrid';

/** /portfolios — page header, then the edge-to-edge portrait grid. */
export function PortfoliosList({ photographers, lang }: { photographers: Photographer[]; lang: Lang }) {
  return (
    <ProductionSnapContainer>
      <EditorialPageHero page="portfolios" lang={lang} />
      <ArtistGrid photographers={photographers} />
      <Footer />
    </ProductionSnapContainer>
  );
}
