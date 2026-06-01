'use client';

import { usePathname } from 'next/navigation';
import { isPerfHeavyPage } from '@/lib/galleryPaths';

export function Grain() {
  const pathname = usePathname();
  if (isPerfHeavyPage(pathname)) return null;

  return (
    <div
      aria-hidden="true"
      className="grain-layer pointer-events-none fixed inset-0 z-[9990] select-none"
      style={{
        opacity: 0.038,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
