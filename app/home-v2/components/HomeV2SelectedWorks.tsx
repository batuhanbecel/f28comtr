'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PageSection } from '@/components/PageSection';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeader } from '@/components/PageHeader';
import { useLanguage } from '@/context/LanguageContext';
import { shouldSkipOptimization } from '@/lib/blob';
import { GRID_IMAGE_QUALITY } from '@/lib/imageConfig';
import { MASONRY_THUMB_SIZES } from '@/lib/imageSizes';
import type { HomeSelectedWork } from '@/lib/homeV2.shared';

const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

interface HomeV2SelectedWorksProps {
  works: HomeSelectedWork[];
  sectionLabel: string;
  heading: string;
}

export function HomeV2SelectedWorks({ works, sectionLabel, heading }: HomeV2SelectedWorksProps) {
  const { t } = useLanguage();

  if (works.length === 0) return null;

  const roleLabel = (role: HomeSelectedWork['role']) =>
    role === 'retoucher'
      ? (t.titleMap.RETOUCHER ?? 'Retoucher')
      : (t.titleMap.PHOTOGRAPHER ?? 'Photographer');

  return (
    <PageSection className="py-16 md:py-20">
      <ScrollReveal>
        <SectionHeader label={sectionLabel} title={heading} className="mb-10 md:mb-14" />
      </ScrollReveal>

      <div className="editorial-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-th-fg/[0.06] border border-th-fg/[0.06]">
        {works.map((work, i) => (
          <ScrollReveal key={`${work.imageSrc}-${i}`} delay={0.06 + i * 0.05}>
            <Link
              href={work.href}
              className="group block bg-th-bg editorial-panel overflow-hidden card-editorial"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-th-fg/[0.03]">
                <Image
                  src={work.imageSrc}
                  alt={`${work.workTitle} — ${work.artistName}`}
                  fill
                  className="object-cover thumb-hover-scale"
                  sizes={MASONRY_THUMB_SIZES}
                  loading={i < 3 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : undefined}
                  quality={GRID_IMAGE_QUALITY}
                  placeholder="blur"
                  blurDataURL={BLUR}
                  unoptimized={shouldSkipOptimization(work.imageSrc)}
                />
              </div>
              <div className="p-5 md:p-6 border-t border-th-fg/[0.06]">
                <p className="text-sm md:text-base font-medium tracking-tight text-th-fg/90 group-hover:text-th-fg transition-colors duration-hover">
                  {work.workTitle}
                </p>
                <p className="mt-1 text-[11px] tracking-[0.2em] uppercase text-th-fg/60">
                  {work.artistName}
                </p>
                <p className="mt-2 text-[9px] tracking-[0.38em] uppercase font-mono text-th-fg/45">
                  {roleLabel(work.role)}
                </p>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </PageSection>
  );
}
