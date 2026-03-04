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

  return (
    <footer className="bg-black border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-8 md:px-16">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 py-16 md:py-20">

          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="opacity-55 hover:opacity-100 transition-opacity duration-300 w-fit">
              <Image src="/logos/f28/f28_white.png" alt="f/2.8" width={90} height={45} className="h-8 w-auto" />
            </Link>
            <div className="space-y-1">
              <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase">{t.footer.tagline}</p>
              <p className="text-white/15 text-[10px] tracking-[0.4em] uppercase">{t.footer.location}</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-white/20 text-[9px] tracking-[0.55em] uppercase mb-7">{t.footer.navigation}</p>
            <nav className="flex flex-col gap-3.5">
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-white/35 text-[13px] tracking-wide hover:text-white/80 transition-colors duration-300 w-fit hover-line"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/20 text-[9px] tracking-[0.55em] uppercase mb-7">{t.footer.contact}</p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-white/35 text-[13px] tracking-wide hover:text-white/80 transition-colors duration-300 block mb-8 hover-line w-fit"
            >
              {contactInfo.email}
            </a>
            <p className="text-white/20 text-[9px] tracking-[0.55em] uppercase mb-4">{t.footer.follow}</p>
            <div className="flex gap-5">
              <Link href={contactInfo.instagram} target="_blank" rel="noopener noreferrer"
                className="text-white/30 text-[10px] tracking-[0.4em] uppercase hover:text-white/70 transition-colors duration-300">
                Instagram
              </Link>
              <Link href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-white/30 text-[10px] tracking-[0.4em] uppercase hover:text-white/70 transition-colors duration-300">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/15 text-[9px] tracking-[0.35em] uppercase">
            &copy; {new Date().getFullYear()} f/2.8 Production. {t.footer.rights}
          </p>
          <p className="text-white/10 text-[9px] tracking-[0.3em] uppercase font-mono">
            {t.footer.city}
          </p>
        </div>

      </div>
    </footer>
  );
}
