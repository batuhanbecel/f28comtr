'use client';

import { useLanguage } from '@/context/LanguageContext';

interface TitleLabelProps {
  photographer: {
    title: string;
  };
}

export function TitleLabel({ photographer }: TitleLabelProps) {
  const { t } = useLanguage();
  
  return (
    <span className="section-label fade-in-up" style={{animationDelay: '0.1s', color: 'rgba(255,255,255,0.45)'}}>
      {(t.titleMap as Record<string, string>)[photographer.title] ?? photographer.title}
    </span>
  );
}
