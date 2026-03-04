'use client';

import { usePathname } from 'next/navigation';
import { Menu } from '@/components/Menu';
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
      <Menu />
      <BackToTop />
      <BackgroundPreloader />
    </>
  );
}
