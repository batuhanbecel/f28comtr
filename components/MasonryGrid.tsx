'use client';

import Image from 'next/image';
import { memo, useState, useEffect, useCallback, useDeferredValue, useRef } from 'react';
import { BalancedMasonryGrid as MasonryGridLib, Frame } from '@masonry-grid/react';
import { shouldSkipOptimization } from '@/lib/blob';
import { GRID_IMAGE_QUALITY } from '@/lib/imageConfig';
import { MASONRY_THUMB_SIZES } from '@/lib/imageSizes';
import { Lightbox } from '@/components/Lightbox';

interface MasonryGridProps {
  images: string[];
  photographerName: string;
}

// Fallback ratio used only until the image's real dimensions are measured.
const FRAME_W = 4;
const FRAME_H = 5;
const BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

const MasonryThumb = memo(function MasonryThumb({
  src,
  alt,
  onOpen,
  onMeasure,
}: {
  src: string;
  alt: string;
  onOpen: () => void;
  onMeasure: (src: string, w: number, h: number) => void;
}) {
  return (
    <div
      className="relative w-full h-full cursor-pointer group overflow-hidden bg-th-fg/[0.03] card-editorial"
      onClick={onOpen}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover thumb-hover-scale"
        loading="lazy"
        sizes={MASONRY_THUMB_SIZES}
        quality={GRID_IMAGE_QUALITY}
        placeholder="blur"
        blurDataURL={BLUR}
        unoptimized={shouldSkipOptimization(src)}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            onMeasure(src, img.naturalWidth, img.naturalHeight);
          }
        }}
      />
      {/* Hover overlay — matches AI grid: same theme-aware tint + foreground expand icon */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-ui ease-brand pointer-events-none flex items-center justify-center bg-[rgb(var(--c-bg)/0.72)]">
        <svg className="w-6 h-6 text-th-fg/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
          <path strokeLinecap="square" d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </div>
    </div>
  );
});

export function MasonryGrid({ images, photographerName }: MasonryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [frameWidth, setFrameWidth] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);

  const deferredImages = useDeferredValue(images);

  // Real per-image aspect ratios, measured on load. Until measured, a frame
  // uses the 4:5 fallback so layout stays stable, then snaps to its true ratio.
  const [dims, setDims] = useState<Record<string, { w: number; h: number }>>({});
  const handleMeasure = useCallback((src: string, w: number, h: number) => {
    setDims((prev) => (prev[src] ? prev : { ...prev, [src]: { w, h } }));
  }, []);

  const visibleImages = deferredImages;

  const slides = visibleImages.map((src) => ({
    src,
    alt: `${photographerName} — portfolio photograph`,
  }));

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const w = containerRef.current?.clientWidth || window.innerWidth;
      const cols = w >= 1024 ? 4 : 2;
      setFrameWidth(Math.floor(w / cols));
      ticking = false;
    };
    update();
    const onResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const openLightbox = useCallback((img: string) => {
    const idx = visibleImages.indexOf(img);
    if (idx >= 0) setLightboxIndex(idx);
  }, [visibleImages]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <>
      <div ref={containerRef} className="masonry-scroll">
        <MasonryGridLib frameWidth={frameWidth} gap={3}>
          {visibleImages.map((image, idx) => {
            const d = dims[image];
            return (
              <Frame key={image} width={d?.w ?? FRAME_W} height={d?.h ?? FRAME_H}>
                <MasonryThumb
                  src={image}
                  alt={photographerName}
                  onOpen={() => openLightbox(image)}
                  onMeasure={handleMeasure}
                />
              </Frame>
            );
          })}
        </MasonryGridLib>
      </div>

      <Lightbox
        slides={slides}
        index={lightboxIndex}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
