'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { shouldSkipOptimization } from '@/lib/blob';
import { LIGHTBOX_IMAGE_QUALITY } from '@/lib/imageConfig';
import { LIGHTBOX_IMAGE_SIZES } from '@/lib/imageSizes';
import { usePrefetchImages } from '@/lib/usePrefetchImages';
import { useLanguage } from '@/context/LanguageContext';

export interface LightboxSlide {
  src: string;
  alt: string;
}

interface LightboxProps {
  slides: LightboxSlide[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
  renderMeta?: (index: number) => React.ReactNode;
}

export function Lightbox({
  slides,
  index,
  onClose,
  onIndexChange,
  renderMeta,
}: LightboxProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const slide = index !== null ? slides[index] : null;
  const currentSrc = slide?.src ?? null;

  usePrefetchImages(
    slides.map((s) => s.src),
    index,
    2,
  );

  useEffect(() => {
    if (index === null) {
      setVisible(false);
      return;
    }
    document.body.dataset.lightboxOpen = 'true';
    const tId = setTimeout(() => setVisible(true), 10);
    return () => {
      clearTimeout(tId);
      delete document.body.dataset.lightboxOpen;
    };
  }, [index]);

  useEffect(() => {
    if (!currentSrc) {
      setLoadedSrc(null);
      return;
    }
    setLoadedSrc((prev) => (prev === currentSrc ? prev : null));
  }, [currentSrc]);

  const goPrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (index === null || index <= 0) return;
      onIndexChange(index - 1);
    },
    [index, onIndexChange],
  );

  const goNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (index === null || index >= slides.length - 1) return;
      onIndexChange(index + 1);
    },
    [index, slides.length, onIndexChange],
  );

  const handleClose = useCallback(() => {
    setVisible(false);
    delete document.body.dataset.lightboxOpen;
    setTimeout(onClose, 350);
  }, [onClose]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, handleClose, goNext, goPrev]);

  if (index === null || !slide) return null;

  const isLoaded = loadedSrc === slide.src;

  return (
    <div
      className={`lightbox-backdrop ${visible ? 'is-visible' : ''}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <button type="button" className="lightbox-close" onClick={handleClose}>
        {t.common.close}
      </button>

      {renderMeta ? (
        <div className="lightbox-meta">{renderMeta(index)}</div>
      ) : null}

      <div className="lightbox-counter">
        {String(index + 1).padStart(2, '0')} &nbsp;/&nbsp; {String(slides.length).padStart(2, '0')}
      </div>

      {index > 0 && (
        <button type="button" className="lightbox-nav lightbox-nav--prev" onClick={goPrev} aria-label="Previous">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 4L8 14L18 24" strokeLinecap="square" />
          </svg>
        </button>
      )}

      {index < slides.length - 1 && (
        <button type="button" className="lightbox-nav lightbox-nav--next" onClick={goNext} aria-label="Next">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 4L20 14L10 24" strokeLinecap="square" />
          </svg>
        </button>
      )}

      <div
        className="lightbox-content relative max-w-7xl max-h-[88vh] w-full h-full px-16 md:px-20 py-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`ai-lightbox-spinner ${isLoaded ? 'is-hidden' : ''}`} aria-hidden="true" />
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          className={`object-contain ai-lightbox-image ${isLoaded ? 'is-loaded' : ''}`}
          sizes={LIGHTBOX_IMAGE_SIZES}
          loading="eager"
          quality={LIGHTBOX_IMAGE_QUALITY}
          unoptimized={shouldSkipOptimization(slide.src)}
          onLoad={() => setLoadedSrc(slide.src)}
        />
      </div>
    </div>
  );
}
