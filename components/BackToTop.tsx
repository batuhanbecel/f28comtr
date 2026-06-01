'use client';

import { useState, useEffect, useCallback } from 'react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

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
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-th-fg/25 hover:border-th-fg/55 hover:bg-th-fg/10 text-th-fg/50 hover:text-th-fg transition-all duration-hover ease-brand ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="square"
          d="M12 19V5M5 12l7-7 7 7"
        />
      </svg>
    </button>
  );
}
