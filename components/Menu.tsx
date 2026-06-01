'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { contactInfo } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MENU_BG_SIZES } from '@/lib/imageSizes';

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
    let ticking = false;
    const checkScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const snapContainer = document.querySelector('[data-snap-container]');
        const scrollTop = snapContainer ? (snapContainer as HTMLElement).scrollTop : window.scrollY;
        setIsScrolled(scrollTop > 50);
        ticking = false;
      });
    };

    setIsScrolled(false);
    document.addEventListener('scroll', checkScroll, { passive: true, capture: true });
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
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-5 md:px-10 md:py-7 transition-all duration-hover ease-brand ${
        isScrolled ? 'bg-th-bg/90 border-b border-th-fg/10 backdrop-blur-md' : 'border-b border-transparent'
      }`}>
        <Link href="/" className="relative z-50 transition-opacity duration-hover hover:opacity-70">
          <Image
            src="/logos/f28/f28_white.png"
            alt="f/2.8"
            width={120}
            height={60}
            className="h-8 md:h-10 w-auto dark:invert-0 invert"
            loading="eager"
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
          transition: 'clip-path var(--duration-reveal) var(--ease-brand)',
        }}
      >
        {/* Background */}
        <div className="absolute inset-0">
          <Image src="/menubg.webp" alt="" fill className="object-cover" quality={85} loading="lazy" sizes={MENU_BG_SIZES} />
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
            <span className="section-label text-white/25">Istanbul, Turkey</span>
            <span className="mono-label text-white/20">f/2.8</span>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col my-auto py-10 gap-1">
            {menuItems.map((item, index) => (
              <div
                key={item.href}
                className="border-b border-white/[0.07] last:border-b-0"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0px)' : 'translateY(32px)',
                  transition: isVisible
                    ? `opacity var(--duration-reveal) var(--ease-brand) ${index * 0.07 + 0.25}s, transform var(--duration-reveal) var(--ease-brand) ${index * 0.07 + 0.25}s`
                    : `opacity var(--duration-ui) var(--ease-brand) ${(menuItems.length - 1 - index) * 0.04}s, transform var(--duration-ui) var(--ease-brand) ${(menuItems.length - 1 - index) * 0.04}s`,
                }}
              >
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="group flex items-baseline gap-5 md:gap-8 py-5 md:py-6"
                >
                  <span className="mono-label text-white/25 w-8 flex-shrink-0">{item.num}</span>
                  <span className="heading-section text-white transition-all duration-300 group-hover:text-white/50 group-hover:translate-x-2">
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
                ? 'opacity var(--duration-reveal) var(--ease-brand) 0.7s, transform var(--duration-reveal) var(--ease-brand) 0.7s'
                : 'opacity var(--duration-ui) var(--ease-brand)',
            }}
          >
            <div className="flex items-center gap-6">
              <Link href={contactInfo.instagram} target="_blank" rel="noopener noreferrer"
                className="section-label text-white/30 hover:text-white/70 transition-colors duration-ui hover-line">
                Instagram
              </Link>
              <span className="w-px h-3 bg-white/10" />
              <Link href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer"
                className="section-label text-white/30 hover:text-white/70 transition-colors duration-ui hover-line">
                LinkedIn
              </Link>
            </div>
            <a href={`mailto:${contactInfo.email}`}
              className="section-label text-white/30 hover:text-white/70 transition-colors duration-ui hover-line">
              {contactInfo.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
