'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    setPhase('enter');

    const visibleTimer = setTimeout(() => setPhase('visible'), 50);
    const exitTimer = setTimeout(() => setPhase('exit'), 700);
    const hideTimer = setTimeout(() => setIsLoading(false), 1200);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
      style={{
        clipPath: phase === 'exit'
          ? 'polygon(0 0, 100% 0, 100% 0, 0 0)'
          : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        transition: phase === 'exit'
          ? 'clip-path 0.55s cubic-bezier(0.76, 0, 0.24, 1)'
          : 'none',
        transformOrigin: 'top',
      }}
    >
      {/* Thin progress line at top */}
      <div className="absolute top-0 left-0 h-[2px] bg-white/20 w-full">
        <div
          className="h-full bg-white"
          style={{
            width: phase === 'visible' || phase === 'exit' ? '100%' : '0%',
            transition: 'width 0.65s ease-out',
          }}
        />
      </div>

      {/* Logo */}
      <div
        style={{
          opacity: phase === 'visible' ? 1 : 0,
          transform: phase === 'visible' ? 'translateY(0px) scale(1)' : 'translateY(12px) scale(0.95)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <Image
          src="/logos/f28/f28_white.png"
          alt="f/2.8"
          width={160}
          height={80}
          className="h-16 w-auto"
          priority
        />
      </div>
    </div>
  );
}
