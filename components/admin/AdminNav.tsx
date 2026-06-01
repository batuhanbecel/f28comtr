'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/photographers', label: 'Photographers' },
  { href: '/admin/ai-based', label: 'AI Images' },
  { href: '/admin/landing', label: 'Landing' },
  { href: '/admin/logos', label: 'Logos' },
  { href: '/admin/previews', label: 'Previews' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 flex flex-col gap-[5px] w-6 py-1"
        aria-label="Toggle menu"
      >
        <span className={`h-px bg-th-fg transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[7px] w-full' : 'w-full opacity-60'}`} />
        <span className={`h-px bg-th-fg transition-all duration-300 ${isOpen ? 'opacity-0 w-0' : 'w-3/4 opacity-40'}`} />
        <span className={`h-px bg-th-fg transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px] w-full' : 'w-1/2 opacity-25'}`} />
      </button>

      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 h-full w-64 bg-th-surface border-r border-th-fg/[0.06] z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full px-4 py-6">
          <Link href="/" className="flex items-center gap-3 mb-10 px-1">
            <Image src="/logos/f28/f28_white.png" alt="f/2.8" width={80} height={40} className="h-6 w-auto opacity-60" />
            <div className="w-px h-3 bg-th-fg/10" />
            <span className="section-label section-label--mini">Admin</span>
          </Link>

          <div className="space-y-px">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    block px-4 py-3 text-[10px] font-bold tracking-[0.3em] uppercase transition-colors duration-200 border-l-2
                    ${isActive
                      ? 'border-th-fg bg-th-fg/[0.06] text-th-fg'
                      : 'border-transparent text-th-fg/30 hover:bg-th-fg/[0.03] hover:text-th-fg/60'
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
                className="w-full text-left px-4 py-3 text-[10px] font-bold tracking-[0.3em] uppercase text-th-fg/20 hover:text-red-400/70 hover:bg-red-400/[0.05] transition-colors duration-200"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
