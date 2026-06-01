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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove('in-view');
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return ref;
}
