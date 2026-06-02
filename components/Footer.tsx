'use client';

import Link from 'next/link';
import { contactInfo as staticContactInfo } from '@/lib/data';
import { FOOTER_NAV } from '@/lib/siteRoutes';
import { F28LogoMark } from '@/components/F28LogoMark';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t, contactInfo: ctxContact } = useLanguage();
  const contactInfo = {
    email: ctxContact.email || staticContactInfo.email,
    instagram: ctxContact.instagram || staticContactInfo.instagram,
    linkedin: ctxContact.linkedin || staticContactInfo.linkedin,
    address: ctxContact.address || staticContactInfo.address,
    city: ctxContact.city || staticContactInfo.city,
  };

  const linkClass =
    'text-th-fg/58 text-sm tracking-wide hover:text-th-fg/90 transition-colors duration-ui w-fit hover-line';

  const childLinkClass =
    'text-th-fg/52 text-[13px] tracking-wide hover:text-th-fg/82 transition-colors duration-ui w-fit hover-line pl-0';

  return (
    <footer className="bg-th-bg border-t border-th-fg/10">
      <div className="page-section max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-12 md:pb-16">
          <div className="flex flex-col gap-6">
            <Link href="/" className="opacity-55 hover:opacity-100 transition-opacity duration-ui w-fit hover-line">
              <F28LogoMark className="h-8 w-auto text-th-fg" />
            </Link>
            <div className="space-y-1">
              <p className="section-label">{t.footer.tagline}</p>
              <p className="section-label">{t.footer.location}</p>
            </div>
          </div>

          <div>
            <p className="section-label mb-7">{t.footer.navigation}</p>
            <nav className="flex flex-col gap-3.5" aria-label={t.footer.navigation}>
              {FOOTER_NAV.map((entry) => {
                if (entry.kind === 'link') {
                  return (
                    <Link key={entry.path} href={entry.path} className={linkClass}>
                      {t.nav[entry.navKey]}
                    </Link>
                  );
                }

                return (
                  <div key="ai-powered-group" className="flex flex-col gap-2.5">
                    <Link href={entry.href} className={linkClass}>
                      {t.nav[entry.labelKey]}
                    </Link>
                    <div className="flex flex-col gap-2 pl-4 border-l border-th-fg/10">
                      {entry.children.map((child) => (
                        <Link key={child.path} href={child.path} className={childLinkClass}>
                          {t.nav[child.navKey]}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="section-label mb-7">{t.footer.contact}</p>
            <nav className="flex flex-col gap-3.5 mb-8" aria-label={t.footer.contact}>
              <Link href="/contact" className={linkClass}>
                {t.footer.contactPage}
              </Link>
              <a href={`mailto:${contactInfo.email}`} className={linkClass}>
                {contactInfo.email}
              </a>
              <p className="text-th-fg/58 text-sm leading-relaxed tracking-wide">
                {contactInfo.address}
                <br />
                {contactInfo.city}
              </p>
            </nav>
            <p className="section-label mb-4">{t.footer.follow}</p>
            <div className="flex gap-5">
              <Link
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} uppercase tracking-[0.18em] text-xs`}
              >
                Instagram
              </Link>
              <Link
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} uppercase tracking-[0.18em] text-xs`}
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-th-fg/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="section-label">
            &copy; {new Date().getFullYear()} f/2.8 Production. {t.footer.rights}
          </p>
          <p className="mono-label">{t.footer.city}</p>
        </div>
      </div>
    </footer>
  );
}
