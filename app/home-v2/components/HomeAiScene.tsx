'use client';

import Image from '@/components/Image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { DisplayCase } from '@/components/DisplayCase';
import { shouldSkipOptimization } from '@/lib/blob';
import { HERO_IMAGE_SIZES } from '@/lib/imageSizes';
import { prefersReducedMotion } from '@/lib/motion';

/** An AI Portfolio image in the scene; `caption` is its tags, may be empty. */
export interface AiSceneImage {
  src: string;
  alt: string;
  caption: string;
}

interface HomeAiSceneProps {
  images: AiSceneImage[];
  label: string;
  title: string;
  body: string;
  cta: string;
  leftWord: string;
  rightWord: string;
}

/** Share of the scroll distance spent opening the frame; the rest steps through images. */
const OPEN_SHARE = 0.3;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Pinned scroll scene: the whole first image, shown small like a framed print
 * between "Made with AI." (above) and "Finished by hand." (below), grows to
 * full screen as you scroll, then steps through the AI Portfolio images picked
 * in Studio. Scroll position drives a single CSS variable (`--open`) — no layout
 * thrash, native scrolling untouched. Reduced motion: frame starts open and
 * images crossfade on scroll.
 */
export function HomeAiScene({ images, label, title, body, cta, leftWord, rightWord }: HomeAiSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage || images.length === 0) return;
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
      const next = Math.min(images.length - 1, Math.floor(stepProgress * images.length));
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
  }, [images.length]);

  if (images.length === 0) return null;
  const current = images[active];

  return (
    <section
      ref={sectionRef}
      className="ai-scene"
      style={{ '--steps': images.length } as React.CSSProperties}
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
          {images.map((image, i) => (
            <Image
              key={image.src}
              src={image.src}
              alt={i === active ? image.alt : ''}
              fill
              className={`ai-scene__img object-cover ${i === active ? 'is-active' : ''}`}
              sizes={HERO_IMAGE_SIZES}
              quality={85}
              loading={i === 0 ? 'eager' : 'lazy'}
              unoptimized={shouldSkipOptimization(image.src)}
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
            {current.caption ? (
              <Link href="/ai-powered/portfolio" className="ai-scene__tag hover-line">
                {current.caption}
              </Link>
            ) : null}
            <span className="ai-scene__count" aria-hidden>
              {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
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
