'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageSection } from '@/components/PageSection';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeader } from '@/components/PageHeader';
import { EditorialButton } from '@/components/EditorialButton';
import { useLanguage } from '@/context/LanguageContext';
import type { Photographer } from '@/lib/data';
import { shouldSkipOptimization } from '@/lib/blob';
import { GRID_IMAGE_QUALITY } from '@/lib/imageConfig';
import { MASONRY_THUMB_SIZES } from '@/lib/imageSizes';
import { ViewTransition } from '@/lib/ViewTransition';

const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

interface HomeV2ArtistsGridProps {
  photographers: Photographer[];
  sectionLabel: string;
  heading: string;
  viewAllLabel: string;
}

function CarouselArrow({
  direction,
  onClick,
  disabled,
  label,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="home-v2-artists-arrow shrink-0 disabled:opacity-25 disabled:pointer-events-none"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        aria-hidden
      >
        {direction === 'prev' ? (
          <path strokeLinecap="square" d="M15 6l-6 6 6 6" />
        ) : (
          <path strokeLinecap="square" d="M9 6l6 6-6 6" />
        )}
      </svg>
    </button>
  );
}

export function HomeV2ArtistsGrid({
  photographers,
  sectionLabel,
  heading,
  viewAllLabel,
}: HomeV2ArtistsGridProps) {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [photographers.length, updateArrows]);

  const scrollByPage = useCallback((dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.max(el.clientWidth * 0.72, 280);
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  if (photographers.length === 0) return null;

  return (
    <PageSection border className="py-12 md:py-16">
      <ScrollReveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
        <SectionHeader label={sectionLabel} title={heading} />
        <EditorialButton href="/portfolios" variant="ghost" className="shrink-0 self-start sm:self-auto">
          {viewAllLabel}
        </EditorialButton>
      </ScrollReveal>

      <ScrollReveal className="home-v2-artists-carousel flex items-stretch gap-3 md:gap-4">
        <CarouselArrow
          direction="prev"
          onClick={() => scrollByPage(-1)}
          disabled={!canPrev}
          label="Previous artists"
        />

        <div ref={trackRef} className="home-v2-artists-track flex-1 min-w-0">
          {photographers.map((p, i) => (
            <ScrollReveal
              key={p.id}
              delay={0.08 + Math.min(i, 10) * 0.06}
              className="home-v2-artists-card-wrap"
            >
              <Link
                href={`/${p.id}`}
                className="home-v2-artists-card group relative block overflow-hidden bg-th-bg card-editorial"
              >
              <ViewTransition name={`photographer-${p.id}`}>
                <Image
                  src={p.preview}
                  alt={p.fullName}
                  fill
                  className="object-cover thumb-hover-scale"
                  sizes={MASONRY_THUMB_SIZES}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  quality={GRID_IMAGE_QUALITY}
                  placeholder="blur"
                  blurDataURL={BLUR}
                  unoptimized={shouldSkipOptimization(p.preview)}
                />
              </ViewTransition>
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--c-bg)/0.94)] via-[rgb(var(--c-bg)/0.15)] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <p className="stat-label !text-[0.7rem] !max-w-none !text-left mb-1 truncate">
                  {(t.titleMap as Record<string, string>)[p.title] ?? p.title}
                </p>
                <p className="text-sm font-bold tracking-tight text-th-fg leading-tight truncate group-hover:text-th-fg transition-colors duration-hover">
                  {p.fullName}
                </p>
              </div>
            </Link>
            </ScrollReveal>
          ))}
        </div>

        <CarouselArrow
          direction="next"
          onClick={() => scrollByPage(1)}
          disabled={!canNext}
          label="Next artists"
        />
      </ScrollReveal>
    </PageSection>
  );
}
