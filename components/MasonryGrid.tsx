'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface MasonryGridProps {
  images: string[];
  photographerName: string;
}

export function MasonryGrid({ images, photographerName }: MasonryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (imageSrc: string) => {
    setLoadedImages(prev => new Set(prev).add(imageSrc));
  };

  const currentIndex = selectedImage ? images.indexOf(selectedImage) : -1;

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1]);
    }
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        setSelectedImage(images[currentIndex + 1]);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setSelectedImage(images[currentIndex - 1]);
      }
      if (e.key === 'Escape') setSelectedImage(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex, images]);

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-2 space-y-2 px-2">
        {images.map((image, index) => (
          <div
            key={image}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden bg-gray-900"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`${photographerName} - ${index + 1}`}
              width={800}
              height={1200}
              className={`w-full h-auto transition-all duration-500 group-hover:scale-105 ${
                loadedImages.has(image) ? 'opacity-100' : 'opacity-0'
              }`}
              loading={index < 6 ? 'eager' : 'lazy'}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1920px) 33vw, 25vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onLoad={() => handleImageLoad(image)}
            />
            {!loadedImages.has(image) && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:opacity-70 transition-opacity z-10"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>

          {/* Previous Button */}
          {currentIndex > 0 && (
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white text-5xl hover:opacity-70 transition-opacity z-10 bg-black/50 w-12 h-12 rounded-full flex items-center justify-center"
              onClick={goToPrevious}
            >
              ‹
            </button>
          )}

          {/* Next Button */}
          {currentIndex < images.length - 1 && (
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white text-5xl hover:opacity-70 transition-opacity z-10 bg-black/50 w-12 h-12 rounded-full flex items-center justify-center"
              onClick={goToNext}
            >
              ›
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>

          <div className="relative max-w-7xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
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
