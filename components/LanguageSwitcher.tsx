'use client';

import { useLanguage } from '@/context/LanguageContext';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  const btnClass = compact
    ? 'text-xs tracking-[0.12em] px-1 py-0.5'
    : 'text-[13px] tracking-[0.22em] px-1.5 py-1';

  return (
    <div className="flex items-center gap-1 z-50 shrink-0">
      <button
        onClick={() => setLang('en')}
        className={`font-medium uppercase transition-all duration-ui ease-brand ${btnClass} ${
          lang === 'en'
            ? 'text-th-fg opacity-90'
            : 'text-th-fg opacity-45 hover:opacity-70'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="w-px h-3 bg-th-fg/20 shrink-0" aria-hidden />
      <button
        onClick={() => setLang('tr')}
        className={`font-medium uppercase transition-all duration-ui ease-brand ${btnClass} ${
          lang === 'tr'
            ? 'text-th-fg opacity-90'
            : 'text-th-fg opacity-45 hover:opacity-70'
        }`}
        aria-label="Türkçe'ye geç"
      >
        TR
      </button>
    </div>
  );
}
