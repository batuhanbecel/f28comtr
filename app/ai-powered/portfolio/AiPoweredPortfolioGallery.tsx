'use client';

import { useDeferredValue } from 'react';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { MasonryGrid } from '@/components/MasonryGrid';
import { Footer } from '@/components/Footer';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { HeroSnapTarget } from '@/components/HeroSnapTarget';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { useLanguage } from '@/context/LanguageContext';
import type { AiPortfolioData } from '@/lib/aiPoweredPortfolio.shared';
import type { Lang } from '@/lib/translations';
import { useAiPortfolioFilter } from './hooks/useAiPortfolioFilter';
import { PortfolioFilterBar } from './components/PortfolioFilterBar';

interface AiPoweredPortfolioGalleryProps {
  portfolio: AiPortfolioData;
  lang: Lang;
}

export function AiPoweredPortfolioGallery({ portfolio, lang }: AiPoweredPortfolioGalleryProps) {
  const { t } = useLanguage();
  const { filters, filtered, counts, setTag } = useAiPortfolioFilter(portfolio.items, portfolio.tags);
  const deferredFiltered = useDeferredValue(filtered);
  const isFiltering = deferredFiltered !== filtered;
  const imageUrls = deferredFiltered.map((item) => item.src);

  return (
    <ProductionSnapContainer snapMode="heroSnap">
      <EditorialPageHero page="aiPoweredPortfolio" lang={lang} />

      <HeroSnapBody className="bg-th-bg text-th-fg min-h-screen">
      <HeroSnapTarget className="hero-snap-target--pad">
      <section className="ai-portfolio-section">
        {portfolio.items.length > 0 ? (
          <>
            <PortfolioFilterBar
              filters={filters}
              tags={portfolio.tags}
              counts={counts}
              onTag={setTag}
              total={filtered.length}
            />
            <div
              className="transition-opacity duration-200"
              style={{ opacity: isFiltering ? 0.65 : 1 }}
            >
              {imageUrls.length > 0 ? (
                <MasonryGrid
                  images={imageUrls}
                  photographerName="AI-Powered Portfolio"
                  fullWidth
                />
              ) : (
                <div className="py-24 text-center px-6">
                  <p className="section-label">{t.aiPoweredPortfolio.filters.empty}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-24 text-center px-6">
            <p className="section-label">{t.aiPoweredPortfolio.empty}</p>
          </div>
        )}
      </section>
      </HeroSnapTarget>

      <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}
