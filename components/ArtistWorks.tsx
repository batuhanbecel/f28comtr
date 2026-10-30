'use client';

import { WorkStrip } from '@/components/gallery/WorkStrip';
import { useLanguage } from '@/context/LanguageContext';
import { formatRoles } from '@/lib/artistRoles';
import type { ArtistWork } from '@/lib/cms';

/** Artist page: the works that credit them (`getArtistWorks`), with what they did on each. */
export function ArtistWorks({ works }: { works: ArtistWork[] }) {
  const { t } = useLanguage();

  return (
    <WorkStrip
      id="artist-works-title"
      label={t.artistWorks.label}
      title={t.artistWorks.title}
      size="compact"
      items={works.map((work) => {
        const roles = formatRoles(work.roles, t.titleMap, ', ');
        return {
          href: work.href,
          src: work.src,
          alt: work.alt,
          title: work.title || work.brand,
          meta: work.title ? `${work.brand} · ${roles}` : roles,
        };
      })}
    />
  );
}
