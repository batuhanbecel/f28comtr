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
      className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 p-3 md:p-4 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <svg
        className="w-4 h-4 md:w-6 md:h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
