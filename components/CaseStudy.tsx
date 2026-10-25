import Link from 'next/link';
import type { ReactNode } from 'react';
import { Tile } from '@/components/gallery/Tile';
import { coverSizes } from '@/lib/imageSizes';

export interface CaseMetaItem {
  label: string;
  value: ReactNode;
}

interface CaseHeroProps {
  back: { href: string; label: string };
  /** Brand above the title — omit when the title already is the brand. */
  eyebrow?: string;
  title: string;
  description?: string;
  meta: CaseMetaItem[];
  children?: ReactNode;
}

/**
 * Work page header: back link, brand, title, then the credits as one row of
 * columns. Kept compact so the work itself starts on the first screen.
 */
export function CaseHero({ back, eyebrow, title, description, meta, children }: CaseHeroProps) {
  return (
    <header className="case-hero">
      <div className="case-hero__inner">
        <Link href={back.href} prefetch={false} className="section-label transition-opacity duration-ui hover:opacity-100">
          ← {back.label}
        </Link>
        {eyebrow ? <p className="case-hero__eyebrow">{eyebrow}</p> : null}
        <h1 className="heading-hero case-hero__title">{title}</h1>
        {description ? (
          <p className="body-text text-muted-body whitespace-pre-line case-hero__intro">{description}</p>
        ) : null}
        {meta.length > 0 ? (
          <dl className="case-meta">
            {meta.map((item) => (
              <div key={item.label} className="case-meta__item">
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {children}
      </div>
    </header>
  );
}

interface NextWorkProps {
  ariaLabel: string;
  next: { href: string; title: string; label: string; imageSrc: string; imageAlt: string };
  prev?: { href: string; title: string; label: string } | null;
}

/** End of a work page: the next work's cover, full bleed, so browsing flows on. */
export function NextWork({ ariaLabel, next, prev }: NextWorkProps) {
  return (
    <nav aria-label={ariaLabel} className="case-next">
      {prev ? (
        <div className="g-inner case-next__prev">
          <Link href={prev.href} className="g-link hover-line">
            ← {prev.label}: {prev.title}
          </Link>
        </div>
      ) : null}
      <Tile
        href={next.href}
        src={next.imageSrc}
        alt={next.imageAlt}
        sizes={coverSizes(next.imageSrc, [
          { media: '(max-width: 767px)', width: 100, height: 125 },
          { width: 100, height: 42.9 },
        ])}
        title={next.title}
        meta={`${next.label} →`}
        ratio="auto"
        showCredit
        className="case-next__tile"
      />
    </nav>
  );
}
