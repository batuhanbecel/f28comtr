'use client';

import { WorkMosaic } from '@/components/gallery/WorkMosaic';
import { useLanguage } from '@/context/LanguageContext';
import { formatRoles } from '@/lib/artistRoles';
import type { HomeSelectedWork } from '@/lib/homeV2.shared';

interface HomeV2SelectedWorksProps {
  works: HomeSelectedWork[];
  sectionLabel: string;
  heading: string;
  viewAllLabel: string;
}

export function HomeV2SelectedWorks({ works, sectionLabel, heading, viewAllLabel }: HomeV2SelectedWorksProps) {
  const { t } = useLanguage();
  const roleLabel = (role: HomeSelectedWork['role']) => formatRoles([role], t.titleMap);

  return (
    <WorkMosaic
      id="selected-works-title"
      label={sectionLabel}
      title={heading}
      viewAll={{ href: '/portfolios', label: viewAllLabel }}
      items={works.map((work) => ({
        href: work.href,
        src: work.imageSrc,
        alt: work.workTitle ? `${work.workTitle} — ${work.artistName}` : work.artistName,
        title: work.workTitle || work.artistName,
        meta: work.workTitle ? `${work.artistName} · ${roleLabel(work.role)}` : roleLabel(work.role),
      }))}
    />
  );
}
