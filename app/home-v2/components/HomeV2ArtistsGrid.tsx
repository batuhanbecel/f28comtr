'use client';

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
import { ScrollerArrow } from '@/components/ScrollerArrow';
import { useScrollerArrows } from '@/hooks/useScrollerArrows';

const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

interface HomeV2ArtistsGridProps {
  photographers: Photographer[];
  sectionLabel: string;
  heading: string;
  viewAllLabel: string;
}

export function HomeV2ArtistsGrid({
  photographers,
  sectionLabel,
  heading,
  viewAllLabel,
}: HomeV2ArtistsGridProps) {
  const { t } = useLanguage();
  const { trackRef, canPrev, canNext, scrollByPage } = useScrollerArrows<HTMLDivElement>(photographers.length);

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
        <ScrollerArrow
          direction="prev"
          onClick={() => scrollByPage(-1)}
          disabled={!canPrev}
          label={t.a11y.previousArtists}
        />

        <div ref={trackRef} className="home-v2-artists-track flex-1 min-w-0">
          {photographers.map((p, i) => (
            <ScrollReveal
              key={p.id}
              delay={0.08 + Math.min(i, 10) * 0.06}
              className="home-v2-artists-card-wrap"
            >
              <Link href={`/${p.id}`} className="group block">
                <div className="home-v2-artists-card relative overflow-hidden bg-th-fg/[0.04]">
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
                </div>
                {/* Credit under the frame — the portrait is not covered by a gradient */}
                <p className="mt-3 text-[0.9375rem] leading-snug text-th-fg truncate group-hover:underline underline-offset-4 decoration-1">
                  {p.fullName}
                </p>
                <p className="mt-0.5 text-sm text-th-fg/62 truncate">
                  {(t.titleMap as Record<string, string>)[p.title] ?? p.title}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollerArrow
          direction="next"
          onClick={() => scrollByPage(1)}
          disabled={!canNext}
          label={t.a11y.nextArtists}
        />
      </ScrollReveal>
    </PageSection>
  );
}
