'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Lightbox } from '@/components/Lightbox';
import { PageSection } from '@/components/PageSection';
import { ScrollReveal } from '@/components/ScrollReveal';
import { EditorialButton } from '@/components/EditorialButton';
import { shouldSkipOptimization } from '@/lib/blob';
import { GRID_IMAGE_QUALITY } from '@/lib/imageConfig';
import { MARQUEE_THUMB_SIZES } from '@/lib/imageSizes';
import type { ProductionMarqueeItem } from '@/lib/productionMarquee.shared';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';

interface ProductionMarqueeProps {
  items: ProductionMarqueeItem[];
  copy: Pick<
    ProductionPageCopy,
    'heading' | 'marqueeLabel' | 'marqueeRow' | 'marqueeViewImage' | 'team'
  >;
}

function MarqueeRow({
  items,
  direction,
  onSelect,
  rowLabel,
  viewImageLabel,
}: {
  items: ProductionMarqueeItem[];
  direction: 'forward' | 'reverse';
  onSelect: (src: string) => void;
  rowLabel: string;
  viewImageLabel: string;
}) {
  if (items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <div className="production-network-row overflow-hidden" aria-label={rowLabel}>
      <div className={`production-marquee-track production-marquee-track--${direction}`}>
        {loop.map((item, i) => (
          <article key={`${item.src}-${i}`} className="production-network-cell group">
            <span className="production-marquee-media">
              <Image
                src={item.src}
                alt={`${item.photographerName} — production work`}
                width={360}
                height={450}
                className="production-marquee-img"
                sizes={MARQUEE_THUMB_SIZES}
                quality={GRID_IMAGE_QUALITY}
                loading="lazy"
                draggable={false}
                unoptimized={shouldSkipOptimization(item.src)}
              />
            </span>
            <div className="production-network-cell-shade" aria-hidden />
            <div className="production-network-cell-meta">
              <Link
                href={`/${item.photographerId}`}
                className="production-network-credit"
                onClick={(e) => e.stopPropagation()}
              >
                {item.photographerName}
              </Link>
              <button
                type="button"
                className="production-network-open"
                onClick={() => onSelect(item.src)}
                aria-label={`${viewImageLabel} — ${item.photographerName}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                  <path strokeLinecap="square" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ProductionMarquee({ items, copy }: ProductionMarqueeProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openAt = useCallback(
    (src: string) => {
      const idx = items.findIndex((item) => item.src === src);
      if (idx >= 0) setLightboxIndex(idx);
    },
    [items],
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  if (items.length === 0) return null;

  const midpoint = Math.ceil(items.length / 2);
  const rowA = items.slice(0, midpoint);
  const rowB = items.slice(midpoint);

  const slides = items.map((item) => ({
    src: item.src,
    alt: `${item.photographerName} — ${copy.heading}`,
  }));

  return (
    <>
      <PageSection border className="production-network-section py-16 md:py-24">
        <div className="production-network-layout">
          <ScrollReveal className="production-network-copy page-heading-stack">
            <span className="section-label">{copy.team.sectionLabel}</span>
            <h2 className="heading-section">{copy.marqueeLabel}</h2>
            <p className="text-[15px] md:text-base leading-relaxed text-muted-body max-w-md">
              {copy.team.description}
            </p>
            <div className="pt-2">
              <EditorialButton href="/portfolios">{copy.team.cta}</EditorialButton>
            </div>
          </ScrollReveal>

          <div className="production-network-gallery" aria-label={copy.marqueeLabel}>
            <MarqueeRow
              items={rowA}
              direction="forward"
              onSelect={openAt}
              rowLabel={copy.marqueeRow}
              viewImageLabel={copy.marqueeViewImage}
            />
            <MarqueeRow
              items={rowB.length > 0 ? rowB : rowA}
              direction="reverse"
              onSelect={openAt}
              rowLabel={copy.marqueeRow}
              viewImageLabel={copy.marqueeViewImage}
            />
          </div>
        </div>
      </PageSection>

      <Lightbox
        slides={slides}
        index={lightboxIndex}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
        renderMeta={(index) => (
          <Link href={`/${items[index].photographerId}`} className="production-marquee-lightbox-credit">
            {items[index].photographerName}
          </Link>
        )}
      />
    </>
  );
}
