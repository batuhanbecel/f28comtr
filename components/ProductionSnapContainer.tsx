'use client';

import { useEffect, useRef } from 'react';
import {
  isHeroSnapAtContentStart,
  isHeroSnapOnHero,
  scrollHeroSnapToContent,
  scrollHeroSnapToHero,
} from '@/lib/heroSnapScroll';

interface Props {
  children: React.ReactNode;
  snapMode?: 'mandatory' | 'heroSnap';
}

export function ProductionSnapContainer({ children, snapMode = 'mandatory' }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflowY;
    html.style.overflowY = 'hidden';
    return () => {
      html.style.overflowY = prev;
    };
  }, []);

  useEffect(() => {
    if (snapMode !== 'heroSnap') return;
    const el = containerRef.current;
    if (!el) return;

    const lock = () => {
      animatingRef.current = true;
      window.setTimeout(() => {
        animatingRef.current = false;
      }, 900);
    };

    const onWheel = (e: WheelEvent) => {
      if (animatingRef.current) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      if (Math.abs(delta) < 4) return;

      if (delta > 0 && isHeroSnapOnHero(el)) {
        e.preventDefault();
        lock();
        scrollHeroSnapToContent(el);
        return;
      }

      if (delta < 0 && isHeroSnapAtContentStart(el)) {
        e.preventDefault();
        lock();
        scrollHeroSnapToHero(el);
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (animatingRef.current) return;
      const endY = e.changedTouches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - endY;
      if (Math.abs(delta) < 40) return;

      if (delta > 0 && isHeroSnapOnHero(el)) {
        lock();
        scrollHeroSnapToContent(el);
      } else if (delta < 0 && isHeroSnapAtContentStart(el)) {
        lock();
        scrollHeroSnapToHero(el);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [snapMode]);

  const snapClass =
    snapMode === 'heroSnap' ? '' : 'snap-y snap-mandatory';

  return (
    <main
      ref={containerRef}
      data-snap-container
      data-hero-snap={snapMode === 'heroSnap' ? 'true' : undefined}
      className={`hero-snap-container fixed inset-0 overflow-y-scroll overscroll-y-contain scroll-smooth [&::-webkit-scrollbar]:hidden ${snapClass}`.trim()}
      style={{ scrollbarWidth: 'none' }}
    >
      {children}
    </main>
  );
}
