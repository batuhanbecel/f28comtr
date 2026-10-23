'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import Image from '@/components/Image';
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isOpen = index !== null;

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

  // Focus + scroll lock: remember the trigger, focus Close, lock page scroll, restore on close.
  useEffect(() => {
    if (!isOpen) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 30);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      returnFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

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
      if (e.key === 'Tab' && dialogRef.current) {
        // Keep keyboard focus inside the dialog.
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button, a[href]')];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, handleClose, goNext, goPrev]);

  if (index === null || !slide) return null;

  const isLoaded = loadedSrc === slide.src;

  const onTouchStart = (e: React.TouchEvent) => {
    const t0 = e.touches[0];
    touchStartRef.current = { x: t0.clientX, y: t0.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const t1 = e.changedTouches[0];
    const dx = t1.clientX - start.x;
    const dy = t1.clientY - start.y;
    // Horizontal swipe navigates; ignore mostly-vertical gestures.
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  return (
    <div
      className={`lightbox-backdrop ${visible ? 'is-visible' : ''}`}
      ref={dialogRef}
      onClick={handleClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={t.a11y.imageViewer}
    >
      <button ref={closeRef} type="button" className="lightbox-close" onClick={handleClose}>
        {t.common.close}
      </button>

      {renderMeta ? (
        <div className="lightbox-meta">{renderMeta(index)}</div>
      ) : null}

      <div className="lightbox-counter" aria-live="polite" aria-atomic="true">
        {String(index + 1).padStart(2, '0')} &nbsp;/&nbsp; {String(slides.length).padStart(2, '0')}
      </div>

      {index > 0 && (
        <button type="button" className="lightbox-nav lightbox-nav--prev" onClick={goPrev} aria-label={t.a11y.previousImage}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M18 4L8 14L18 24" strokeLinecap="square" />
          </svg>
        </button>
      )}

      {index < slides.length - 1 && (
        <button type="button" className="lightbox-nav lightbox-nav--next" onClick={goNext} aria-label={t.a11y.nextImage}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
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
