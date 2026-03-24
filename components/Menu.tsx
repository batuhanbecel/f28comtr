'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { contactInfo } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const checkScroll = () => {
      const snapContainer = document.querySelector('[data-snap-container]');
      const scrollTop = snapContainer ? (snapContainer as HTMLElement).scrollTop : window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    setIsScrolled(false);
    // Use capture phase on document to catch scroll from snap container or window
    document.addEventListener('scroll', checkScroll, { passive: true, capture: true });
    // Also check immediately in case page already scrolled
    checkScroll();

    return () => {
      document.removeEventListener('scroll', checkScroll, { capture: true });
    };
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => setIsVisible(true), 20);
      return () => clearTimeout(t);
    } else {
      setIsVisible(false);
      const t = setTimeout(() => { document.body.style.overflow = 'unset'; }, 600);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const menuItems = [
    { href: '/', label: t.nav.home, num: '01' },
    { href: '/production', label: t.nav.production, num: '02' },
    { href: '/ai-based', label: t.nav.aiBased, num: '03' },
    { href: '/portfolios', label: t.nav.portfolios, num: '04' },
    { href: '/about', label: t.nav.about, num: '05' },
  ];

  return (
    <>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-5 md:px-10 md:py-7 transition-all duration-500 ${
        isScrolled ? 'backdrop-blur-xl bg-th-bg/50' : ''
      }`}>
        <Link href="/" className="relative z-50 transition-opacity duration-300 hover:opacity-70">
          <Image
            src="/logos/f28/f28_white.png"
            alt="f/2.8"
            width={120}
            height={60}
            className="h-8 md:h-10 w-auto dark:invert-0 invert"
            priority
          />
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="w-px h-3 bg-th-fg/15" />
          <LanguageSwitcher />
          <button
            onClick={toggleMenu}
            className="relative z-50 flex flex-col gap-[5px] w-7 py-1 group"
            aria-label="Toggle menu"
          >
          <span className={`h-px bg-th-fg transition-all duration-500 ease-out origin-center ${
            isOpen ? 'rotate-45 translate-y-[7px] w-full opacity-100' : 'w-full opacity-60 group-hover:opacity-100'
          }`} />
          <span className={`h-px bg-th-fg transition-all duration-500 ${
            isOpen ? 'opacity-0 w-0' : 'w-3/4 opacity-40 group-hover:w-full group-hover:opacity-80'
          }`} />
          <span className={`h-px bg-th-fg transition-all duration-500 ease-out origin-center ${
            isOpen ? '-rotate-45 -translate-y-[7px] w-full opacity-100' : 'w-1/2 opacity-25 group-hover:w-full group-hover:opacity-100'
          }`} />
          </button>
        </div>
      </header>

      {/* Fullscreen Menu */}
      <div
        className={`fixed inset-0 z-40 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          clipPath: isVisible
            ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            : 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          transition: 'clip-path 0.65s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      >
        {/* Background */}
        <div className="absolute inset-0">
          <Image src="/menubg.webp" alt="" fill className="object-cover" quality={85} loading="lazy" />
          <div className="absolute inset-0 bg-black/75" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col text-white px-8 md:px-16 lg:px-24 py-8 overflow-y-auto">

          {/* Top row: location + year */}
          <div
            className="flex items-center justify-between mb-auto pt-24 md:pt-28"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: isVisible ? 'opacity 0.4s ease 0.2s' : 'opacity 0.15s ease',
            }}
          >
            <span className="text-white/20 text-[9px] tracking-[0.55em] uppercase">Istanbul, Turkey</span>
            <span className="text-white/15 text-[9px] tracking-[0.55em] font-mono">f/2.8</span>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col my-auto py-10">
            {menuItems.map((item, index) => (
              <div
                key={item.href}
                className="border-b border-white/[0.07] last:border-b-0"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0px)' : 'translateY(32px)',
                  transition: isVisible
                    ? `opacity 0.55s cubic-bezier(0.76,0,0.24,1) ${index * 0.07 + 0.25}s, transform 0.55s cubic-bezier(0.76,0,0.24,1) ${index * 0.07 + 0.25}s`
                    : `opacity 0.18s ease ${(menuItems.length - 1 - index) * 0.04}s, transform 0.18s ease ${(menuItems.length - 1 - index) * 0.04}s`,
                }}
              >
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="group flex items-baseline gap-4 md:gap-6 py-4 md:py-5"
                >
                  <span className="text-white/20 font-mono text-[10px] tracking-[0.3em] w-6 flex-shrink-0">{item.num}</span>
                  <span
                    className="text-white font-black tracking-tight leading-none transition-all duration-300 group-hover:text-white/50 group-hover:translate-x-2"
                    style={{ fontSize: 'clamp(2rem, 7vw, 5.5rem)' }}
                  >
                    {item.label}
                  </span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Bottom row: social + email */}
          <div
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
              transition: isVisible
                ? 'opacity 0.5s ease 0.7s, transform 0.5s ease 0.7s'
                : 'opacity 0.15s ease',
            }}
          >
            <div className="flex items-center gap-6">
              <Link href={contactInfo.instagram} target="_blank" rel="noopener noreferrer"
                className="text-white/30 text-[10px] tracking-[0.4em] uppercase hover:text-white/70 transition-colors duration-300">
                Instagram
              </Link>
              <span className="w-px h-3 bg-white/10" />
              <Link href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-white/30 text-[10px] tracking-[0.4em] uppercase hover:text-white/70 transition-colors duration-300">
                LinkedIn
              </Link>
            </div>
            <a href={`mailto:${contactInfo.email}`}
              className="text-white/30 text-[11px] tracking-[0.2em] hover:text-white/70 transition-colors duration-300">
              {contactInfo.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
