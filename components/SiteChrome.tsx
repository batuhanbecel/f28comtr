'use client';

import { usePathname } from 'next/navigation';
import { Menu } from '@/components/Menu';
import { PageLoader } from '@/components/PageLoader';
import { BackToTop } from '@/components/BackToTop';

export function SiteChrome() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <>
      <PageLoader />
      <Menu />
      <BackToTop />
    </>
  );
}
