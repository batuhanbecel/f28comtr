'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './globals.css';
import { translations, type Lang } from '@/lib/translations';
import { F28Logo } from '@/components/F28Logo';

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Root layout (with providers) is replaced here, so read prefs from cookies.
  const [lang, setLang] = useState<Lang>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    console.error(error);
    setLang(readCookie('f28_lang') === 'tr' ? 'tr' : 'en');
    setTheme(readCookie('f28_theme') === 'light' ? 'light' : 'dark');
  }, [error]);

  const t = translations[lang].errors;

  return (
    <html lang={lang} data-theme={theme}>
      <body className="antialiased bg-th-bg text-th-fg">
        <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
          <div className="mb-12">
            <F28Logo width={220} className="text-th-fg" delay={0} />
          </div>

          <div className="text-center space-y-4">
            <p className="section-label section-label--pill mx-auto">{t.label}</p>
            <p className="body-text text-muted-body">{t.description}</p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={reset} className="btn-editorial btn-editorial--primary">
                {t.tryAgain}
              </button>
              <Link href="/" className="btn-editorial">
                {t.backHome}
              </Link>
            </div>
          </div>

          <p className="absolute bottom-10 section-label opacity-50">f/2.8 Production Agency</p>
        </main>
      </body>
    </html>
  );
}
