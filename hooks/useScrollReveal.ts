'use client';

import { useEffect, useRef, type RefObject } from 'react';

interface Options {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: Options = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { rootMargin = '0px 0px -8% 0px', threshold = 0.12, once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add('scroll-reveal');

    const delay = el.dataset.revealDelay;
    if (delay) {
      el.style.transitionDelay = `${delay}s`;
    }

    const reveal = () => {
      el.classList.add('in-view');
      if (once) observer.unobserve(el);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
        } else if (!once) {
          el.classList.remove('in-view');
        }
      },
      { rootMargin, threshold },
    );

    const syncIfAlreadyVisible = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < viewH && rect.bottom > 0) {
        reveal();
      }
    };

    observer.observe(el);
    syncIfAlreadyVisible();
    const raf = requestAnimationFrame(syncIfAlreadyVisible);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [rootMargin, threshold, once]);

  return ref;
}
