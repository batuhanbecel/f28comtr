'use client';

import { useEffect } from 'react';

export function useSmoothScroll() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      const id = link.getAttribute('href')?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Only apply to main content scroll, not custom snap containers
      const target = e.target as Element;
      const closestSnap = target.closest('[data-snap-container]');
      if (closestSnap) return;
      // Default smooth scroll is already set on html, no need to override
    };

    document.addEventListener('click', handleAnchorClick);
    document.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);
}
