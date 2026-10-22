'use client';

import { useLanguage } from '@/context/LanguageContext';
import { toDisplayCase } from '@/lib/displayCase';

/** Renders CMS headings in sentence case (see lib/displayCase.ts). */
export function DisplayCase({ children }: { children: string }) {
  const { lang } = useLanguage();
  return <>{toDisplayCase(children, lang)}</>;
}
