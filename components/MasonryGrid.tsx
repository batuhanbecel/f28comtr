'use client';

import Image from 'next/image';
import React, { useState, useEffect, useCallback, useDeferredValue, useRef } from 'react';
import { BalancedMasonryGrid as MasonryGridLib, Frame } from '@masonry-grid/react';
import { shouldSkipOptimization } from '@/lib/blob';

interface MasonryGridProps {
  images: string[];
  photographerName: string;
}

export function MasonryGrid({ images, photographerName }: MasonryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [frameWidth, setFrameWidth] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);

  const deferredImages = useDeferredValue(images);

  // Track real image dimensions as they load
  const [dims, setDims] = useState<Record<string, { w: number; h: number }>>({});

  const handleImageLoad = useCallback((url: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setDims(prev => {
        if (prev[url]) return prev;
        return { ...prev, [url]: { w: img.naturalWidth, h: img.naturalHeight } };
      });
    }
  }, []);

  // Responsive frameWidth: targets 4 cols desktop, 2 cols mobile
  useEffect(() => {
    const update = () => {
      const w = containerRef.current?.clientWidth || window.innerWidth;
      const cols = w >= 1024 ? 4 : 2;
      setFrameWidth(Math.floor(w / cols));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const [erroredImages, setErroredImages] = useState<Set<string>>(new Set());
  const handleImageError = useCallback((img: string) => {
    setErroredImages(prev => new Set([...prev, img]));
  }, []);

  const validImages = deferredImages.filter(img => !erroredImages.has(img));

  const currentIndex = selectedImage ? images.indexOf(selectedImage) : -1;

  const openLightbox = useCallback((img: string) => {
    setSelectedImage(img);
    document.body.dataset.lightboxOpen = 'true';
    setTimeout(() => setLightboxVisible(true), 10);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxVisible(false);
    delete document.body.dataset.lightboxOpen;
    setTimeout(() => setSelectedImage(null), 350);
  }, []);

  const goToNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(prev => {
      const idx = prev ? images.indexOf(prev) : -1;
      return idx < images.length - 1 ? images[idx + 1] : prev;
    });
  }, [images]);

  const goToPrevious = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(prev => {
      const idx = prev ? images.indexOf(prev) : -1;
      return idx > 0 ? images[idx - 1] : prev;
    });
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setSelectedImage(prev => {
          if (!prev) return prev;
          const idx = images.indexOf(prev);
          return idx < images.length - 1 ? images[idx + 1] : prev;
        });
      }
      if (e.key === 'ArrowLeft') {
        setSelectedImage(prev => {
          if (!prev) return prev;
          const idx = images.indexOf(prev);
          return idx > 0 ? images[idx - 1] : prev;
        });
      }
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images, closeLightbox]);

  return (
    <>
      <div ref={containerRef}>
        <MasonryGridLib frameWidth={frameWidth} gap={3}>
          {validImages.map((image, idx) => {
            const d = dims[image] || { w: 4, h: 3 };
            return (
              <Frame key={image} width={d.w} height={d.h}>
                <div
                  className="relative w-full h-full cursor-pointer group overflow-hidden bg-white/5"
                  onClick={() => openLightbox(image)}
                >
                  <Image
                    src={image}
                    alt={photographerName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading={idx < 8 ? 'eager' : 'lazy'}
                    priority={idx === 0}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    quality={85}
                    unoptimized={shouldSkipOptimization(image)}
                    onLoad={(e) => handleImageLoad(image, e)}
                    onError={() => handleImageError(image)}
                  />
                </div>
              </Frame>
            );
          })}
        </MasonryGridLib>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{
            backgroundColor: `rgba(0,0,0,${lightboxVisible ? 0.97 : 0})`,
            transition: 'background-color 0.35s ease',
          }}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-6 right-8 text-white/50 hover:text-white transition-colors z-10 text-[10px] tracking-[0.3em] uppercase"
            onClick={closeLightbox}
          >
            Close
          </button>

          {/* Counter */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-mono tracking-[0.3em] select-none">
            {String(currentIndex + 1).padStart(2, '0')} &nbsp;/&nbsp; {String(images.length).padStart(2, '0')}
          </div>

          {/* Previous */}
          {currentIndex > 0 && (
            <button
              className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-10 text-white/40 hover:text-white transition-colors duration-200 p-3"
              onClick={goToPrevious}
              aria-label="Previous"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 4L8 14L18 24" strokeLinecap="square" />
              </svg>
            </button>
          )}

          {/* Next */}
          {currentIndex < images.length - 1 && (
            <button
              className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-10 text-white/40 hover:text-white transition-colors duration-200 p-3"
              onClick={goToNext}
              aria-label="Next"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 4L20 14L10 24" strokeLinecap="square" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-7xl max-h-[88vh] w-full h-full px-16 md:px-20"
            onClick={(e) => e.stopPropagation()}
            style={{
              opacity: lightboxVisible ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <Image
              key={selectedImage}
              src={selectedImage}
              alt="Full size"
              fill
              className="object-contain"
              sizes="100vw"
              quality={95}
              unoptimized={shouldSkipOptimization(selectedImage)}
            />
          </div>
        </div>
      )}
    </>
  );
}
