'use client';

import { useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { scrollHeroSnapToContent } from '@/lib/heroSnapScroll';

interface ScrollIndicatorProps {
  inHero?: boolean;
}

export function ScrollIndicator({ inHero = false }: ScrollIndicatorProps) {
  const { t } = useLanguage();

  const scrollToContent = useCallback(() => {
    const container = document.querySelector('[data-snap-container]') as HTMLElement | null;
    if (container) {
      scrollHeroSnapToContent(container);
      return;
    }
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToContent}
      className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-full flex justify-center bg-transparent border-0 cursor-pointer text-inherit ${
        inHero ? '' : 'fade-in-up'
      }`}
      style={inHero ? undefined : { animationDelay: '0.5s' }}
      aria-label={t.common.scroll}
    >
      <div className={`flex flex-col items-center gap-2 animate-bounce ${inHero ? 'scroll-indicator-hint' : ''}`}>
        <span className="caption-text pl-[0.35em] opacity-80">{t.common.scroll}</span>
        <svg className="w-4 h-4 text-th-fg/45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="square" d="M12 5v14M5 13l7 7 7-7" />
        </svg>
      </div>
    </button>
  );
}
