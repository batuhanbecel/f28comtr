'use client';

import { usePathname } from 'next/navigation';
import { Menu, type NavPhotographer } from '@/components/Menu';
import type { Lang } from '@/lib/translations';

interface SiteHeaderProps {
  photographers: NavPhotographer[];
  lang: Lang;
}

/** Client wrapper; `lang` from server cookie keeps nav labels in sync on SSR + hydrate. */
export function SiteHeader({ photographers, lang }: SiteHeaderProps) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return <Menu photographers={photographers} lang={lang} />;
}
