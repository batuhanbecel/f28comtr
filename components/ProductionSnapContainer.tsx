'use client';

import { useEffect } from 'react';

export function ProductionSnapContainer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflowY;
    html.style.overflowY = 'hidden';
    return () => {
      html.style.overflowY = prev;
    };
  }, []);

  return (
    <main
      className="fixed inset-0 overflow-y-scroll [&::-webkit-scrollbar]:hidden"
      style={{
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        overscrollBehaviorY: 'contain',
      }}
    >
      {children}
    </main>
  );
}
