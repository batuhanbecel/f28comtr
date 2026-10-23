'use client';

import Image from '@/components/Image';
import Link from 'next/link';
import { useState } from 'react';
import { BlockHead } from '@/components/gallery/BlockHead';
import { useLanguage } from '@/context/LanguageContext';
import type { Photographer } from '@/lib/data';
import { shouldSkipOptimization } from '@/lib/blob';
import { ROSTER_PREVIEW_SIZES } from '@/lib/imageSizes';

interface HomeArtistRosterProps {
  photographers: Photographer[];
  label: string;
  heading: string;
  intro: string;
  viewAllLabel: string;
}

/**
 * Typographic roster: large names on hairlines; the hovered / focused artist's
 * portrait shows in a sticky frame beside the list (desktop). Phones get a
 * small portrait at the start of each row instead.
 */
export function HomeArtistRoster({ photographers, label, heading, intro, viewAllLabel }: HomeArtistRosterProps) {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  if (photographers.length === 0) return null;

  const role = (title: string) => (t.titleMap as Record<string, string>)[title] ?? title;

  return (
    <section className="g-section" aria-labelledby="roster-title">
      <BlockHead
        id="roster-title"
        label={label}
        title={heading}
        intro={intro}
        actions={
          <Link href="/portfolios" className="g-link hover-line">
            {viewAllLabel}
          </Link>
        }
      />
      <div className="g-inner roster">
        <ol className="roster__list">
          {photographers.map((p, i) => (
            <li key={p.id}>
              <Link
                href={`/${p.id}`}
                className={`roster__row ${i === active ? 'is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="roster__thumb" aria-hidden>
                  <Image
                    src={p.preview}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                    loading="lazy"
                    unoptimized={shouldSkipOptimization(p.preview)}
                  />
                </span>
                <span className="index-list__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="roster__name">{p.fullName}</span>
                <span className="roster__role">{role(p.title)}</span>
              </Link>
            </li>
          ))}
        </ol>

        <div className="roster__preview" aria-hidden>
          {photographers.map((p, i) => (
            <Image
              key={p.id}
              src={p.preview}
              alt=""
              fill
              className={`object-cover roster__preview-img ${i === active ? 'is-active' : ''}`}
              sizes={ROSTER_PREVIEW_SIZES}
              loading={i < 2 ? 'eager' : 'lazy'}
              unoptimized={shouldSkipOptimization(p.preview)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
