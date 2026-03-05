'use client';

import Image from 'next/image';
import React, { useState, useEffect, useCallback, useDeferredValue } from 'react';
import { isBlobProxy } from '@/lib/blob';

interface MasonryGridProps {
  images: string[];
  photographerName: string;
}

export function MasonryGrid({ images, photographerName }: MasonryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [numCols, setNumCols] = useState(4);

  // React 19: defer rendering of large image lists for smoother transitions
  const deferredImages = useDeferredValue(images);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setNumCols(w >= 1280 ? 4 : w >= 1024 ? 3 : w >= 768 ? 2 : 1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Distribute images into columns in row-first (round-robin) order
  const columns = React.useMemo(() => {
    const cols: string[][] = Array.from({ length: numCols }, () => []);
    deferredImages.forEach((img, i) => cols[i % numCols].push(img));
    return cols;
  }, [deferredImages, numCols]);

  const currentIndex = selectedImage ? images.indexOf(selectedImage) : -1;

  const openLightbox = useCallback((img: string) => {
    setSelectedImage(img);
    setTimeout(() => setLightboxVisible(true), 10);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxVisible(false);
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
      <div className="flex gap-2 px-2">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col gap-2">
            {col.map((image) => (
              <div
                key={image}
                className="cursor-pointer group relative overflow-hidden"
                onClick={() => openLightbox(image)}
              >
                <Image
                  src={image}
                  alt={`${photographerName}`}
                  width={800}
                  height={1200}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1920px) 33vw, 25vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  unoptimized={isBlobProxy(image)}
                />
              </div>
            ))}
          </div>
        ))}
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
              unoptimized={isBlobProxy(selectedImage)}
            />
          </div>
        </div>
      )}
    </>
  );
}
