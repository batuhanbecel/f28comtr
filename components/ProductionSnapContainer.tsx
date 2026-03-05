'use client';

import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  snapMode?: 'mandatory' | 'proximity';
}

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

  // Wheel-based snap navigation only for mandatory mode (production page)
  useEffect(() => {
    if (snapMode !== 'mandatory') return;
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      const kids = Array.from(container.children) as HTMLElement[];
      const currentScroll = container.scrollTop;
      let targetIndex = 0;
      let closestDist = Infinity;
      kids.forEach((child, i) => {
        const rect = child.getBoundingClientRect();
        const top = rect.top + currentScroll;
        const dist = Math.abs(top - currentScroll);
        if (dist < closestDist) {
          closestDist = dist;
          targetIndex = i;
        }
      });
      targetIndex = Math.max(0, Math.min(kids.length - 1, targetIndex + direction));
      const target = kids[targetIndex];
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [snapMode]);

  return (
    <main
      ref={containerRef}
      data-snap-container
      className="fixed inset-0 overflow-y-scroll [&::-webkit-scrollbar]:hidden"
      style={{
        scrollSnapType: `y ${snapMode}`,
        scrollBehavior: 'smooth',
        scrollbarWidth: 'none',
        overscrollBehaviorY: 'contain',
      }}
    >
      {children}
    </main>
  );
}
