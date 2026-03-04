'use client';

import { useEffect } from 'react';
import { photographers } from '@/lib/data';
import { imageManifest } from '@/lib/image-manifest';

const PORTFOLIO_PRELOAD_COUNT = 8;
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

    // Phase 1: preload all preview images after 800ms (small files, high value)
    idleRun(() => {
      photographers.forEach(p => preloadSrc(p.preview));
    }, 800);

    // Phase 2: preload first N portfolio images per photographer during idle
    idleRun(() => {
      const portfolioImages: string[] = [];
      for (const photographer of photographers) {
        const images = imageManifest[photographer.id] || [];
        portfolioImages.push(...images.slice(0, PORTFOLIO_PRELOAD_COUNT));
      }
      preloadBatch(portfolioImages, 4, 400);
    }, 3000);
  }, []);

  return null;
}
