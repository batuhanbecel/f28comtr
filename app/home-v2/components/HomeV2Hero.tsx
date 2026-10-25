'use client';

import Image from '@/components/Image';
import Link from 'next/link';
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { DisplayCase } from '@/components/DisplayCase';
import { useLanguage } from '@/context/LanguageContext';
import { shouldSkipOptimization } from '@/lib/blob';
import type { HomeV2HeroSlide } from '@/lib/homeV2.shared';
import {
  HOME_V2_HERO_FADE_MS,
  HOME_V2_HERO_HOLD_MS,
  HOME_V2_HERO_SLIDES,
} from '@/lib/homeV2HeroSlides';
import { coverImageSizes } from '@/lib/imageSizes';
import type { Lang } from '@/lib/translations';

interface HomeV2HeroProps {
  heroLabel: string;
  heroTitle: string;
  heroDescription: string;
  /** Featured works (Studio "Öne Çıkan İşler"); landing images when none are curated. */
  slides: HomeV2HeroSlide[];
  /** Accessible name for the numbered work index. */
  indexLabel: string;
}

/** Words in the hero sentence that link to their page — first match of each only. */
const KEYWORD_LINKS: Record<Lang, [string, string][]> = {
  en: [
    ['hybrid AI production', '/ai-powered'],
    ['photography', '/production'],
    ['retouch', '/portfolios'],
  ],
  tr: [
    ['hibrit AI prodüksiyon', '/ai-powered'],
    ['fotoğrafçılık', '/production'],
    ['rötuş', '/portfolios'],
  ],
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function linkKeywords(text: string, lang: Lang): ReactNode {
  const links = KEYWORD_LINKS[lang];
  const re = new RegExp(`(${links.map(([word]) => escapeRe(word)).join('|')})`, 'giu');
  const used = new Set<string>();
  return text.split(re).map((part, i) => {
    const hit = links.find(([word]) => word.toLocaleLowerCase(lang) === part.toLocaleLowerCase(lang));
    if (!hit || used.has(hit[0])) return <Fragment key={i}>{part}</Fragment>;
    used.add(hit[0]);
    return (
      <Link key={i} href={hit[1]} className="reel-statement__link">
        {part}
      </Link>
    );
  });
}

/**
 * Numbered reel: the work opens from a small frame to full bleed, one short
 * sentence sits bottom-left, and a numbered index (01 — 06) runs along the
 * bottom edge. Each number's hairline fills while its work is on screen; the
 * caption names the work and artist and links to it. Hovering or focusing the
 * index pauses the reel; reduced motion turns autoplay off.
 */
export function HomeV2Hero({ heroLabel, heroTitle, heroDescription, slides: slidesProp, indexLabel }: HomeV2HeroProps) {
  const { lang, t } = useLanguage();
  const slides: HomeV2HeroSlide[] = slidesProp.length > 0 ? slidesProp : [...HOME_V2_HERO_SLIDES];
  const count = slides.length;

  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [cycled, setCycled] = useState(false);
  const currentRef = useRef(0);

  const goTo = useCallback(
    (next: number) => {
      const target = ((next % count) + count) % count;
      if (target === currentRef.current) return;
      setPrevious(currentRef.current);
      currentRef.current = target;
      setCurrent(target);
      setCycled(true);
    },
    [count],
  );

  useEffect(() => {
    if (previous === null) return;
    const id = window.setTimeout(() => setPrevious(null), HOME_V2_HERO_FADE_MS);
    return () => window.clearTimeout(id);
  }, [previous, current]);

  const active = slides[current];
  const lead = toLead(heroTitle);

  return (
    <section
      className="home-v2-hero home-v2-hero--cine relative h-[100svh] min-h-[560px] flex flex-col"
      style={{
        ['--home-v2-hero-fade-ms' as string]: `${HOME_V2_HERO_FADE_MS}ms`,
        ['--reel-hold-ms' as string]: `${HOME_V2_HERO_HOLD_MS}ms`,
      }}
    >
      <div className="home-v2-hero-media absolute inset-0 overflow-hidden">
        <div className="home-v2-hero-slider absolute inset-0">
          {slides.map((slide, i) => {
            const isCurrent = i === current;
            const isPrevious = i === previous;
            if (!isCurrent && !isPrevious) return null;
            return (
              <div
                key={`${slide.src}-${i}`}
                className={[
                  'home-v2-hero-slide',
                  isCurrent ? 'is-current' : 'is-previous',
                  isCurrent && previous === null ? 'is-initial' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Image
                  src={slide.src}
                  alt={isCurrent ? slide.alt : ''}
                  fill
                  className="object-cover"
                  sizes={coverImageSizes(slide.src)}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : undefined}
                  quality={90}
                  unoptimized={shouldSkipOptimization(slide.src)}
                />
              </div>
            );
          })}
          {/* Warm the next frame so the crossfade never shows a half-loaded image */}
          {count > 1 ? (
            <div className="sr-only" aria-hidden>
              <Image
                src={slides[(current + 1) % count].src}
                alt=""
                fill
                sizes={coverImageSizes(slides[(current + 1) % count].src)}
                quality={90}
                loading="lazy"
                unoptimized={shouldSkipOptimization(slides[(current + 1) % count].src)}
              />
            </div>
          ) : null}
        </div>
        <div className="home-v2-hero-scrim absolute inset-0 z-[3] pointer-events-none" aria-hidden />
      </div>

      <div className="reel-foot relative z-10 mt-auto w-full text-white">
        <div className="reel-copy hero-reveal">
          <span className="section-label text-white">{heroLabel}</span>
          <h1 className="reel-statement">
            <span className="reel-statement__lead">
              <DisplayCase>{lead}</DisplayCase>
            </span>{' '}
            <span className="reel-statement__rest">{linkKeywords(heroDescription, lang)}</span>
          </h1>
        </div>

        {count > 1 ? (
          <nav className="reel-index" aria-label={indexLabel}>
            <ol className="reel-index__list">
              {slides.map((slide, i) => {
                const isActive = i === current;
                const name = [slide.title, slide.credit].filter(Boolean).join(' — ');
                return (
                  <li key={`${slide.src}-n-${i}`}>
                    <button
                      type="button"
                      className={`reel-index__num${isActive ? ' is-active' : ''}`}
                      aria-current={isActive ? 'true' : undefined}
                      aria-label={name || t.a11y.slide.replace('{n}', String(i + 1))}
                      onClick={() => goTo(i)}
                    >
                      <span className="reel-index__bar" aria-hidden>
                        {isActive ? (
                          <span
                            key={`fill-${current}`}
                            className={`reel-index__fill${cycled ? '' : ' is-first'}`}
                            onAnimationEnd={() => goTo(current + 1)}
                          />
                        ) : null}
                      </span>
                      <span aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {active.href ? (
              <Link key={`cap-${current}`} href={active.href} className="reel-index__caption">
                <span className="reel-index__title">{active.title}</span>
                {active.credit ? <span className="reel-index__credit">{active.credit}</span> : null}
                <span className="reel-index__arrow" aria-hidden>
                  →
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>
    </section>
  );
}

/** "PRODUCTION AT ITS FINEST" → ends the lead with a full stop so the sentence reads on. */
function toLead(title: string): string {
  const trimmed = title.trim();
  return /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}
