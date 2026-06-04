'use client';

import Image from 'next/image';
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { Lightbox } from '@/components/Lightbox';
import { shouldSkipOptimization } from '@/lib/blob';
import type { AiPoweredWorkImage } from '@/lib/aiPoweredWorks';
import { AI_WORK_DETAIL_SIZES } from '@/lib/imageSizes';

const LG_MEDIA = '(min-width: 1024px)';

interface AiWorkDetailLayoutProps {
  images: AiPoweredWorkImage[];
  imageAlt: string;
  children: ReactNode;
}

export function AiWorkDetailLayout({ images, imageAlt, children }: AiWorkDetailLayoutProps) {
  const metaRef = useRef<HTMLDivElement>(null);
  const [frameHeight, setFrameHeight] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const safeIndex = Math.min(activeIndex, Math.max(0, images.length - 1));
  const current = images[safeIndex] ?? images[0];
  const hasMultiple = images.length > 1;

  const imageWidth =
    typeof current?.width === 'number' && current.width > 0 ? current.width : null;
  const imageHeight =
    typeof current?.height === 'number' && current.height > 0 ? current.height : null;
  const aspectRatio =
    imageWidth && imageHeight ? `${imageWidth} / ${imageHeight}` : '3 / 2';
  const unoptimized = current ? shouldSkipOptimization(current.src) : false;

  useLayoutEffect(() => {
    const metaEl = metaRef.current;
    if (!metaEl) return;

    const sync = () => {
      if (!window.matchMedia(LG_MEDIA).matches) {
        setFrameHeight(null);
        return;
      }
      const h = metaEl.offsetHeight;
      setFrameHeight((prev) => (prev === h ? prev : h));
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(metaEl);
    const mq = window.matchMedia(LG_MEDIA);
    mq.addEventListener('change', sync);

    return () => {
      observer.disconnect();
      mq.removeEventListener('change', sync);
    };
  }, []);

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

  const useSyncedFrame = frameHeight !== null && frameHeight > 0;
  const slides = images.map((img, i) => ({
    src: img.src,
    alt: images.length > 1 ? `${imageAlt} (${i + 1}/${images.length})` : imageAlt,
  }));

  if (!current) return null;

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-3">
          <div
            className="relative isolate w-full min-h-[min(50vw,280px)] min-w-0 overflow-hidden bg-th-fg/[0.04] lg:min-h-0"
            style={
              useSyncedFrame
                ? { height: frameHeight, aspectRatio: 'auto' }
                : { aspectRatio }
            }
          >
            <Image
              key={current.src}
              src={current.src}
              alt={slides[safeIndex]?.alt ?? imageAlt}
              fill
              sizes={AI_WORK_DETAIL_SIZES}
              loading={safeIndex === 0 ? 'eager' : 'lazy'}
              fetchPriority={safeIndex === 0 ? 'high' : undefined}
              unoptimized={unoptimized}
              className="object-contain object-center lg:object-right"
            />

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
                  className="absolute left-3 top-1/2 z-[3] -translate-y-1/2 border border-th-fg/20 bg-th-bg/90 px-3 py-2 text-[10px] tracking-[0.25em] uppercase text-th-fg hover:bg-th-fg hover:text-th-bg transition-colors"
                  aria-label="Önceki görsel"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 z-[3] -translate-y-1/2 border border-th-fg/20 bg-th-bg/90 px-3 py-2 text-[10px] tracking-[0.25em] uppercase text-th-fg hover:bg-th-fg hover:text-th-bg transition-colors"
                  aria-label="Sonraki görsel"
                >
                  →
                </button>
                <span
                  className="pointer-events-none absolute bottom-3 right-3 z-[3] bg-th-bg/85 px-2 py-1 text-[10px] tracking-[0.2em] uppercase text-th-fg/70"
                  aria-hidden
                >
                  {safeIndex + 1} / {images.length}
                </span>
              </>
            ) : null}
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

        <aside className="min-w-0">
          <div ref={metaRef} className="space-y-8">
            {children}
          </div>
        </aside>
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
