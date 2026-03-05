'use client';

import { useEffect } from 'react';

const PORTFOLIO_PRELOAD_COUNT = 6;
let hasRun = false;

function idleRun(fn: () => void, delay = 0) {
  setTimeout(() => {
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, opts?: object) => void })
        .requestIdleCallback(fn, { timeout: 10000 });
    } else {
      fn();
    }
  }, delay);
}

function preloadSrc(src: string) {
  const img = new window.Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
}

function preloadBatch(srcs: string[], batchSize = 4, interval = 300) {
  let i = 0;
  const next = () => {
    const batch = srcs.slice(i, i + batchSize);
    batch.forEach(preloadSrc);
    i += batchSize;
    if (i < srcs.length) {
      idleRun(next, interval);
    }
  };
  idleRun(next);
}

export function BackgroundPreloader() {
  useEffect(() => {
    if (hasRun) return;
    hasRun = true;

    // Fetch photographers from API, then preload previews + first N portfolio images
    idleRun(async () => {
      try {
        const res = await fetch('/api/admin/photographers');
        if (!res.ok) return;
        const photographers: { id: string; preview: string }[] = await res.json();

        // Phase 1: preload preview images
        photographers.forEach(p => preloadSrc(p.preview));

        // Phase 2: preload first N portfolio images per photographer
        idleRun(async () => {
          const portfolioImages: string[] = [];
          for (const p of photographers.slice(0, 4)) {
            try {
              const iRes = await fetch(`/api/admin/photographers/${p.id}/images`);
              if (!iRes.ok) continue;
              const images: string[] = await iRes.json();
              portfolioImages.push(...images.slice(0, PORTFOLIO_PRELOAD_COUNT));
            } catch {}
          }
          if (portfolioImages.length > 0) preloadBatch(portfolioImages, 4, 400);
        }, 1500);
      } catch {}
    }, 800);
  }, []);

  return null;
}
