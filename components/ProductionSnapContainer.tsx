'use client';

import { useEffect, useRef } from 'react';

export function ProductionSnapContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflowY;
    html.style.overflowY = 'hidden';
    return () => {
      html.style.overflowY = prev;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      const children = Array.from(container.children) as HTMLElement[];
      const currentScroll = container.scrollTop;
      let targetIndex = 0;
      let closestDist = Infinity;
      children.forEach((child, i) => {
        const rect = child.getBoundingClientRect();
        const top = rect.top + currentScroll;
        const dist = Math.abs(top - currentScroll);
        if (dist < closestDist) {
          closestDist = dist;
          targetIndex = i;
        }
      });
      targetIndex = Math.max(0, Math.min(children.length - 1, targetIndex + direction));
      const target = children[targetIndex];
      if (target) {
        // Slower smooth scroll by delaying the scrollIntoView slightly
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <main
      ref={containerRef}
      className="fixed inset-0 overflow-y-scroll [&::-webkit-scrollbar]:hidden"
      style={{
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        scrollbarWidth: 'none',
        overscrollBehaviorY: 'contain',
      }}
    >
      {children}
    </main>
  );
}
