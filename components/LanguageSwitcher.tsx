'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Lang } from '@/lib/translations';

interface LanguageSwitcherProps {
  compact?: boolean;
}

const OPTIONS: { value: Lang; label: string; name: string }[] = [
  { value: 'en', label: 'EN', name: 'English' },
  { value: 'tr', label: 'TR', name: 'Türkçe' },
];

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { lang, setLang, t } = useLanguage();

  const btnClass = compact
    ? 'text-xs tracking-[0.12em] min-w-7 h-8 px-1'
    : 'text-[13px] tracking-[0.22em] min-w-8 h-8 px-1.5';

  return (
    <div className="flex items-center gap-1 z-50 shrink-0" role="group" aria-label={t.a11y.language}>
      {OPTIONS.map((option, index) => {
        const active = lang === option.value;
        return (
          <span key={option.value} className="flex items-center gap-1">
            {index > 0 ? <span className="w-px h-3 bg-th-fg/20 shrink-0" aria-hidden /> : null}
            <button
              type="button"
              onClick={() => {
                if (!active) setLang(option.value);
              }}
              className={`inline-flex items-center justify-center font-medium uppercase transition-colors duration-ui ease-brand ${btnClass} ${
                active ? 'text-th-fg' : 'text-th-fg/62 hover:text-th-fg'
              }`}
              aria-label={option.name}
              aria-pressed={active}
              lang={option.value}
            >
              {option.label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
