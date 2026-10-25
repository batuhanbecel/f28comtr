import Link from 'next/link';
import type { CSSProperties } from 'react';
import { BlockHead } from '@/components/gallery/BlockHead';
import { Tile } from '@/components/gallery/Tile';
import type { WorkStripItem } from '@/components/gallery/WorkStrip';
import { coverSizes } from '@/lib/imageSizes';

interface WorkMosaicProps {
  items: WorkStripItem[];
  label?: string;
  title: string;
  intro?: string;
  viewAll?: { href: string; label: string };
  id?: string;
}

/** Column spans on the 6-column grid (768px+): a wide + a narrow, then three equal. */
const ROWS = [
  [4, 2],
  [2, 2, 2],
];

/**
 * Spans for every item. Rows repeat the pattern; a short last row stretches so
 * the edge-to-edge grid never ends ragged. Phones: 2 columns — one full-width
 * work, then a pair.
 */
function layout(count: number) {
  const out: { span: number; spanSm: number }[] = [];
  let r = 0;
  while (out.length < count) {
    const row = ROWS[r % ROWS.length];
    const left = count - out.length;
    const spans = left >= row.length ? row : left === 1 ? [6] : [3, 3];
    spans.forEach((span) => out.push({ span, spanSm: 1 }));
    r++;
  }
  // Phones run their own rhythm: one full-width work, then a pair
  out.forEach((o, i) => (o.spanSm = i % 3 === 0 ? 2 : 1));
  // A lone half at the end fills the row
  if (out.length % 3 === 2) out[out.length - 1].spanSm = 2;
  return out;
}

/**
 * Cover-aware sizes: phones 4:5 (full width) or 3:4 (half) tiles; from 768px
 * span/6 of the width × a row height of clamp(20rem, 38vw, 46rem) — 42vw
 * covers the 20rem floor at 768px. Landscape work in a narrow tile is cropped
 * to the row height, so it needs far more than the tile width.
 */
const sizesFor = (src: string, span: number, spanSm: number) =>
  coverSizes(src, [
    spanSm === 2
      ? { media: '(max-width: 767px)', width: 100, height: 125 }
      : { media: '(max-width: 767px)', width: 50, height: 66.7 },
    { width: (span / 6) * 100, height: 42 },
  ]);

/** Large edge-to-edge work grid — the home page's selected work. */
export function WorkMosaic({ items, label, title, intro, viewAll, id }: WorkMosaicProps) {
  if (items.length === 0) return null;
  const spans = layout(items.length);

  return (
    <section className="g-section g-section--flush" aria-labelledby={id}>
      <BlockHead
        id={id}
        label={label}
        title={title}
        intro={intro}
        actions={
          viewAll ? (
            <Link href={viewAll.href} className="g-link hover-line">
              {viewAll.label}
              <span aria-hidden> →</span>
            </Link>
          ) : null
        }
      />
      <ul className="work-mosaic">
        {items.map((item, i) => {
          const { span, spanSm } = spans[i];
          return (
            <li
              key={`${item.src}-${i}`}
              className={`work-mosaic__item ${spanSm === 2 ? 'work-mosaic__item--wide-sm' : ''}`.trim()}
              style={{ '--span': span, '--span-sm': spanSm } as CSSProperties}
            >
              <Tile
                href={item.href}
                src={item.src}
                alt={item.alt}
                sizes={sizesFor(item.src, span, spanSm)}
                title={item.title}
                meta={item.meta}
                ratio="auto"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
