'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function PageLoader() {
  const [width, setWidth] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const pathname = usePathname();

  useEffect(() => {
    setWidth(0);
    setOpacity(1);

    const t1 = setTimeout(() => setWidth(72), 40);
    const t2 = setTimeout(() => setWidth(100), 380);
    const t3 = setTimeout(() => setOpacity(0), 560);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] h-[1.5px] pointer-events-none"
      style={{ opacity, transition: opacity === 0 ? 'opacity 0.25s ease' : 'none' }}
    >
      <div
        className="h-full bg-white"
        style={{
          width: `${width}%`,
          transition: width === 0
            ? 'none'
            : width === 72
              ? 'width 0.34s cubic-bezier(0.4, 0, 0.2, 1)'
              : 'width 0.18s ease-in',
          transformOrigin: 'left',
        }}
      />
    </div>
  );
}
