'use client';

import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { canUseFinePointerParallax } from '@/lib/motion';
import { findScrollParent, subscribeParallaxScroll } from '@/lib/parallaxScrollBus';

interface Options {
  useScrollParent?: boolean;
  scrollEnabled?: boolean;
  scrollIntensity?: { mobile: number; desktop: number };
  mouseIntensity?: { x: number; y: number };
  transformPrefix?: string;
}

export function useDirectParallax(
  sectionRef: RefObject<HTMLElement | null>,
  imageRef: RefObject<HTMLElement | null>,
  {
    useScrollParent = false,
    scrollEnabled = true,
    scrollIntensity = { mobile: 60, desktop: 160 },
    mouseIntensity = { x: 18, y: 10 },
    transformPrefix = '',
  }: Options = {},
) {
  const scrollY = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const finePointer = useRef(true);

  useEffect(() => {
    finePointer.current = canUseFinePointerParallax();
  }, []);

  const applyTransform = useCallback(() => {
    const el = imageRef.current;
    if (!el) return;
    const prefix = transformPrefix ? `${transformPrefix} ` : '';
    el.style.transform =
      `${prefix}translate3d(${mouse.current.x}px,${scrollY.current + mouse.current.y}px,0)`;
  }, [imageRef, transformPrefix]);

  useEffect(() => {
    if (!scrollEnabled) return;
    const section = sectionRef.current;
    if (!section) return;

    const scrollTarget = useScrollParent ? findScrollParent(section) : window;

    return subscribeParallaxScroll(
      scrollTarget,
      section,
      scrollIntensity,
      (offset) => {
        scrollY.current = offset;
        applyTransform();
      },
    );
  }, [sectionRef, useScrollParent, scrollEnabled, scrollIntensity, applyTransform]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!finePointer.current) return;
      const section = sectionRef.current;
      const image = imageRef.current;
      if (!section || !image) return;
      image.classList.remove('parallax-smooth');
      const rect = section.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.current.x = -cx * mouseIntensity.x;
      mouse.current.y = -cy * mouseIntensity.y;
      applyTransform();
    },
    [sectionRef, imageRef, mouseIntensity.x, mouseIntensity.y, applyTransform],
  );

  const onMouseLeave = useCallback(() => {
    if (!finePointer.current) return;
    const image = imageRef.current;
    if (!image) return;
    mouse.current = { x: 0, y: 0 };
    image.classList.add('parallax-smooth');
    applyTransform();
  }, [imageRef, applyTransform]);

  return { onMouseMove, onMouseLeave };
}
