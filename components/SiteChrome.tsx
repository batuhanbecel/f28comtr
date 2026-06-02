'use client';

import { usePathname } from 'next/navigation';
import { PageLoader } from '@/components/PageLoader';
import { BackToTop } from '@/components/BackToTop';
import { BackgroundPreloader } from '@/components/BackgroundPreloader';
import { Grain } from '@/components/Grain';

export function SiteChrome() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <>
      <Grain />
      <PageLoader />
      <BackToTop />
      <BackgroundPreloader />
    </>
  );
}
