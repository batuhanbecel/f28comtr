'use client';

import Image from 'next/image';
import { memo, useState, useEffect, useCallback, useDeferredValue, useRef } from 'react';
import { BalancedMasonryGrid as MasonryGridLib, Frame } from '@masonry-grid/react';
import { shouldSkipOptimization } from '@/lib/blob';
import { GRID_IMAGE_QUALITY } from '@/lib/imageConfig';
import { MASONRY_THUMB_SIZES } from '@/lib/imageSizes';
import { useInView } from '@/lib/useInView';
import { Lightbox } from '@/components/Lightbox';

interface MasonryGridProps {
  images: string[];
  photographerName: string;
}

const FRAME_W = 4;
const FRAME_H = 5;

const MasonryThumb = memo(function MasonryThumb({
  src,
  alt,
  priority,
  onOpen,
}: {
  src: string;
  alt: string;
  priority: boolean;
  onOpen: () => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: '500px 0px',
    initial: priority,
  });

  return (
    <div
      ref={ref}
      className="relative w-full h-full cursor-pointer group overflow-hidden bg-th-fg/[0.03]"
      onClick={onOpen}
    >
      {inView ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover thumb-hover-scale"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          sizes={MASONRY_THUMB_SIZES}
          quality={GRID_IMAGE_QUALITY}
          unoptimized={shouldSkipOptimization(src)}
        />
      ) : null}
    </div>
  );
});

export function MasonryGrid({ images, photographerName }: MasonryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [frameWidth, setFrameWidth] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);

  const deferredImages = useDeferredValue(images);

  const [erroredImages, setErroredImages] = useState<Set<string>>(new Set());
  const handleImageError = useCallback((src: string) => {
    setErroredImages((prev) => new Set([...prev, src]));
  }, []);

  const validImages = deferredImages.filter((img) => !erroredImages.has(img));

  const slides = validImages.map((src) => ({
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
    const idx = validImages.indexOf(img);
    if (idx >= 0) setLightboxIndex(idx);
  }, [validImages]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <>
      <div ref={containerRef} className="masonry-scroll">
        <MasonryGridLib frameWidth={frameWidth} gap={3}>
          {validImages.map((image, idx) => (
            <Frame key={image} width={FRAME_W} height={FRAME_H}>
              <MasonryThumb
                src={image}
                alt={photographerName}
                priority={idx < 4}
                onOpen={() => openLightbox(image)}
              />
            </Frame>
          ))}
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
