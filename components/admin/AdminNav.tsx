'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { F28LogoMark } from '@/components/F28LogoMark';
import { useState } from 'react';
import { useAdminT } from '@/hooks/useAdminT';

const navHrefs = [
  '/admin',
  '/admin/photographers',
  '/admin/ai-powered',
  '/admin/ai-powered/portfolio',
  '/admin/landing',
  '/admin/logos',
  '/admin/previews',
  '/admin/copy',
  '/admin/seo',
  '/admin/settings',
] as const;

export function AdminNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const a = useAdminT();

  const navItems = [
    { href: navHrefs[0], label: a.nav.dashboard },
    { href: navHrefs[1], label: a.nav.photographers },
    { href: navHrefs[2], label: a.nav.aiPowered },
    { href: navHrefs[3], label: a.nav.aiPoweredPortfolio },
    { href: navHrefs[4], label: a.nav.landing },
    { href: navHrefs[5], label: a.nav.logos },
    { href: navHrefs[6], label: a.nav.previews },
    { href: navHrefs[7], label: a.nav.pageCopy },
    { href: navHrefs[8], label: a.nav.seo },
    { href: navHrefs[9], label: a.nav.settings },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 flex flex-col gap-[5px] w-6 py-1"
        aria-label={a.nav.toggleMenu}
      >
        <span className={`h-px bg-th-fg transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[7px] w-full' : 'w-full opacity-60'}`} />
        <span className={`h-px bg-th-fg transition-all duration-300 ${isOpen ? 'opacity-0 w-0' : 'w-3/4 opacity-40'}`} />
        <span className={`h-px bg-th-fg transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px] w-full' : 'w-1/2 opacity-25'}`} />
      </button>

      <nav
        className={`
        fixed top-0 left-0 h-full w-64 bg-th-surface border-r border-th-fg/[0.06] z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        <div className="flex flex-col h-full px-4 py-6">
          <Link href="/" className="flex items-center gap-3 mb-10 px-1">
            <F28LogoMark className="h-6 w-auto text-th-fg opacity-60" aria-hidden />
            <div className="w-px h-3 bg-th-fg/10" />
            <span className="section-label section-label--mini">{a.label}</span>
          </Link>

          <div className="space-y-px">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' &&
                  item.href !== '/admin/ai-powered' &&
                  pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    block px-4 py-3 text-[10px] font-bold tracking-[0.3em] uppercase transition-colors duration-200 border-l-2
                    ${
                      isActive
                        ? 'border-th-fg bg-th-fg/[0.06] text-th-fg'
                        : 'border-transparent text-th-fg/45 hover:bg-th-fg/[0.03] hover:text-th-fg/75'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-6 border-t border-th-fg/[0.06]">
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="w-full text-left px-4 py-3 text-[10px] font-bold tracking-[0.3em] uppercase text-th-fg/40 hover:text-red-500/80 hover:bg-red-400/[0.05] transition-colors duration-200"
              >
                {a.nav.logout}
              </button>
            </form>
          </div>
        </div>
      </nav>

      {isOpen ? (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
}
