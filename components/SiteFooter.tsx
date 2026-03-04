'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/Footer';

const HIDE_FOOTER = ['/', '/admin'];

export function SiteFooter() {
  const pathname = usePathname();
  if (HIDE_FOOTER.includes(pathname) || pathname.startsWith('/admin')) return null;
  return <Footer />;
}
