'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { contactInfo as staticContactInfo } from '@/lib/data';
import { FOOTER_NAV } from '@/lib/siteRoutes';
import { F28LogoMark } from '@/components/F28LogoMark';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Closes every page: a large project call-to-action, then a quiet hairline
 * grid (studio · pages · contact · follow) and the legal line.
 */
export function Footer() {
  const { t, contactInfo: ctxContact, footerCta } = useLanguage();
  // The contact page already is the call to action — don't repeat it there.
  const showCta = usePathname() !== '/contact';
  const contactInfo = {
    email: ctxContact.email || staticContactInfo.email,
    instagram: ctxContact.instagram || staticContactInfo.instagram,
    linkedin: ctxContact.linkedin || staticContactInfo.linkedin,
    // Keep "No: 1" together so the number never wraps onto its own line
    address: (ctxContact.address || staticContactInfo.address).replace(/No:\s+/g, 'No: '),
    city: ctxContact.city || staticContactInfo.city,
  };

  // AI-Powered's sub-pages are listed flat alongside the main pages.
  const pages = FOOTER_NAV.flatMap((entry) =>
    entry.kind === 'link'
      ? [{ href: entry.path, label: t.nav[entry.navKey] }]
      : [
          { href: entry.href, label: t.nav[entry.labelKey] },
          ...entry.children
            .filter((child) => child.path !== entry.href)
            .map((child) => ({ href: child.path, label: `${t.nav[entry.labelKey]} ${t.nav[child.navKey]}` })),
        ],
  );

  return (
    <footer className="site-footer">
      {showCta ? (
        <div className="g-inner site-footer__cta">
          <span className="section-label">{footerCta.label}</span>
          <p className="site-footer__heading">{footerCta.heading}</p>
          <a href={`mailto:${contactInfo.email}`} className="site-footer__email">
            {contactInfo.email}
            <span aria-hidden> →</span>
          </a>
        </div>
      ) : null}

      <div className="g-inner site-footer__grid">
        <div className="site-footer__col">
          <Link href="/" aria-label={`f/2.8 — ${t.nav.home}`} className="w-fit transition-opacity duration-ui hover:opacity-70">
            <F28LogoMark className="h-9 w-auto text-th-fg" aria-hidden />
          </Link>
          <p className="site-footer__muted">
            {t.footer.tagline}
            <br />
            {t.footer.location}
          </p>
        </div>

        <nav className="site-footer__col" aria-label={t.footer.navigation}>
          <p className="site-footer__title">{t.footer.navigation}</p>
          <ul className="site-footer__links">
            {pages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="hover-line">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__col">
          <p className="site-footer__title">{t.footer.contact}</p>
          <ul className="site-footer__links">
            <li>
              <Link href="/contact" className="hover-line">
                {t.footer.contactPage}
              </Link>
            </li>
            <li>
              <a href={`mailto:${contactInfo.email}`} className="hover-line">
                {contactInfo.email}
              </a>
            </li>
          </ul>
          <p className="site-footer__muted">
            {contactInfo.address}
            <br />
            {contactInfo.city}
          </p>
        </div>

        <div className="site-footer__col">
          <p className="site-footer__title">{t.footer.follow}</p>
          <ul className="site-footer__links">
            <li>
              <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="hover-line">
                Instagram<span className="sr-only"> {t.a11y.opensInNewTab}</span>
              </a>
            </li>
            <li>
              <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover-line">
                LinkedIn<span className="sr-only"> {t.a11y.opensInNewTab}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="g-inner site-footer__legal">
        <p>
          &copy; {new Date().getFullYear()} f/2.8 Production. {t.footer.rights}
        </p>
        {/* Theme lives here (and in the phone menu) — the header keeps only the language */}
        <div className="flex items-center gap-3">
          <p>{t.footer.city}</p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
