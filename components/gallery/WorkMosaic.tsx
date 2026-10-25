import Link from 'next/link';
import type { CSSProperties } from 'react';
import { BlockHead } from '@/components/gallery/BlockHead';
import { Tile } from '@/components/gallery/Tile';
import type { WorkStripItem } from '@/components/gallery/WorkStrip';

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

const DESKTOP_WIDTH: Record<number, string> = { 6: '100vw', 4: '67vw', 3: '50vw', 2: '34vw' };
const sizesFor = (span: number, spanSm: number) =>
  `(max-width: 767px) ${spanSm === 2 ? '100vw' : '50vw'}, ${DESKTOP_WIDTH[span]}`;

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
                sizes={sizesFor(span, spanSm)}
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
