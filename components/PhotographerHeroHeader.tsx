'use client';

import { PageHeader } from '@/components/PageHeader';
import { useLanguage } from '@/context/LanguageContext';
import { formatRoles, type ArtistRole } from '@/lib/artistRoles';

interface PhotographerHeroHeaderProps {
  name: string;
  roles: ArtistRole[];
  children?: React.ReactNode;
}

export function PhotographerHeroHeader({ name, roles, children }: PhotographerHeroHeaderProps) {
  const { t } = useLanguage();
  const localizedTitle = formatRoles(roles, t.titleMap);

  return (
    <PageHeader
      label={localizedTitle}
      title={name}
      variant="hero"
      align="left"
      shell={false}
      gradient={false}
    >
      <div className="min-h-[44px]">{children}</div>
    </PageHeader>
  );
}
