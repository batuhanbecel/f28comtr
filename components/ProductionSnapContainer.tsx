'use client';

import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  /**
   * 'mandatory' — every section snaps (production page)
   * 'heroSnap'  — only first scroll snaps hero→grid, grid scrolls freely
   */
  snapMode?: 'mandatory' | 'heroSnap';
}

/** Native CSS scroll-snap — no wheel interception (GPU-friendly, no main-thread jank). */
export function ProductionSnapContainer({ children, snapMode = 'mandatory' }: Props) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflowY;
    html.style.overflowY = 'hidden';
    return () => {
      html.style.overflowY = prev;
    };
  }, []);

  const snapClass =
    snapMode === 'mandatory' ? 'snap-y snap-mandatory' : 'snap-y snap-proximity';

  return (
    <main
      ref={containerRef}
      data-snap-container
      className={`fixed inset-0 overflow-y-scroll overscroll-y-contain [&::-webkit-scrollbar]:hidden ${snapClass}`}
      style={{ scrollbarWidth: 'none' }}
    >
      {children}
    </main>
  );
}
