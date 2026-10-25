'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { F28LogoMark } from '@/components/F28LogoMark';
import { useLanguage } from '@/context/LanguageContext';
import { translations, type Lang } from '@/lib/translations';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';

/** Desktop header: one button that switches to the other language. */
function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const next: Lang = lang === 'tr' ? 'en' : 'tr';
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      lang={next}
      aria-label={next === 'en' ? 'English' : 'Türkçe'}
      className="site-nav__lang"
    >
      {next.toUpperCase()}
    </button>
  );
}

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
  const [isHidden, setIsHidden] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const overlayNavRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const t = translations[lang];

  useEffect(() => {
    setIsOpen(false);
    setMobileExpanded(null);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;
    let lastTop = 0;
    const checkScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const snapContainer = document.querySelector('[data-snap-container]');
        const scrollTop = snapContainer ? (snapContainer as HTMLElement).scrollTop : window.scrollY;
        setIsScrolled(scrollTop > 50);
        // Header steps out of the way while reading down, returns on any scroll up.
        const delta = scrollTop - lastTop;
        if (scrollTop <= 160) {
          setIsHidden(false);
          lastTop = scrollTop;
        } else if (Math.abs(delta) > 6) {
          setIsHidden(delta > 0);
          lastTop = scrollTop;
        }
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
      document.body.dataset.menuOpen = 'true';
      const timer = setTimeout(() => setIsVisible(true), 20);
      return () => clearTimeout(timer);
    }
    setIsVisible(false);
    delete document.body.dataset.menuOpen;
    const timer = setTimeout(() => { document.body.style.overflow = 'unset'; }, 600);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Overlay: move focus into the menu on open; Escape closes and returns focus to the toggle.
  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = setTimeout(() => {
      overlayNavRef.current?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
    }, 120);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsOpen(false);
      toggleButtonRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  // Desktop dropdown: Escape closes it.
  useEffect(() => {
    if (!openDropdown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openDropdown]);
  // Home and artist pages open on full-bleed photography: transparent header with white type until scrolled.
  const isPhotoHeroPage = pathname === '/' || photographers.some((p) => pathname === `/${p.id}`);
  const overHero = isPhotoHeroPage && !isScrolled && !isOpen;
  const heroHeaderStyle = overHero
    ? ({ '--c-fg': '255 255 255', '--c-bg': '0 0 0' } as React.CSSProperties)
    : undefined;

  // Numbered like every index on the site. The logo is the way home; Portfolios
  // goes straight to its index; Contact is the header's call to action on desktop.
  const menuItems: NavItem[] = [
    { kind: 'link', href: '/production', label: t.nav.production, num: '01' },
    {
      kind: 'dropdown',
      href: '/ai-powered',
      label: t.nav.aiPowered,
      num: '02',
      children: [
        { href: '/ai-powered', label: t.nav.aiPoweredGallery },
        { href: '/ai-powered/portfolio', label: t.nav.aiPoweredPortfolio },
      ],
    },
    { kind: 'link', href: '/portfolios', label: t.nav.portfolios, num: '03' },
    { kind: 'link', href: '/about', label: t.nav.about, num: '04' },
  ];
  const sheetItems: NavItem[] = [
    ...menuItems,
    { kind: 'link', href: '/contact', label: t.nav.contact, num: '05' },
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
          aria-current={isActive ? 'page' : undefined}
          className={`site-nav__link ${isActive ? 'is-active' : ''}`}
        >
          <span className="site-nav__num" aria-hidden>
            {item.num}
          </span>
          {item.label}
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
        onFocus={() => openDesktopDropdown(dropdownKey)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) scheduleCloseDropdown();
        }}
      >
        <Link
          href={item.href}
          aria-current={pathname === item.href ? 'page' : undefined}
          className={`site-nav__link ${isActive ? 'is-active' : ''}`}
        >
          <span className="site-nav__num" aria-hidden>
            {item.num}
          </span>
          {item.label}
          <svg
            className={`w-2.5 h-2.5 opacity-50 transition-transform duration-ui ${isOpenDropdown ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
          >
            <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </Link>

        <div
          className={`absolute top-full left-0 pt-3 transition-all duration-ui ease-brand ${
            isOpenDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1 pointer-events-none'
          }`}
          onMouseEnter={() => openDesktopDropdown(dropdownKey)}
          onMouseLeave={scheduleCloseDropdown}
        >
          <ul className="site-nav__menu">
            {item.children.map((child, index) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  aria-current={pathname === child.href ? 'page' : undefined}
                  className={`site-nav__menu-link ${isActivePath(pathname, child.href) ? 'is-active' : ''}`}
                >
                  <span className="site-nav__num" aria-hidden>
                    {item.num}.{index + 1}
                  </span>
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const revealStyle = (index: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(24px)',
    transition: isVisible
      ? `opacity var(--duration-reveal) var(--ease-brand) ${index * 0.05 + 0.2}s, transform var(--duration-reveal) var(--ease-brand) ${index * 0.05 + 0.2}s`
      : 'opacity var(--duration-ui) var(--ease-brand), transform var(--duration-ui) var(--ease-brand)',
  });

  const renderMobileNavItem = (item: NavItem, index: number) => {
    const isActive =
      isActivePath(pathname, item.href) ||
      (item.kind === 'dropdown' && item.children.some((child) => isActivePath(pathname, child.href)));
    const labelClass = `menu-sheet__label ${isActive ? 'is-active' : ''}`;
    const number = (
      <span className="menu-sheet__num" aria-hidden>
        {item.num}
      </span>
    );

    if (item.kind === 'link') {
      return (
        <li key={item.href} className="menu-sheet__row" style={revealStyle(index)}>
          <Link
            href={item.href}
            onClick={closeMenu}
            aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
            className="menu-sheet__link"
          >
            {number}
            <span className={labelClass}>{item.label}</span>
          </Link>
        </li>
      );
    }

    const expanded = mobileExpanded === item.href;
    const subId = `menu-sub-${item.num}`;

    return (
      <li key={item.href} className="menu-sheet__row" style={revealStyle(index)}>
        <div className="menu-sheet__link">
          {number}
          <Link href={item.href} onClick={closeMenu} className={labelClass}>
            {item.label}
          </Link>
          <button
            type="button"
            onClick={() => setMobileExpanded(expanded ? null : item.href)}
            className="menu-sheet__toggle"
            aria-expanded={expanded}
            aria-controls={subId}
            aria-label={(expanded ? t.a11y.collapseSubmenu : t.a11y.expandSubmenu).replace('{label}', item.label)}
          >
            <svg className={`w-3.5 h-3.5 transition-transform duration-ui ${expanded ? 'rotate-45' : ''}`} viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        {expanded ? (
          <ul id={subId} className={`menu-sheet__sub ${item.sectionLabel ? 'menu-sheet__sub--grid' : ''}`}>
            {item.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={closeMenu}
                  aria-current={pathname === child.href ? 'page' : undefined}
                  className="menu-sheet__sublink"
                >
                  <span>{child.label}</span>
                  {child.meta ? <span className="menu-sheet__meta">{child.meta}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </li>
    );
  };

  return (
    <>
      <header
        className={`site-header ${pathname === '/' ? 'site-header--hero-intro ' : ''}${isScrolled ? 'is-scrolled ' : ''}${
          isHidden && !isOpen && !openDropdown ? 'is-hidden' : ''
        }`}
        style={heroHeaderStyle}
        onFocusCapture={() => setIsHidden(false)}
      >
        <Link
          href="/"
          aria-label={`f/2.8 — ${t.nav.home}`}
          className="relative z-50 flex shrink-0 items-center h-8 md:h-10 transition-opacity duration-hover hover:opacity-70"
        >
          <F28LogoMark className="block h-8 md:h-10 w-auto text-th-fg" aria-hidden />
        </Link>

        <nav className="site-nav hidden lg:flex" aria-label={t.a11y.mainNav}>
          {menuItems.map(renderDesktopNavItem)}
        </nav>

        <div className="flex items-center gap-3 lg:justify-self-end shrink-0">
          <div className="hidden lg:flex items-center gap-6">
            <LanguageToggle />
            <Link
              href="/contact"
              aria-current={isActivePath(pathname, '/contact') ? 'page' : undefined}
              className="site-nav__cta hover-line"
            >
              {t.nav.cta}
              <span aria-hidden> →</span>
            </Link>
          </div>
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={toggleMenu}
            className="site-header__menu-btn lg:hidden"
            aria-label={isOpen ? t.a11y.closeMenu : t.a11y.openMenu}
            aria-expanded={isOpen}
            aria-controls="site-menu-overlay"
          >
            <span aria-hidden>{isOpen ? t.nav.close : t.nav.menu}</span>
            <span className={`site-header__burger ${isOpen ? 'is-open' : ''}`} aria-hidden>
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <div
        id="site-menu-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={t.a11y.mainNav}
        inert={!isOpen}
        className={`menu-sheet lg:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          clipPath: isVisible ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
          transition: 'clip-path var(--duration-reveal) var(--ease-brand)',
        }}
      >
        <div className="menu-sheet__inner">
          <nav ref={overlayNavRef} aria-label={t.a11y.mainNav}>
            <ul className="menu-sheet__list">{sheetItems.map((item, index) => renderMobileNavItem(item, index))}</ul>
          </nav>

          <div className="menu-sheet__foot" style={revealStyle(sheetItems.length + 1)}>
            <a href={`mailto:${contactInfo.email}`} className="menu-sheet__email hover-line">
              {contactInfo.email}
            </a>
            <div className="menu-sheet__prefs">
              <LanguageSwitcher />
              <span className="w-px h-3 bg-th-fg/15 shrink-0" aria-hidden />
              <ThemeToggle />
            </div>
            <div className="menu-sheet__contact">
              <span className="menu-sheet__socials">
                <Link href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="hover-line">
                  Instagram<span className="sr-only"> {t.a11y.opensInNewTab}</span>
                </Link>
                <Link href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover-line">
                  LinkedIn<span className="sr-only"> {t.a11y.opensInNewTab}</span>
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
