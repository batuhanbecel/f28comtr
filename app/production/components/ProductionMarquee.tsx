'use client';

import { WorkStrip } from '@/components/gallery/WorkStrip';
import type { HomeSelectedWork } from '@/lib/homeV2.shared';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';

interface ProductionMarqueeProps {
  /** The site-wide "Seçili İşler" list (`getSelectedWorks`). */
  items: HomeSelectedWork[];
  copy: Pick<ProductionPageCopy, 'marqueeLabel' | 'team'>;
}

/** The site's selected works as an edge-to-edge strip — same list as the home mosaic. */
export function ProductionMarquee({ items, copy }: ProductionMarqueeProps) {
  return (
    <WorkStrip
      id="production-network-title"
      label={copy.team.sectionLabel}
      title={copy.marqueeLabel}
      intro={copy.team.description}
      viewAll={{ href: '/portfolios', label: copy.team.cta }}
      items={items.map((work) => ({
        href: work.href,
        src: work.imageSrc,
        alt: work.workTitle ? `${work.workTitle} — ${work.artistName}` : work.artistName,
        title: work.workTitle || work.artistName,
        meta: work.workTitle ? work.artistName : undefined,
      }))}
    />
  );
}
