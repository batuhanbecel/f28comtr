'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';

export function PageLoader() {
  const [visible, setVisible] = useState(false);
  const [isPending] = useTransition();
  const pathname = usePathname();

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 500);
    return () => clearTimeout(t);
  }, [pathname]);

  const show = visible || isPending;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] h-[1.5px] pointer-events-none"
      style={{
        opacity: show ? 1 : 0,
        transition: 'opacity var(--duration-ui) ease',
      }}
    >
      <div
        className="h-full bg-th-fg origin-left"
        style={{
          animation: show ? 'page-load var(--duration-reveal) var(--ease-snappy) forwards' : 'none',
          width: '0%',
        }}
      />
    </div>
  );
}
