'use client';

import { usePathname } from 'next/navigation';
import { PageLoader } from '@/components/PageLoader';
import { BackToTop } from '@/components/BackToTop';
import { BackgroundPreloader } from '@/components/BackgroundPreloader';

export function SiteChrome() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin') || pathname.startsWith('/studio')) return null;
  return (
    <>
      <PageLoader />
      <BackToTop />
      <BackgroundPreloader />
    </>
  );
}
