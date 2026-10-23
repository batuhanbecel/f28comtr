'use client';

import Image from '@/components/Image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { DisplayCase } from '@/components/DisplayCase';
import { shouldSkipOptimization } from '@/lib/blob';
import { HERO_IMAGE_SIZES } from '@/lib/imageSizes';
import { prefersReducedMotion } from '@/lib/motion';

export interface AiSceneWork {
  slug: string;
  brand: string;
  title: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
}

interface HomeAiSceneProps {
  works: AiSceneWork[];
  label: string;
  title: string;
  body: string;
  cta: string;
  leftWord: string;
  rightWord: string;
}

/** Share of the scroll distance spent opening the frame; the rest steps through works. */
const OPEN_SHARE = 0.3;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Pinned scroll scene: the whole first work, shown small like a framed print
 * between "Made with AI." (above) and "Finished by hand." (below), grows to
 * full screen as you scroll, then steps through featured AI work. Scroll position drives a single CSS variable (`--open`) — no layout
 * thrash, native scrolling untouched. Reduced motion: frame starts open and
 * works crossfade on scroll.
 */
export function HomeAiScene({ works, label, title, body, cta, leftWord, rightWord }: HomeAiSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage || works.length === 0) return;
    const reduced = prefersReducedMotion();
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const progress = distance > 0 ? clamp(-rect.top / distance) : 0;
      const open = reduced ? 1 : easeOut(clamp(progress / OPEN_SHARE));
      stage.style.setProperty('--open', open.toFixed(4));
      // While the stage is pinned, the floating back-to-top button steps aside.
      const pinned = rect.top <= 0 && rect.bottom >= window.innerHeight;
      if (pinned) document.body.dataset.aiScene = 'true';
      else delete document.body.dataset.aiScene;
      const stepProgress = clamp((progress - OPEN_SHARE) / (1 - OPEN_SHARE));
      const next = Math.min(works.length - 1, Math.floor(stepProgress * works.length));
      setActive((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      delete document.body.dataset.aiScene;
    };
  }, [works.length]);

  if (works.length === 0) return null;
  const current = works[active];

  return (
    <section
      ref={sectionRef}
      className="ai-scene"
      style={{ '--steps': works.length } as React.CSSProperties}
      aria-labelledby="ai-scene-title"
    >
      <div ref={stageRef} className="ai-scene__stage">
        <p className="ai-scene__word ai-scene__word--top" aria-hidden>
          {leftWord}
        </p>
        <p className="ai-scene__word ai-scene__word--bottom" aria-hidden>
          {rightWord}
        </p>

        <div className="ai-scene__frame">
          {works.map((work, i) => (
            <Image
              key={work.slug}
              src={work.imageSrc}
              alt={i === active ? work.imageAlt : ''}
              fill
              className={`ai-scene__img object-cover ${i === active ? 'is-active' : ''}`}
              sizes={HERO_IMAGE_SIZES}
              quality={85}
              loading={i === 0 ? 'eager' : 'lazy'}
              unoptimized={shouldSkipOptimization(work.imageSrc)}
            />
          ))}
        </div>

        <div className="ai-scene__caption">
          <div className="ai-scene__intro">
            <span className="section-label text-white">{label}</span>
            <h2 id="ai-scene-title" className="ai-scene__title">
              <DisplayCase>{title}</DisplayCase>
            </h2>
            <p className="ai-scene__body">{body}</p>
          </div>

          <div className="ai-scene__meta">
            <Link href={`/ai-powered/works/${current.slug}`} className="ai-scene__work hover-line">
              <span className="ai-scene__brand">{current.brand}</span>
              {current.title && current.title !== current.brand ? (
                <span className="ai-scene__work-title"> — {current.title}</span>
              ) : null}
            </Link>
            <span className="ai-scene__tag">{current.category}</span>
            <span className="ai-scene__count" aria-hidden>
              {String(active + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
            </span>
            <Link href="/ai-powered" className="ai-scene__cta">
              {cta}
              <span aria-hidden> →</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
