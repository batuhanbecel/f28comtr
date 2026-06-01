'use client';

import { useLanguage } from '@/context/LanguageContext';

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1.5 z-50">
      <button
        onClick={() => setLang('en')}
        className={`text-[11px] font-medium tracking-[0.25em] uppercase transition-all duration-ui ease-brand px-1.5 py-1 ${
          lang === 'en'
            ? 'text-th-fg opacity-90'
            : 'text-th-fg opacity-25 hover:opacity-55'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="w-px h-3.5 bg-th-fg/20" />
      <button
        onClick={() => setLang('tr')}
        className={`text-[11px] font-medium tracking-[0.25em] uppercase transition-all duration-ui ease-brand px-1.5 py-1 ${
          lang === 'tr'
            ? 'text-th-fg opacity-90'
            : 'text-th-fg opacity-25 hover:opacity-55'
        }`}
        aria-label="Türkçe'ye geç"
      >
        TR
      </button>
    </div>
  );
}
