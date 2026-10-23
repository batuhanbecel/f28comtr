'use client';

import Image from '@/components/Image';
import { memo, useState, useEffect, useCallback, useDeferredValue, useRef } from 'react';
import { BalancedMasonryGrid as MasonryGridLib, Frame } from '@masonry-grid/react';
import { shouldSkipOptimization } from '@/lib/blob';
import { GRID_IMAGE_QUALITY } from '@/lib/imageConfig';
import { MASONRY_THUMB_SIZES } from '@/lib/imageSizes';
import { Lightbox } from '@/components/Lightbox';

interface MasonryGridProps {
  images: string[];
  photographerName: string;
  /** Edge-to-edge masonry; uses viewport width for column sizing. */
  fullWidth?: boolean;
}

// Fallback ratio used only until the image's real dimensions are measured.
const GRID_GAP = 3;
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
    <button
      type="button"
      className="tile relative block w-full h-full p-0 text-left cursor-zoom-in"
      onClick={onOpen}
      aria-label={alt}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-top"
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
    </button>
  );
});

export function MasonryGrid({ images, photographerName, fullWidth = false }: MasonryGridProps) {
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

  const slides = visibleImages.map((src, idx) => ({
    src,
    alt: `${photographerName} — ${idx + 1} / ${visibleImages.length}`,
  }));

  useEffect(() => {
    let ticking = false;
    const update = () => {
      // Measure the grid itself — window.innerWidth includes the scrollbar.
      const w = containerRef.current?.clientWidth || document.documentElement.clientWidth;
      // Shared gallery columns: 3 from tablet up (work stays large), 2 on phones.
      const cols = w >= 768 ? 3 : 2;
      // The grid is `repeat(auto-fill, minmax(frameWidth, 1fr))` with a gap, so the
      // gaps must come out of the width or the last column never fits.
      setFrameWidth(Math.floor((w - GRID_GAP * (cols - 1)) / cols));
      ticking = false;
    };
    update();
    const onResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    // Re-measure when the grid itself resizes — it can report 0 while
    // `content-visibility: auto` keeps it unrendered off-screen.
    const observer = new ResizeObserver(onResize);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [fullWidth]);

  const openLightbox = useCallback((img: string) => {
    const idx = visibleImages.indexOf(img);
    if (idx >= 0) setLightboxIndex(idx);
  }, [visibleImages]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <>
      <div ref={containerRef} className={fullWidth ? 'masonry-scroll w-full' : 'masonry-scroll'}>
        <MasonryGridLib frameWidth={frameWidth} gap={GRID_GAP}>
          {visibleImages.map((image, idx) => {
            const d = dims[image];
            return (
              <Frame key={image} width={d?.w ?? FRAME_W} height={d?.h ?? FRAME_H}>
                <MasonryThumb
                  src={image}
                  alt={slides[idx]?.alt ?? photographerName}
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
