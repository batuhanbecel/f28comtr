'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/** In-page `#hash` links: smooth scroll and move keyboard focus to the target. */
export function useSmoothScroll() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href')?.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      if (!el.hasAttribute('tabindex') && !el.matches('a, button, input, select, textarea')) {
        el.setAttribute('tabindex', '-1');
      }
      el.focus({ preventScroll: true });
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
}
