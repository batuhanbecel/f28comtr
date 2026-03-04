'use client';

import { useLanguage } from '@/context/LanguageContext';

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 z-50">
      <button
        onClick={() => setLang('en')}
        className={`text-[9px] tracking-[0.35em] uppercase transition-all duration-300 px-1 py-0.5 ${
          lang === 'en'
            ? 'text-white opacity-90'
            : 'text-white opacity-20 hover:opacity-50'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="w-px h-3 bg-white/20" />
      <button
        onClick={() => setLang('tr')}
        className={`text-[9px] tracking-[0.35em] uppercase transition-all duration-300 px-1 py-0.5 ${
          lang === 'tr'
            ? 'text-white opacity-90'
            : 'text-white opacity-20 hover:opacity-50'
        }`}
        aria-label="Türkçe'ye geç"
      >
        TR
      </button>
    </div>
  );
}
