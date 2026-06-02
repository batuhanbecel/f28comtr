'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Lightbox } from '@/components/Lightbox';
import { shouldSkipOptimization } from '@/lib/blob';
import { GRID_IMAGE_QUALITY } from '@/lib/imageConfig';
import { MARQUEE_THUMB_SIZES } from '@/lib/imageSizes';
import type { ProductionMarqueeItem } from '@/lib/productionMarquee.shared';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';

interface ProductionMarqueeProps {
  items: ProductionMarqueeItem[];
  copy: Pick<ProductionPageCopy, 'heading' | 'marqueeLabel' | 'marqueeRow' | 'marqueeViewImage'>;
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
    <div
      className="production-marquee-row overflow-hidden"
      aria-label={rowLabel}
    >
      <div
        className={`production-marquee-track production-marquee-track--${direction}`}
      >
        {loop.map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            className="production-marquee-cell group"
          >
            <span className="production-marquee-media">
              <Image
                src={item.src}
                alt={`${item.photographerName} — production work`}
                width={320}
                height={220}
                className="production-marquee-img"
                sizes={MARQUEE_THUMB_SIZES}
                quality={GRID_IMAGE_QUALITY}
                loading="lazy"
                draggable={false}
                unoptimized={shouldSkipOptimization(item.src)}
              />
            </span>
            <div className="production-marquee-cell-overlay">
              <Link
                href={`/${item.photographerId}`}
                className="production-marquee-credit"
                onClick={(e) => e.stopPropagation()}
              >
                {item.photographerName}
              </Link>
              <button
                type="button"
                className="production-marquee-open"
                onClick={() => onSelect(item.src)}
                aria-label={`${viewImageLabel} — ${item.photographerName}`}
              >
                <svg className="w-5 h-5 text-th-fg/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                  <path strokeLinecap="square" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </button>
            </div>
          </div>
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
      <section className="production-marquee" aria-label={copy.marqueeLabel}>
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
      </section>

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
