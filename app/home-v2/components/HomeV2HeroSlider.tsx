'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_IMAGE_SIZES } from '@/lib/imageSizes';
import {
  HOME_V2_HERO_FADE_MS,
  HOME_V2_HERO_INTERVAL_MS,
  HOME_V2_HERO_SLIDES,
} from '@/lib/homeV2HeroSlides';

export function HomeV2HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = HOME_V2_HERO_SLIDES.length;
  const currentRef = useRef(current);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const transitionTo = useCallback(
    (next: number) => {
      const normalized = ((next % count) + count) % count;
      if (normalized === currentRef.current) return;
      setPrevious(currentRef.current);
      setCurrent(normalized);
    },
    [count],
  );

  useEffect(() => {
    HOME_V2_HERO_SLIDES.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.src;
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (previous === null) return;
    const id = window.setTimeout(() => setPrevious(null), HOME_V2_HERO_FADE_MS);
    return () => window.clearTimeout(id);
  }, [previous, current]);

  useEffect(() => {
    if (reduceMotion || count < 2) return;
    const id = window.setInterval(() => {
      transitionTo(currentRef.current + 1);
    }, HOME_V2_HERO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, count, transitionTo]);

  return (
    <div
      className="home-v2-hero-slider absolute inset-0"
      style={{
        ['--home-v2-hero-fade-ms' as string]: `${HOME_V2_HERO_FADE_MS}ms`,
        ['--home-v2-hero-interval-ms' as string]: `${HOME_V2_HERO_INTERVAL_MS}ms`,
      }}
      aria-hidden
    >
      {HOME_V2_HERO_SLIDES.map((slide, i) => {
        const isCurrent = i === current;
        const isPrevious = i === previous;
        const isVisible = isCurrent || isPrevious;

        if (!isVisible) return null;

        const isInitial = isCurrent && previous === null;

        return (
          <div
            key={slide.src}
            className={[
              'home-v2-hero-slide',
              isCurrent ? 'is-current' : '',
              isInitial ? 'is-initial' : '',
              isPrevious ? 'is-previous' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="home-v2-hero-slide-zoom">
              <Image
                src={slide.src}
                alt=""
                fill
                className="home-v2-hero-slide-image object-cover"
                sizes={HERO_IMAGE_SIZES}
                priority
                quality={90}
              />
            </div>
          </div>
        );
      })}

      {!reduceMotion && count > 1 ? (
        <div className="home-v2-hero-slider-dots pointer-events-auto">
          {HOME_V2_HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              className={`home-v2-hero-slider-dot${i === current ? ' is-active' : ''}`}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => transitionTo(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
