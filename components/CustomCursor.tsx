'use client';

import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let raf: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      rx = lerp(rx, mx, 0.13);
      ry = lerp(ry, my, 0.13);
      dot.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a,button,[data-cursor-hover]')) {
        ring.dataset.hover = '1';
        dot.dataset.hover = '1';
      }
    };
    const onOut = (e: MouseEvent) => {
      if (!(e.relatedTarget as HTMLElement | null)?.closest('a,button,[data-cursor-hover]')) {
        delete ring.dataset.hover;
        delete dot.dataset.hover;
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
