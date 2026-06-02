'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Photographer } from '@/lib/data';
import type { Lang } from '@/lib/translations';
import { Footer } from '@/components/Footer';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { HeroSnapTarget } from '@/components/HeroSnapTarget';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { PageSection } from '@/components/PageSection';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useLanguage } from '@/context/LanguageContext';
import { shouldSkipOptimization } from '@/lib/blob';
import { GRID_IMAGE_QUALITY } from '@/lib/imageConfig';
import { MASONRY_THUMB_SIZES } from '@/lib/imageSizes';
import { ViewTransition } from '@/lib/ViewTransition';

const BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

export function PortfoliosList({ photographers, lang }: { photographers: Photographer[]; lang: Lang }) {
  const { t } = useLanguage();

  return (
    <ProductionSnapContainer snapMode="heroSnap">
      <EditorialPageHero page="portfolios" lang={lang} />

      <HeroSnapBody className="bg-th-bg text-th-fg">
      <HeroSnapTarget className="hero-snap-target--pad">
      <section className="pb-8">
        <div className="editorial-grid grid-cols-2 lg:grid-cols-4">
          {photographers.map((p, i) => (
            <ScrollReveal key={p.id} delay={0.15 + Math.min(i, 8) * 0.06}>
              <Link
                href={`/${p.id}`}
                className="group relative aspect-[3/4] overflow-hidden bg-th-fg/[0.03] block portfolio-grid-cell card-editorial"
              >
                <ViewTransition name={`photographer-${p.id}`}>
                  <Image
                    src={p.preview}
                    alt={p.fullName}
                    fill
                    className="object-cover object-top thumb-hover-scale"
                    sizes={MASONRY_THUMB_SIZES}
                    loading={i < 4 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                    quality={GRID_IMAGE_QUALITY}
                    placeholder="blur"
                    blurDataURL={BLUR}
                    unoptimized={shouldSkipOptimization(p.preview)}
                  />
                </ViewTransition>

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

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-hover ease-brand">
                  <p className="caption-text mb-1.5 group-hover:opacity-90 transition-opacity duration-hover">
                    {(t.titleMap as Record<string, string>)[p.title] ?? p.title}
                  </p>
                  <h2 className="text-lg md:text-xl font-black tracking-tight leading-tight text-th-fg/85 group-hover:text-th-fg transition-colors duration-hover">
                    {p.fullName}
                  </h2>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
      </HeroSnapTarget>

      <PageSection border>
        <ScrollReveal className="flex items-center justify-between mb-10">
          <span className="section-label">Index</span>
          <div className="flex-1 mx-6 h-px bg-th-fg/[0.06]" />
          <span className="mono-label">{String(photographers.length).padStart(2, '0')}</span>
        </ScrollReveal>
        <ul className="space-y-0">
          {photographers.map((p, i) => (
            <li key={p.id}>
              <Link
                href={`/${p.id}`}
                className="group flex items-center gap-6 py-4 border-b border-th-fg/[0.04] transition-colors duration-hover hover:bg-th-fg/[0.02] -mx-4 px-4 hover-line"
              >
                <span className="mono-label flex-shrink-0 group-hover:opacity-70 transition-opacity duration-hover">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-sm font-bold tracking-tight text-th-fg/50 group-hover:text-th-fg group-hover:translate-x-1 transition-all duration-hover ease-brand">
                  {p.fullName}
                </span>
                <span className="section-label opacity-70 group-hover:opacity-90 transition-opacity duration-hover">
                  {(t.titleMap as Record<string, string>)[p.title] ?? p.title}
                </span>
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-hover ease-brand"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                >
                  <path strokeLinecap="square" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </PageSection>

      <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}
