'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Event-driven custom cursor — no RAF loop.
 * Hover ring via body class (cheaper than :has() on every paint).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor-active');

    const onMove = (e: MouseEvent) => {
      const t = `translate3d(${e.clientX}px,${e.clientY}px,0) translate(-50%,-50%)`;
      dot.style.transform = t;
      ring.style.transform = t;
      dot.dataset.visible = 'true';
      ring.dataset.visible = 'true';
    };

    const onLeave = () => {
      delete dot.dataset.visible;
      delete ring.dataset.visible;
    };

    const onOver = (e: MouseEvent) => {
      const interactive = (e.target as Element).closest('a, button, [data-cursor-hover]');
      document.body.classList.toggle('cursor-on-interactive', !!interactive);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseover', onOver, { passive: true });

    const onMqChange = (e: MediaQueryListEvent) => {
      if (!e.matches) {
        onLeave();
        document.body.classList.remove('cursor-on-interactive');
      }
    };
    mq.addEventListener('change', onMqChange);

    return () => {
      document.body.classList.remove('custom-cursor-active', 'cursor-on-interactive');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onOver);
      mq.removeEventListener('change', onMqChange);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot fixed top-0 left-0 pointer-events-none z-[9999]"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 pointer-events-none z-[9998]"
        aria-hidden="true"
      />
    </>
  );
}
