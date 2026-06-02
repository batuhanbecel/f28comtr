'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PREFETCH_ROUTES = ['/production', '/portfolios', '/generative-workflow'];
const DELAY_MS = 5000;

let hasRun = false;

function idleRun(fn: () => void) {
  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void, opts?: object) => void })
      .requestIdleCallback(fn, { timeout: 12000 });
  } else {
    setTimeout(fn, 200);
  }
}

/** Prefetch likely next routes after homepage is idle — no image decode storm. */
export function BackgroundPreloader() {
  const pathname = usePathname();

  useEffect(() => {
    if (hasRun || pathname !== '/') return;
    hasRun = true;

    const timer = setTimeout(() => {
      idleRun(() => {
        PREFETCH_ROUTES.forEach((href) => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = href;
          document.head.appendChild(link);
        });
      });
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
