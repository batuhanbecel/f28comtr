'use client';

import { WorkStrip } from '@/components/gallery/WorkStrip';
import type { ProductionMarqueeItem } from '@/lib/productionMarquee.shared';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';

interface ProductionMarqueeProps {
  items: ProductionMarqueeItem[];
  copy: Pick<ProductionPageCopy, 'heading' | 'marqueeLabel' | 'team'>;
}

/** Work across the roster — the same edge-to-edge strip as the home page. */
export function ProductionMarquee({ items, copy }: ProductionMarqueeProps) {
  return (
    <WorkStrip
      id="production-network-title"
      label={copy.team.sectionLabel}
      title={copy.marqueeLabel}
      intro={copy.team.description}
      viewAll={{ href: '/portfolios', label: copy.team.cta }}
      items={items.map((item) => ({
        href: `/${item.photographerId}`,
        src: item.src,
        alt: `${item.photographerName} — ${copy.heading}`,
        title: item.photographerName,
      }))}
    />
  );
}
