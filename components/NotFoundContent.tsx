'use client';

import { EditorialButton } from '@/components/EditorialButton';
import { F28Logo } from '@/components/F28Logo';
import { useLanguage } from '@/context/LanguageContext';

export function NotFoundContent() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-th-bg text-th-fg flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="mb-12">
        <F28Logo width={220} className="text-th-fg" delay={0} />
      </div>

      <div className="text-center space-y-4">
        <p className="section-label section-label--pill mx-auto">{t.notFound.title}</p>
        <p className="body-text opacity-40">{t.notFound.description}</p>
        <div className="pt-4">
          <EditorialButton href="/">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {t.notFound.backHome}
          </EditorialButton>
        </div>
      </div>

      <p className="absolute bottom-10 section-label opacity-20">f/2.8 Production Agency</p>
    </main>
  );
}
