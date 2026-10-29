'use client';

import { Tile } from '@/components/gallery/Tile';
import { useLanguage } from '@/context/LanguageContext';
import { formatRoles } from '@/lib/artistRoles';
import type { Photographer } from '@/lib/data';
import { artistGridSizes } from '@/lib/imageSizes';
import { ViewTransition } from '@/lib/ViewTransition';

/** Edge-to-edge portrait grid for /portfolios — names always visible. */
export function ArtistGrid({ photographers }: { photographers: Photographer[] }) {
  const { t } = useLanguage();
  if (photographers.length === 0) return null;

  return (
    <ul className="bleed-grid" style={{ '--cols-sm': 2, '--cols-md': 2, '--cols-lg': 5 } as React.CSSProperties}>
      {photographers.map((p, i) => (
        <li key={p.id}>
          <Tile
            href={`/${p.id}`}
            src={p.preview}
            alt={p.fullName}
            sizes={artistGridSizes(p.preview)}
            title={p.fullName}
            meta={formatRoles(p.roles, t.titleMap)}
            ratio="3 / 4"
            eager={i < 5}
            showCredit
            wrapImage={(image) => <ViewTransition name={`photographer-${p.id}`}>{image}</ViewTransition>}
          />
        </li>
      ))}
    </ul>
  );
}
