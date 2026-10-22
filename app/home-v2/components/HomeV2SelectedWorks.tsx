'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { DisplayCase } from '@/components/DisplayCase';
import { ScrollerArrow } from '@/components/ScrollerArrow';
import { useLanguage } from '@/context/LanguageContext';
import { useScrollerArrows } from '@/hooks/useScrollerArrows';
import { shouldSkipOptimization } from '@/lib/blob';
import { GRID_IMAGE_QUALITY } from '@/lib/imageConfig';
import { WORK_STRIP_SIZES } from '@/lib/imageSizes';
import type { HomeSelectedWork } from '@/lib/homeV2.shared';

const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

interface HomeV2SelectedWorksProps {
  works: HomeSelectedWork[];
  sectionLabel: string;
  heading: string;
  viewAllLabel: string;
}

/**
 * Edge-to-edge strip of work, no gutters, scrolls sideways (swipe / trackpad /
 * arrows). Credits reveal on hover or keyboard focus; always shown on touch.
 */
export function HomeV2SelectedWorks({ works, sectionLabel, heading, viewAllLabel }: HomeV2SelectedWorksProps) {
  const { t } = useLanguage();
  const { trackRef, canPrev, canNext, scrollByPage } = useScrollerArrows<HTMLUListElement>(works.length);

  if (works.length === 0) return null;

  const roleLabel = (role: HomeSelectedWork['role']) =>
    role === 'retoucher'
      ? (t.titleMap.RETOUCHER ?? 'Retoucher')
      : (t.titleMap.PHOTOGRAPHER ?? 'Photographer');

  return (
    <section className="work-strip-section" aria-labelledby="selected-works-title">
      <ScrollReveal className="work-strip__head">
        <div className="page-heading-stack">
          <span className="section-label">{sectionLabel}</span>
          <h2 id="selected-works-title" className="heading-section">
            <DisplayCase>{heading}</DisplayCase>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/portfolios" className="work-strip__all hover-line">
            {viewAllLabel}
          </Link>
          <ScrollerArrow direction="prev" onClick={() => scrollByPage(-1)} disabled={!canPrev} label={t.a11y.previousImage} />
          <ScrollerArrow direction="next" onClick={() => scrollByPage(1)} disabled={!canNext} label={t.a11y.nextImage} />
        </div>
      </ScrollReveal>

      <ul ref={trackRef} className="work-strip">
        {works.map((work, i) => {
          const title = work.workTitle || work.artistName;
          const meta = work.workTitle ? `${work.artistName} · ${roleLabel(work.role)}` : roleLabel(work.role);
          return (
            <li key={`${work.imageSrc}-${i}`} className="work-strip__item">
              <Link href={work.href} className="work-strip__link">
                <Image
                  src={work.imageSrc}
                  alt={work.workTitle ? `${work.workTitle} — ${work.artistName}` : work.artistName}
                  fill
                  className="object-cover"
                  sizes={WORK_STRIP_SIZES}
                  loading={i < 3 ? 'eager' : 'lazy'}
                  quality={GRID_IMAGE_QUALITY}
                  placeholder="blur"
                  blurDataURL={BLUR}
                  unoptimized={shouldSkipOptimization(work.imageSrc)}
                />
                <span className="work-strip__credit">
                  <span className="work-strip__title">{title}</span>
                  <span className="work-strip__meta">{meta}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
