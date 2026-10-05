'use client';

import { useDeferredValue } from 'react';
import Image from 'next/image';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { Footer } from '@/components/Footer';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { HeroSnapTarget } from '@/components/HeroSnapTarget';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useLanguage } from '@/context/LanguageContext';
import type { AiPortfolioData } from '@/lib/aiPoweredPortfolio.shared';
import type { Lang } from '@/lib/translations';
import { useAiPortfolioFilter } from './hooks/useAiPortfolioFilter';
import { PortfolioFilterBar } from './components/PortfolioFilterBar';
import { shouldSkipOptimization } from '@/lib/blob';
import { GRID_IMAGE_QUALITY } from '@/lib/imageConfig';
import { MASONRY_THUMB_SIZES } from '@/lib/imageSizes';

const BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

interface AiPoweredPortfolioGalleryProps {
  portfolio: AiPortfolioData;
  lang: Lang;
}

export function AiPoweredPortfolioGallery({ portfolio, lang }: AiPoweredPortfolioGalleryProps) {
  const { t } = useLanguage();
  const { filters, filtered, counts, setTag } = useAiPortfolioFilter(portfolio.items, portfolio.tags);
  const deferredFiltered = useDeferredValue(filtered);
  const isFiltering = deferredFiltered !== filtered;

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
              {deferredFiltered.length > 0 ? (
                <div className="editorial-grid grid-cols-2 lg:grid-cols-4">
                  {deferredFiltered.map((item, i) => (
                    <ScrollReveal key={item.src} delay={0.15 + Math.min(i, 8) * 0.06}>
                      <div className="group relative aspect-[3/4] overflow-hidden bg-th-fg/[0.03] block portfolio-grid-cell card-editorial">
                        <Image
                          src={item.src}
                          alt={`AI Portfolio work ${i + 1}`}
                          fill
                          className="object-cover object-top thumb-hover-scale"
                          sizes={MASONRY_THUMB_SIZES}
                          loading={i < 4 ? 'eager' : 'lazy'}
                          fetchPriority={i === 0 ? 'high' : undefined}
                          quality={GRID_IMAGE_QUALITY}
                          placeholder="blur"
                          blurDataURL={BLUR}
                          unoptimized={shouldSkipOptimization(item.src)}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--c-bg)/0.9)] via-[rgb(var(--c-bg)/0.2)] to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-hover ease-snappy" />

                        <div className="absolute top-4 left-4">
                          <span className="mono-label group-hover:opacity-80 transition-opacity duration-hover">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-hover ease-brand">
                          <svg className="w-4 h-4 text-th-fg/65" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="square" d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </div>

                        {item.tagIds.length > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-hover ease-brand">
                            <div className="flex flex-wrap gap-2">
                              {item.tagIds.map((tagId) => {
                                const tag = portfolio.tags.find((t) => t.id === tagId);
                                if (!tag) return null;
                                return (
                                  <span key={tagId} className="section-label opacity-70 group-hover:opacity-90 transition-opacity duration-hover">
                                    {lang === 'tr' ? tag.tr : tag.en}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
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
