'use client';

import { Tile } from '@/components/gallery/Tile';
import { useLanguage } from '@/context/LanguageContext';
import type { Photographer } from '@/lib/data';
import { ARTIST_GRID_SIZES } from '@/lib/imageSizes';
import { ViewTransition } from '@/lib/ViewTransition';

/** Edge-to-edge portrait grid for /portfolios — names always visible. */
export function ArtistGrid({ photographers }: { photographers: Photographer[] }) {
  const { t } = useLanguage();
  if (photographers.length === 0) return null;

  return (
    <ul className="bleed-grid" style={{ '--cols-sm': 2, '--cols-md': 3, '--cols-lg': 5 } as React.CSSProperties}>
      {photographers.map((p, i) => (
        <li key={p.id}>
          <Tile
            href={`/${p.id}`}
            src={p.preview}
            alt={p.fullName}
            sizes={ARTIST_GRID_SIZES}
            title={p.fullName}
            meta={(t.titleMap as Record<string, string>)[p.title] ?? p.title}
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
