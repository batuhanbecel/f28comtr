'use client';

import Image from 'next/image';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface MasonryGridProps {
  images: string[];
  photographerName: string;
}

export function MasonryGrid({ images, photographerName }: MasonryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [numCols, setNumCols] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setNumCols(1);
      else if (w < 1024) setNumCols(2);
      else if (w < 1280) setNumCols(3);
      else setNumCols(4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Transpose images so CSS columns (col-first fill) produces row-first visual order:
  // reordered[c * rowsPerCol + r] = images[r * numCols + c]
  const reorderedImages = useMemo(() => {
    const N = images.length;
    const rowsPerCol = Math.ceil(N / numCols);
    const result: string[] = [];
    for (let c = 0; c < numCols; c++) {
      for (let r = 0; r < rowsPerCol; r++) {
        const idx = r * numCols + c;
        if (idx < N) result.push(images[idx]);
      }
    }
    return result;
  }, [images, numCols]);

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
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-2 space-y-2 px-2">
        {reorderedImages.map((image) => (
          <div
            key={image}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden"
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
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
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
            />
          </div>
        </div>
      )}
    </>
  );
}
