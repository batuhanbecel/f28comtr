'use client';

import { useDeferredValue } from 'react';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { MasonryGrid } from '@/components/MasonryGrid';
import { Footer } from '@/components/Footer';
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
    <main className="min-h-screen bg-th-bg text-th-fg">
      <EditorialPageHero page="aiPoweredPortfolio" lang={lang} />

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
                  <p className="section-label opacity-50">{t.aiPoweredPortfolio.filters.empty}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-24 text-center px-6">
            <p className="section-label opacity-50">{t.aiPoweredPortfolio.empty}</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
