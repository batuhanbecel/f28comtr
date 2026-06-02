'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { F28LogoMark } from '@/components/F28LogoMark';
import { useLanguage } from '@/context/LanguageContext';
import { translations, type Lang } from '@/lib/translations';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MENU_BG_SIZES } from '@/lib/imageSizes';

export type NavPhotographer = {
  id: string;
  fullName: string;
  title: string;
};

type NavChild = { href: string; label: string; meta?: string };

type NavItem =
  | { kind: 'link'; href: string; label: string; num: string }
  | { kind: 'dropdown'; href: string; label: string; num: string; children: NavChild[]; sectionLabel?: string };

interface MenuProps {
  photographers: NavPhotographer[];
  /** Server-resolved language — avoids hydration mismatch vs context default. */
  lang: Lang;
}

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Menu({ photographers, lang }: MenuProps) {
  const { contactInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const t = translations[lang];

  useEffect(() => {
    setIsOpen(false);
    setMobileExpanded(null);
    setOpenDropdown(null);
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
      const timer = setTimeout(() => setIsVisible(true), 20);
      return () => clearTimeout(timer);
    }
    setIsVisible(false);
    const timer = setTimeout(() => { document.body.style.overflow = 'unset'; }, 600);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  const forceBackdrop = pathname === '/' || /^\/[^/]+$/.test(pathname);

  const artistLinks: NavChild[] = photographers.map((p) => ({
    href: `/${p.id}`,
    label: p.fullName,
    meta: (t.titleMap as Record<string, string>)[p.title] ?? p.title,
  }));

  const menuItems: NavItem[] = [
    { kind: 'link', href: '/', label: t.nav.home, num: '01' },
    { kind: 'link', href: '/production', label: t.nav.production, num: '02' },
    {
      kind: 'dropdown',
      href: '/ai-powered',
      label: t.nav.aiPowered,
      num: '03',
      children: [
        { href: '/ai-powered', label: t.nav.aiPoweredGallery },
        { href: '/ai-powered/portfolio', label: t.nav.aiPoweredPortfolio },
      ],
    },
    {
      kind: 'dropdown',
      href: '/portfolios',
      label: t.nav.portfolios,
      num: '04',
      sectionLabel: t.nav.ourArtists,
      children: [
        { href: '/portfolios', label: t.nav.allPortfolios },
        ...artistLinks,
      ],
    },
    { kind: 'link', href: '/about', label: t.nav.about, num: '05' },
    { kind: 'link', href: '/contact', label: t.nav.contact, num: '06' },
  ];

  const openDesktopDropdown = (key: string) => {
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
    setOpenDropdown(key);
  };

  const scheduleCloseDropdown = () => {
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
    dropdownCloseTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const renderDesktopNavItem = (item: NavItem) => {
    if (item.kind === 'link') {
      const isActive = isActivePath(pathname, item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          className={`group relative text-[10px] xl:text-[11px] tracking-[0.22em] xl:tracking-[0.25em] uppercase font-medium transition-colors duration-hover ${
            isActive ? 'text-th-fg' : 'text-th-fg/45 hover:text-th-fg/80'
          }`}
        >
          {item.label}
          <span className={`absolute -bottom-1.5 left-0 h-px bg-th-fg transition-all duration-hover ease-brand ${
            isActive ? 'w-full opacity-60' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-40'
          }`} />
        </Link>
      );
    }

    const dropdownKey = item.href;
    const isActive = isActivePath(pathname, item.href) ||
      item.children.some((child) => isActivePath(pathname, child.href));
    const isOpenDropdown = openDropdown === dropdownKey;

    return (
      <div
        key={dropdownKey}
        className="relative"
        onMouseEnter={() => openDesktopDropdown(dropdownKey)}
        onMouseLeave={scheduleCloseDropdown}
      >
        <Link
          href={item.href}
          className={`group relative inline-flex items-center gap-1.5 text-[10px] xl:text-[11px] tracking-[0.22em] xl:tracking-[0.25em] uppercase font-medium transition-colors duration-hover ${
            isActive ? 'text-th-fg' : 'text-th-fg/45 hover:text-th-fg/80'
          }`}
          aria-haspopup="true"
          aria-expanded={isOpenDropdown}
        >
          {item.label}
          <svg
            className={`w-2.5 h-2.5 opacity-50 transition-transform duration-ui ${isOpenDropdown ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
          >
            <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span className={`absolute -bottom-1.5 left-0 h-px bg-th-fg transition-all duration-hover ease-brand ${
            isActive ? 'w-full opacity-60' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-40'
          }`} />
        </Link>

        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-ui ease-brand ${
            isOpenDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1 pointer-events-none'
          }`}
          onMouseEnter={() => openDesktopDropdown(dropdownKey)}
          onMouseLeave={scheduleCloseDropdown}
        >
          <div className="min-w-[15rem] max-w-[18rem] border border-th-fg/10 bg-th-bg/95 backdrop-blur-xl shadow-lg py-2">
            {item.sectionLabel ? (
              <p className="px-4 pt-2 pb-1 text-[8px] tracking-[0.45em] uppercase text-th-fg/35">{item.sectionLabel}</p>
            ) : null}
            {item.children.map((child, index) => {
              const childActive = isActivePath(pathname, child.href);
              const showDivider = item.sectionLabel && index === 1;
              return (
                <div key={child.href}>
                  {showDivider ? <div className="my-2 mx-3 h-px bg-th-fg/[0.06]" /> : null}
                  <Link
                    href={child.href}
                    className={`block px-4 py-2.5 transition-colors duration-ui hover:bg-th-fg/[0.04] ${
                      childActive ? 'text-th-fg' : 'text-th-fg/55 hover:text-th-fg/85'
                    }`}
                  >
                    <span className="block text-[10px] tracking-[0.18em] uppercase font-medium leading-snug">{child.label}</span>
                    {child.meta ? (
                      <span className="block mt-0.5 text-[8px] tracking-[0.35em] uppercase text-th-fg/30">{child.meta}</span>
                    ) : null}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderMobileNavItem = (item: NavItem, index: number) => {
    const style = {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0px)' : 'translateY(32px)',
      transition: isVisible
        ? `opacity var(--duration-reveal) var(--ease-brand) ${index * 0.07 + 0.25}s, transform var(--duration-reveal) var(--ease-brand) ${index * 0.07 + 0.25}s`
        : `opacity var(--duration-ui) var(--ease-brand) ${(menuItems.length - 1 - index) * 0.04}s, transform var(--duration-ui) var(--ease-brand) ${(menuItems.length - 1 - index) * 0.04}s`,
    };

    if (item.kind === 'link') {
      return (
        <div key={item.href} className="border-b border-white/[0.07]" style={style}>
          <Link href={item.href} onClick={closeMenu} className="group flex items-baseline gap-5 md:gap-8 py-5 md:py-6">
            <span className="mono-label text-white/25 w-8 flex-shrink-0">{item.num}</span>
            <span className="heading-section text-white transition-all duration-hover ease-brand group-hover:text-white/50 group-hover:translate-x-2">
              {item.label}
            </span>
          </Link>
        </div>
      );
    }

    const expanded = mobileExpanded === item.href;

    return (
      <div key={item.href} className="border-b border-white/[0.07]" style={style}>
        <div className="flex items-baseline gap-5 md:gap-8 py-5 md:py-6">
          <span className="mono-label text-white/25 w-8 flex-shrink-0">{item.num}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <Link
                href={item.href}
                onClick={closeMenu}
                className="heading-section text-white transition-all duration-hover ease-brand hover:text-white/50"
              >
                {item.label}
              </Link>
              <button
                type="button"
                onClick={() => setMobileExpanded(expanded ? null : item.href)}
                className="text-white/40 hover:text-white/70 transition-colors p-1"
                aria-expanded={expanded}
                aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-ui ${expanded ? 'rotate-180' : ''}`}
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                >
                  <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>

            {expanded ? (
              <div className="mt-4 pl-0 space-y-1 border-l border-white/10 ml-0.5">
                {item.sectionLabel ? (
                  <p className="pl-4 pb-2 text-[8px] tracking-[0.45em] uppercase text-white/30">{item.sectionLabel}</p>
                ) : null}
                {item.children.map((child, childIndex) => (
                  <div key={child.href}>
                    {item.sectionLabel && childIndex === 1 ? (
                      <div className="my-2 ml-4 h-px bg-white/[0.06] max-w-[12rem]" aria-hidden />
                    ) : null}
                    <Link
                      href={child.href}
                      onClick={closeMenu}
                      className="block pl-4 py-2.5 text-white/45 hover:text-white/80 transition-colors duration-ui"
                    >
                    <span className="block text-[11px] tracking-[0.2em] uppercase">{child.label}</span>
                    {child.meta ? (
                      <span className="block mt-0.5 text-[8px] tracking-[0.35em] uppercase text-white/25">{child.meta}</span>
                    ) : null}
                    </Link>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5 md:px-10 md:py-7 transition-all duration-hover ease-brand lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-8 ${
        isScrolled || forceBackdrop ? 'bg-th-bg/60 border-b border-th-fg/10 backdrop-blur-xl' : 'border-b border-transparent'
      }`}>
        <Link
          href="/"
          className="relative z-50 flex shrink-0 items-center h-8 md:h-10 transition-opacity duration-hover hover:opacity-70"
        >
          <F28LogoMark className="block h-8 md:h-10 w-auto text-th-fg" aria-label="f/2.8" />
        </Link>

        <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-9">
          {menuItems.map(renderDesktopNavItem)}
        </nav>

        <div className="flex h-8 md:h-10 items-center gap-2 sm:gap-3 lg:justify-self-end shrink-0">
          <ThemeToggle />
          <span className="w-px h-3 bg-th-fg/15 shrink-0" aria-hidden />
          <LanguageSwitcher compact />
          <button
            onClick={toggleMenu}
            className="relative z-50 flex flex-col justify-center items-end gap-[4px] w-6 h-8 shrink-0 lg:hidden"
            aria-label="Toggle menu"
          >
            <span className={`h-px w-5 bg-th-fg transition-all duration-reveal ease-brand origin-center ${
              isOpen ? 'rotate-45 translate-y-[6px] opacity-100' : 'opacity-60 group-hover:opacity-100'
            }`} />
            <span className={`h-px bg-th-fg transition-all duration-reveal ease-brand ${
              isOpen ? 'opacity-0 w-0' : 'w-4 opacity-40'
            }`} />
            <span className={`h-px w-3 bg-th-fg transition-all duration-reveal ease-brand origin-center ${
              isOpen ? '-rotate-45 -translate-y-[6px] w-5 opacity-100' : 'opacity-25'
            }`} />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          clipPath: isVisible
            ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            : 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          transition: 'clip-path var(--duration-reveal) var(--ease-brand)',
        }}
      >
        <div className="absolute inset-0">
          <Image src="/menubg.webp" alt="" fill className="object-cover" quality={85} loading="lazy" sizes={MENU_BG_SIZES} />
          <div className="absolute inset-0 bg-black/75" />
        </div>

        <div className="relative h-full flex flex-col text-white px-8 md:px-16 lg:px-24 py-8 overflow-y-auto">
          <div
            className="flex items-center justify-between mb-auto pt-24 md:pt-28"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: isVisible
                ? 'opacity var(--duration-ui) var(--ease-brand) 0.2s'
                : 'opacity var(--duration-ui) var(--ease-brand)',
            }}
          >
            <span className="section-label text-white/25">Istanbul, Turkey</span>
            <span className="mono-label text-white/20">f/2.8</span>
          </div>

          <nav className="flex flex-col my-auto py-10 gap-1">
            {menuItems.map((item, index) => renderMobileNavItem(item, index))}
          </nav>

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
