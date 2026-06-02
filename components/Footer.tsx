'use client';

import Link from 'next/link';
import { PUBLIC_SITE_ROUTES } from '@/lib/siteRoutes';
import { F28LogoMark } from '@/components/F28LogoMark';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t, contactInfo } = useLanguage();

  const navLinks = PUBLIC_SITE_ROUTES.map(({ path, navKey }) => ({
    href: path,
    label: t.nav[navKey],
  }));

  const linkClass =
    'text-th-fg/35 text-[13px] tracking-wide hover:text-th-fg/80 transition-colors duration-ui w-fit hover-line';

  return (
    <footer className="bg-th-bg border-t border-th-fg/10">
      <div className="page-section max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-12 md:pb-16">
          <div className="flex flex-col gap-6">
            <Link href="/" className="opacity-55 hover:opacity-100 transition-opacity duration-ui w-fit hover-line">
              <F28LogoMark className="h-8 w-auto text-th-fg" />
            </Link>
            <div className="space-y-1">
              <p className="section-label text-th-fg/45">{t.footer.tagline}</p>
              <p className="section-label text-th-fg/40">{t.footer.location}</p>
            </div>
          </div>

          <div>
            <p className="section-label text-th-fg/45 mb-7">{t.footer.navigation}</p>
            <nav className="flex flex-col gap-3.5" aria-label={t.footer.navigation}>
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className={linkClass}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="section-label text-th-fg/45 mb-7">{t.footer.contact}</p>
            <nav className="flex flex-col gap-3.5 mb-8" aria-label={t.footer.contact}>
              <Link href="/contact" className={linkClass}>
                {t.footer.contactPage}
              </Link>
              <a href={`mailto:${contactInfo.email}`} className={linkClass}>
                {contactInfo.email}
              </a>
              <p className="text-th-fg/30 text-[13px] leading-relaxed tracking-wide">
                {contactInfo.address}
                <br />
                {contactInfo.city}
              </p>
            </nav>
            <p className="section-label text-th-fg/45 mb-4">{t.footer.follow}</p>
            <div className="flex gap-5">
              <Link
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} uppercase tracking-[0.2em] text-[10px]`}
              >
                Instagram
              </Link>
              <Link
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} uppercase tracking-[0.2em] text-[10px]`}
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-th-fg/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="section-label text-th-fg/35">
            &copy; {new Date().getFullYear()} f/2.8 Production. {t.footer.rights}
          </p>
          <p className="mono-label text-th-fg/30">{t.footer.city}</p>
        </div>
      </div>
    </footer>
  );
}
