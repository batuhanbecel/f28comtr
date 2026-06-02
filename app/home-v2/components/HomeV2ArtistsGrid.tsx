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

  return (
    <PageSection border className="py-16 md:py-20">
      <ScrollReveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
        <SectionHeader label={sectionLabel} title={heading} />
        <EditorialButton href="/portfolios" variant="ghost" className="shrink-0 self-start sm:self-auto">
          {viewAllLabel}
        </EditorialButton>
      </ScrollReveal>

      <div className="editorial-grid grid-cols-3 gap-[1px] bg-th-fg/[0.04]">
        {photographers.map((p, i) => (
          <ScrollReveal key={p.id} delay={0.04 + Math.min(i, 10) * 0.04}>
            <Link
              href={`/${p.id}`}
              className="group relative aspect-[4/5] overflow-hidden bg-th-bg block card-editorial"
            >
              <ViewTransition name={`photographer-${p.id}`}>
                <Image
                  src={p.preview}
                  alt={p.fullName}
                  fill
                  className="object-cover thumb-hover-scale"
                  sizes={MASONRY_THUMB_SIZES}
                  loading={i < 6 ? 'eager' : 'lazy'}
                  quality={GRID_IMAGE_QUALITY}
                  placeholder="blur"
                  blurDataURL={BLUR}
                  unoptimized={shouldSkipOptimization(p.preview)}
                />
              </ViewTransition>
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--c-bg)/0.92)] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <p className="text-[7px] md:text-[8px] tracking-[0.4em] uppercase text-th-fg/45 mb-1 truncate">
                  {(t.titleMap as Record<string, string>)[p.title] ?? p.title}
                </p>
                <p className="text-[10px] md:text-xs font-bold tracking-tight text-th-fg/85 leading-tight truncate group-hover:text-th-fg transition-colors duration-hover">
                  {p.fullName}
                </p>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </PageSection>
  );
}
