"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  rootMargin?: string;
  /** Start visible (skip observer) — for above-the-fold items */
  initial?: boolean;
}

export function useInView<T extends Element = HTMLDivElement>({
  rootMargin = "300px 0px",
  initial = false,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(initial);

  useEffect(() => {
    if (initial || inView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [initial, inView, rootMargin]);

  return { ref, inView };
}
