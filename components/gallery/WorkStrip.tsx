'use client';

import Link from 'next/link';
import { BlockHead } from '@/components/gallery/BlockHead';
import { Tile } from '@/components/gallery/Tile';
import { ScrollerArrow } from '@/components/ScrollerArrow';
import { useLanguage } from '@/context/LanguageContext';
import { useScrollerArrows } from '@/hooks/useScrollerArrows';
import { coverSizes, WORK_STRIP_SLOTS } from '@/lib/imageSizes';

export interface WorkStripItem {
  href: string;
  src: string;
  alt: string;
  title: string;
  meta?: string;
}

interface WorkStripProps {
  items: WorkStripItem[];
  label?: string;
  title: string;
  intro?: string;
  viewAll?: { href: string; label: string };
  id?: string;
}

/** Edge-to-edge sideways-scrolling strip of work (swipe / trackpad / arrows). */
export function WorkStrip({ items, label, title, intro, viewAll, id }: WorkStripProps) {
  const { t } = useLanguage();
  const { trackRef, canPrev, canNext, scrollByPage } = useScrollerArrows<HTMLUListElement>(items.length);

  if (items.length === 0) return null;

  return (
    <section className="g-section g-section--flush" aria-labelledby={id}>
      <BlockHead
        id={id}
        label={label}
        title={title}
        intro={intro}
        actions={
          <>
            {viewAll ? (
              <Link href={viewAll.href} className="g-link hover-line mr-3">
                {viewAll.label}
                <span aria-hidden> →</span>
              </Link>
            ) : null}
            <ScrollerArrow direction="prev" onClick={() => scrollByPage(-1)} disabled={!canPrev} label={t.a11y.previousImage} />
            <ScrollerArrow direction="next" onClick={() => scrollByPage(1)} disabled={!canNext} label={t.a11y.nextImage} />
          </>
        }
      />
      <ul ref={trackRef} className="work-strip">
        {items.map((item, i) => (
          <li key={`${item.src}-${i}`} className="work-strip__item">
            <Tile
              href={item.href}
              src={item.src}
              alt={item.alt}
              sizes={coverSizes(item.src, WORK_STRIP_SLOTS)}
              title={item.title}
              meta={item.meta}
              eager={i < 3}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
