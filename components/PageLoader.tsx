'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    setIsExiting(false);
    
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 600);

    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-[#1a1a1a] flex items-center justify-center transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 animate-ping opacity-20">
          <Image
            src="/logos/f28/f28_white.png"
            alt="f/2.8"
            width={150}
            height={75}
            className="h-16 w-auto"
            priority
          />
        </div>
        <div className="relative animate-scale-fade">
          <Image
            src="/logos/f28/f28_white.png"
            alt="f/2.8"
            width={150}
            height={75}
            className="h-16 w-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}
