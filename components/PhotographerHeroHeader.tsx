'use client';

import { PageHeader } from '@/components/PageHeader';
import { useLanguage } from '@/context/LanguageContext';

interface PhotographerHeroHeaderProps {
  name: string;
  title: string;
  children?: React.ReactNode;
}

export function PhotographerHeroHeader({ name, title, children }: PhotographerHeroHeaderProps) {
  const { t } = useLanguage();
  const localizedTitle = (t.titleMap as Record<string, string>)[title] ?? title;

  return (
    <PageHeader
      label={localizedTitle}
      title={name}
      variant="hero"
      shell={false}
      gradient={false}
    >
      <div className="min-h-[44px]">{children}</div>
    </PageHeader>
  );
}
