'use client';

import { createContext, use, useState, useEffect, useCallback } from 'react';
import { translations, type Lang, type T } from '@/lib/translations';
import { persistLangClient } from '@/lib/prefs';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: T;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({
  children,
  initialLang = 'en',
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    setLangState(initialLang);
    persistLangClient(initialLang);
  }, [initialLang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    persistLangClient(l);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return use(LanguageContext);
}
