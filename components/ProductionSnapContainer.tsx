'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Props {
  children: React.ReactNode;
  /**
   * 'mandatory' — every section snaps (production page)
   * 'heroSnap'  — only first scroll snaps hero→grid, grid scrolls freely
   */
  snapMode?: 'mandatory' | 'heroSnap';
}

export function ProductionSnapContainer({ children, snapMode = 'mandatory' }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflowY;
    html.style.overflowY = 'hidden';
    return () => {
      html.style.overflowY = prev;
    };
  }, []);

  const scrollTo = useCallback((top: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top, behavior: 'smooth' });
    setTimeout(() => { isAnimating.current = false; }, 900);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    const container = containerRef.current;
    if (!container) return;

    if (snapMode === 'mandatory') {
      e.preventDefault();
      if (isAnimating.current) return;
      isAnimating.current = true;

      const direction = e.deltaY > 0 ? 1 : -1;
      const kids = Array.from(container.children) as HTMLElement[];
      const currentScroll = container.scrollTop;
      let targetIndex = 0;
      let closestDist = Infinity;
      kids.forEach((child, i) => {
        const dist = Math.abs(child.offsetTop - currentScroll);
        if (dist < closestDist) { closestDist = dist; targetIndex = i; }
      });
      targetIndex = Math.max(0, Math.min(kids.length - 1, targetIndex + direction));
      const target = kids[targetIndex];
      if (target) {
        scrollTo(target.offsetTop);
      } else {
        isAnimating.current = false;
      }
    } else {
      // heroSnap: only intercept wheel while on the hero section
      const firstChild = container.children[0] as HTMLElement | undefined;
      if (!firstChild) return;
      const heroBottom = firstChild.offsetHeight;
      const isOnHero = container.scrollTop < heroBottom - 50;

      if (isOnHero) {
        e.preventDefault();
        if (isAnimating.current) return;
        isAnimating.current = true;
        if (e.deltaY > 0) {
          const secondChild = container.children[1] as HTMLElement | undefined;
          scrollTo(secondChild ? secondChild.offsetTop : heroBottom);
        } else {
          scrollTo(0);
        }
      }
    }
  }, [snapMode, scrollTo]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <main
      ref={containerRef}
      data-snap-container
      className="fixed inset-0 overflow-y-scroll [&::-webkit-scrollbar]:hidden"
      style={{
        scrollBehavior: 'smooth',
        scrollbarWidth: 'none',
        overscrollBehaviorY: 'contain',
      }}
    >
      {children}
    </main>
  );
}
