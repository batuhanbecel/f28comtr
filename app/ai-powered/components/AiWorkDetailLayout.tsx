'use client';

import Image from 'next/image';
import { useCallback, useMemo, useState, type MouseEvent, type ReactNode } from 'react';

import { Lightbox } from '@/components/Lightbox';
import { shouldSkipOptimization } from '@/lib/blob';
import { LIGHTBOX_IMAGE_QUALITY } from '@/lib/imageConfig';
import type { AiPoweredWorkImage } from '@/lib/aiPoweredWorks';
import { AI_WORK_DETAIL_SIZES } from '@/lib/imageSizes';
import { ViewTransition } from '@/lib/ViewTransition';

const STAGE_RATIO_MIN = 0.75;
const STAGE_RATIO_MAX = 16 / 9;

function stageAspectRatio(images: AiPoweredWorkImage[]): string {
  const cover = images[0];
  if (
    typeof cover?.width === 'number' &&
    cover.width > 0 &&
    typeof cover?.height === 'number' &&
    cover.height > 0
  ) {
    const ratio = Math.min(
      STAGE_RATIO_MAX,
      Math.max(STAGE_RATIO_MIN, cover.width / cover.height),
    );
    return `${ratio}`;
  }
  return '1.5';
}

interface AiWorkDetailLayoutProps {
  workSlug: string;
  images: AiPoweredWorkImage[];
  imageAlt: string;
  children: ReactNode;
}

export function AiWorkDetailLayout({
  workSlug,
  images,
  imageAlt,
  children,
}: AiWorkDetailLayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const safeIndex = Math.min(activeIndex, Math.max(0, images.length - 1));
  const hasMultiple = images.length > 1;
  const stageRatio = useMemo(() => stageAspectRatio(images), [images]);
  const vtName = `ai-work-${workSlug}`;

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

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex w-full justify-start lg:justify-end">
            <div
              className="ai-work-detail-stage relative w-full max-w-full"
              style={{ aspectRatio: stageRatio }}
            >
              {images.map((img, i) => {
                const isActive = i === safeIndex;
                const slideAlt = slides[i]?.alt ?? imageAlt;
                const imageNode = (
                  <div className="relative h-full w-full">
                    <Image
                      src={img.src}
                      alt={isActive ? slideAlt : ''}
                      fill
                      sizes={AI_WORK_DETAIL_SIZES}
                      quality={LIGHTBOX_IMAGE_QUALITY}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      fetchPriority={i === 0 ? 'high' : undefined}
                      unoptimized={shouldSkipOptimization(img.src)}
                      className="object-contain object-center lg:object-right"
                    />
                  </div>
                );

                return (
                  <div
                    key={img.src}
                    className={`ai-work-detail-layer absolute inset-0 ${
                      isActive ? 'z-[1] opacity-100' : 'z-0 opacity-0'
                    }`}
                    aria-hidden={!isActive}
                  >
                    {i === 0 ? (
                      <ViewTransition name={vtName}>{imageNode}</ViewTransition>
                    ) : (
                      imageNode
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                className="absolute inset-0 z-[2] cursor-zoom-in border-0 bg-transparent p-0"
                onClick={openLightbox}
                aria-label={slides[safeIndex]?.alt ?? imageAlt}
              />

              {hasMultiple ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 z-[3] -translate-y-1/2 border border-th-fg/20 bg-th-bg/90 px-3 py-2 text-[10px] tracking-[0.25em] uppercase text-th-fg hover:bg-th-fg hover:text-th-bg transition-colors duration-ui"
                    aria-label="Önceki görsel"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 z-[3] -translate-y-1/2 border border-th-fg/20 bg-th-bg/90 px-3 py-2 text-[10px] tracking-[0.25em] uppercase text-th-fg hover:bg-th-fg hover:text-th-bg transition-colors duration-ui"
                    aria-label="Sonraki görsel"
                  >
                    →
                  </button>
                  <span
                    className="pointer-events-none absolute bottom-3 right-3 z-[3] mono-label bg-th-bg/85 px-2 py-1 text-th-fg/70"
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
                  className={`card-editorial relative h-14 w-14 shrink-0 overflow-hidden border bg-th-fg/[0.04] transition-[opacity,outline-color] duration-ui ${
                    i === safeIndex
                      ? 'border-th-fg outline outline-1 outline-th-fg'
                      : 'border-th-fg/15 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover thumb-hover-scale"
                    unoptimized={shouldSkipOptimization(img.src)}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="min-w-0">{children}</aside>
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
