'use client';

import { createContext, use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ContactPageCopy } from '@/lib/pageCopy.types';
import { translations, type Lang, type T } from '@/lib/translations';
import { persistLangClient } from '@/lib/prefs';

export type SiteContactInfo = ContactPageCopy['info'];

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: T;
  contactInfo: SiteContactInfo;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
  contactInfo: {
    email: '',
    instagram: '',
    linkedin: '',
    address: '',
    city: '',
  },
});

export function LanguageProvider({
  children,
  initialLang = 'en',
  initialContactInfo,
}: {
  children: React.ReactNode;
  initialLang?: Lang;
  initialContactInfo: SiteContactInfo;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const router = useRouter();

  useEffect(() => {
    setLangState(initialLang);
    persistLangClient(initialLang);
  }, [initialLang]);

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      persistLangClient(l);
      router.refresh();
    },
    [router],
  );

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t: translations[lang], contactInfo: initialContactInfo }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return use(LanguageContext);
}
