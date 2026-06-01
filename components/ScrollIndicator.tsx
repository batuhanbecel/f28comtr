'use client';

import { useLanguage } from '@/context/LanguageContext';

interface ScrollIndicatorProps {
  /** Synced tail after unified hero reveal */
  inHero?: boolean;
}

export function ScrollIndicator({ inHero = false }: ScrollIndicatorProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-full flex justify-center ${
        inHero ? '' : 'fade-in-up'
      }`}
      style={inHero ? undefined : { animationDelay: '0.5s' }}
    >
      <div className={`flex flex-col items-center gap-2 animate-bounce ${inHero ? 'scroll-indicator-hint' : ''}`}>
        <span className="text-th-fg/20 text-[9px] tracking-[0.45em] uppercase pl-[0.45em]">
          {t.common.scroll}
        </span>
        <svg className="w-4 h-4 text-th-fg/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="square" d="M12 5v14M5 13l7 7 7-7" />
        </svg>
      </div>
    </div>
  );
}
