'use client';

import Link from 'next/link';
import Image from 'next/image';
import { contactInfo } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const NAV = [
    { href: '/', label: t.nav.home },
    { href: '/production', label: t.nav.production },
    { href: '/ai-based', label: t.nav.aiBased },
    { href: '/portfolios', label: t.nav.portfolios },
    { href: '/about', label: t.nav.about },
  ];

  const linkClass = 'text-th-fg/35 text-[13px] tracking-wide hover:text-th-fg/80 transition-colors duration-ui w-fit hover-line';

  return (
    <footer className="bg-th-bg border-t border-th-fg/10">
      <div className="page-section max-w-7xl mx-auto w-full">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-12 md:pb-16">

          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="opacity-55 hover:opacity-100 transition-opacity duration-ui w-fit hover-line">
              <Image src="/logos/f28/f28_white.png" alt="f/2.8" width={90} height={45} className="h-8 w-auto dark:invert-0 invert" loading="lazy" />
            </Link>
            <div className="space-y-1">
              <p className="section-label opacity-40">{t.footer.tagline}</p>
              <p className="section-label opacity-30">{t.footer.location}</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="section-label opacity-40 mb-7">{t.footer.navigation}</p>
            <nav className="flex flex-col gap-3.5">
              {NAV.map(({ href, label }) => (
                <Link key={href} href={href} className={linkClass}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="section-label opacity-40 mb-7">{t.footer.contact}</p>
            <a href={`mailto:${contactInfo.email}`} className={`${linkClass} block mb-8`}>
              {contactInfo.email}
            </a>
            <p className="section-label opacity-40 mb-4">{t.footer.follow}</p>
            <div className="flex gap-5">
              <Link href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className={`section-label opacity-40 hover:opacity-80 transition-opacity duration-ui hover-line`}>
                Instagram
              </Link>
              <Link href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className={`section-label opacity-40 hover:opacity-80 transition-opacity duration-ui hover-line`}>
                LinkedIn
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-th-fg/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="section-label opacity-25">
            &copy; {new Date().getFullYear()} f/2.8 Production. {t.footer.rights}
          </p>
          <p className="mono-label opacity-20">
            {t.footer.city}
          </p>
        </div>

      </div>
    </footer>
  );
}
