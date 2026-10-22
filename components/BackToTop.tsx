'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    let ticking = false;

    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const snap = document.querySelector('[data-snap-container]') as HTMLElement | null;
          const scrollTop = snap ? snap.scrollTop : window.scrollY;
          setIsVisible(scrollTop > 500);
          ticking = false;
        });
        ticking = true;
      }
    };

    document.addEventListener('scroll', toggleVisibility, { passive: true, capture: true });
    return () => document.removeEventListener('scroll', toggleVisibility, { capture: true });
  }, []);

  const scrollToTop = useCallback(() => {
    const snap = document.querySelector('[data-snap-container]') as HTMLElement | null;
    if (snap) {
      snap.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      data-back-to-top
      className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-th-fg/25 hover:border-th-fg/55 hover:bg-th-fg/10 bg-th-bg/60 backdrop-blur-sm text-th-fg/72 hover:text-th-fg transition-all duration-hover ease-brand ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
      }`}
      aria-label={t.a11y.backToTop}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="square"
          d="M12 19V5M5 12l7-7 7 7"
        />
      </svg>
    </button>
  );
}
