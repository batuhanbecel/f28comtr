'use client';

import Image from 'next/image';
import { useCallback, useState, type MouseEvent, type ReactNode } from 'react';

import { Lightbox } from '@/components/Lightbox';
import { shouldSkipOptimization } from '@/lib/blob';
import { LIGHTBOX_IMAGE_QUALITY } from '@/lib/imageConfig';
import type { AiPoweredWorkImage } from '@/lib/aiPoweredWorks';
import { AI_WORK_DETAIL_SIZES } from '@/lib/imageSizes';

interface AiWorkDetailLayoutProps {
  images: AiPoweredWorkImage[];
  imageAlt: string;
  children: ReactNode;
}

export function AiWorkDetailLayout({ images, imageAlt, children }: AiWorkDetailLayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const safeIndex = Math.min(activeIndex, Math.max(0, images.length - 1));
  const current = images[safeIndex] ?? images[0];
  const hasMultiple = images.length > 1;

  const imageWidth =
    typeof current?.width === 'number' && current.width > 0 ? current.width : null;
  const imageHeight =
    typeof current?.height === 'number' && current.height > 0 ? current.height : null;
  const hasDimensions = imageWidth !== null && imageHeight !== null;
  const unoptimized = current ? shouldSkipOptimization(current.src) : false;

  const goPrev = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setActiveIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
    },
    [images.length],
  );

  const goNext = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setActiveIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
    },
    [images.length],
  );

  const openLightbox = useCallback(() => {
    setLightboxIndex(safeIndex);
  }, [safeIndex]);

  const slides = images.map((img, i) => ({
    src: img.src,
    alt: images.length > 1 ? `${imageAlt} (${i + 1}/${images.length})` : imageAlt,
  }));

  if (!current) return null;

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex w-full justify-start lg:justify-end">
            <div className="relative max-w-full">
              {hasDimensions ? (
                <Image
                  key={current.src}
                  src={current.src}
                  alt={slides[safeIndex]?.alt ?? imageAlt}
                  width={imageWidth}
                  height={imageHeight}
                  sizes={AI_WORK_DETAIL_SIZES}
                  quality={LIGHTBOX_IMAGE_QUALITY}
                  loading={safeIndex === 0 ? 'eager' : 'lazy'}
                  fetchPriority={safeIndex === 0 ? 'high' : undefined}
                  unoptimized={unoptimized}
                  className="block h-auto max-h-[min(85vh,1200px)] w-full max-w-full object-contain"
                />
              ) : (
                <div className="relative aspect-[3/2] w-full min-w-[min(100%,480px)] max-w-full">
                  <Image
                    key={current.src}
                    src={current.src}
                    alt={slides[safeIndex]?.alt ?? imageAlt}
                    fill
                    sizes={AI_WORK_DETAIL_SIZES}
                    quality={LIGHTBOX_IMAGE_QUALITY}
                    loading={safeIndex === 0 ? 'eager' : 'lazy'}
                    fetchPriority={safeIndex === 0 ? 'high' : undefined}
                    unoptimized={unoptimized}
                    className="object-contain"
                  />
                </div>
              )}

              <button
                type="button"
                className="absolute inset-0 cursor-zoom-in border-0 bg-transparent p-0"
                onClick={openLightbox}
                aria-label={slides[safeIndex]?.alt ?? imageAlt}
              />

              {hasMultiple ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 z-[1] -translate-y-1/2 border border-th-fg/20 bg-th-bg/90 px-3 py-2 text-[10px] tracking-[0.25em] uppercase text-th-fg hover:bg-th-fg hover:text-th-bg transition-colors"
                    aria-label="Önceki görsel"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 z-[1] -translate-y-1/2 border border-th-fg/20 bg-th-bg/90 px-3 py-2 text-[10px] tracking-[0.25em] uppercase text-th-fg hover:bg-th-fg hover:text-th-bg transition-colors"
                    aria-label="Sonraki görsel"
                  >
                    →
                  </button>
                  <span
                    className="pointer-events-none absolute bottom-3 right-3 z-[1] bg-th-bg/85 px-2 py-1 text-[10px] tracking-[0.2em] uppercase text-th-fg/70"
                    aria-hidden
                  >
                    {safeIndex + 1} / {images.length}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          {hasMultiple ? (
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Proje görselleri">
              {images.map((img, i) => (
                <button
                  key={`${img.src}-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === safeIndex}
                  onClick={() => setActiveIndex(i)}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden border bg-th-fg/[0.04] transition-colors ${
                    i === safeIndex
                      ? 'border-th-fg ring-1 ring-th-fg'
                      : 'border-th-fg/15 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                    unoptimized={shouldSkipOptimization(img.src)}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="min-w-0 space-y-8">{children}</aside>
      </div>

      <Lightbox
        slides={slides}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={(next) => {
          setLightboxIndex(next);
          setActiveIndex(next);
        }}
      />
    </>
  );
}
