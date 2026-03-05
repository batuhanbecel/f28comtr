'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { isBlobProxy } from '@/lib/blob';

interface ParallaxSectionProps {
  photographer: {
    id: string;
    fullName: string;
    title: string;
    preview: string;
  };
  index: number;
  total?: number;
  fullscreen?: boolean;
}

export function ParallaxSection({ photographer, index, total, fullscreen }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const isRight = index % 2 === 1;
  const { t } = useLanguage();

  // Scroll parallax Y (existing)
  const scrollY = useRef(0);
  // Mouse parallax target + current (lerped)
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // In fullscreen snap mode the scroll happens on the container, not window
    let scrollTarget: HTMLElement | Window = window;
    if (fullscreen && sectionRef.current) {
      let el: HTMLElement | null = sectionRef.current.parentElement;
      while (el) {
        const oy = getComputedStyle(el).overflowY;
        if (oy === 'scroll' || oy === 'auto') { scrollTarget = el; break; }
        el = el.parentElement;
      }
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!sectionRef.current) { ticking = false; return; }
          const rect = sectionRef.current.getBoundingClientRect();
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          if (progress >= 0 && progress <= 1) {
            const intensity = window.innerWidth < 768 ? 60 : 160;
            scrollY.current = (progress - 0.5) * intensity;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => scrollTarget.removeEventListener('scroll', handleScroll);
  }, [fullscreen]);

  // Mouse-tracking parallax with lerp loop
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const FACTOR = 0.07;
    let alive = true;

    const tick = () => {
      if (!alive) return;
      mouseCurrent.current.x = lerp(mouseCurrent.current.x, mouseTarget.current.x, FACTOR);
      mouseCurrent.current.y = lerp(mouseCurrent.current.y, mouseTarget.current.y, FACTOR);

      if (imageRef.current) {
        const tx = mouseCurrent.current.x;
        const ty = scrollY.current + mouseCurrent.current.y;
        imageRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => { alive = false; if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 … 0.5
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    mouseTarget.current.x = -cx * 18;  // opposite direction = depth feel
    mouseTarget.current.y = -cy * 10;
  };

  const handleMouseLeave = () => {
    mouseTarget.current = { x: 0, y: 0 };
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTextVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: fullscreen ? 0.15 : 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fullscreen]);

  const numLabel = String(index + 1).padStart(2, '0');
  const totalLabel = total ? String(total).padStart(2, '0') : '';

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${fullscreen ? 'h-screen' : 'h-[66vh]'} w-full flex items-center overflow-hidden`}
      style={fullscreen ? { scrollSnapAlign: 'start', scrollSnapStop: 'always' } : undefined}
    >
      <div ref={imageRef} className="absolute -inset-[8%] parallax-image bg-black">
        <Image
          src={photographer.preview}
          alt={photographer.fullName}
          fill
          className="object-cover object-center"
          priority={index === 0}
          loading="eager"
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          unoptimized={isBlobProxy(photographer.preview)}
        />
      </div>

      {/* Directional overlay — stronger on text side */}
      <div className={`absolute inset-0 ${
        isRight
          ? 'bg-gradient-to-l from-black/80 via-black/50 to-black/20'
          : 'bg-gradient-to-r from-black/80 via-black/50 to-black/20'
      }`} />

      {/* Index number — large faded background numeral */}
      <div className={`absolute bottom-4 md:bottom-6 ${
        isRight ? 'left-6 md:left-12' : 'right-6 md:right-12'
      } select-none pointer-events-none`}>
        <span className="text-white/[0.06] font-black" style={{ fontSize: 'clamp(5rem, 15vw, 12rem)', lineHeight: 1, letterSpacing: '-0.04em' }}>
          {numLabel}
        </span>
      </div>

      {/* Text content — centered on mobile, alternates left/right on desktop */}
      <div
        ref={textRef}
        className={`relative z-10 text-white w-full px-6 md:px-16 lg:px-24 flex justify-center md:block ${
          isRight ? 'md:flex md:justify-end' : ''
        }`}
      >
        <div className={`max-w-2xl text-center md:text-left ${ isRight ? 'md:text-right' : '' }`}>

          {/* Label row: title + counter on same line */}
          <div
            className={`flex items-center justify-center gap-4 mb-5 md:mb-7 md:justify-start ${ isRight ? 'md:justify-end' : '' }`}
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s cubic-bezier(0.76,0,0.24,1) ${fullscreen ? '0s' : '0s'}, transform 0.5s cubic-bezier(0.76,0,0.24,1) ${fullscreen ? '0s' : '0s'}`,

            }}
          >
            <span className="label-text opacity-70">
              {(t.titleMap as Record<string, string>)[photographer.title] ?? photographer.title}
            </span>
            <span className="text-white/15 text-[10px] font-mono tracking-widest">
              {numLabel}{totalLabel && ` / ${totalLabel}`}
            </span>
          </div>

          {/* Photographer name */}
          <h2
            className="heading-hero mb-8 md:mb-10"
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.6s cubic-bezier(0.76,0,0.24,1) ${fullscreen ? '0.07s' : '0.15s'}, transform 0.6s cubic-bezier(0.76,0,0.24,1) ${fullscreen ? '0.07s' : '0.15s'}`,

              paddingTop: '0.1em',
            }}
          >
            {photographer.fullName}
          </h2>

          {/* CTA */}
          <div
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s cubic-bezier(0.76,0,0.24,1) ${fullscreen ? '0.15s' : '0.3s'}, transform 0.5s cubic-bezier(0.76,0,0.24,1) ${fullscreen ? '0.15s' : '0.3s'}`,

            }}
          >
            <Link
              href={`/${photographer.id}`}
              className="group inline-flex items-center gap-3 md:gap-4 label-text px-5 md:px-7 py-3 border border-white/25 hover:border-white/55 transition-all duration-500 hover:bg-white/10"
            >
              {isRight && (
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              )}
              <span className={`transition-transform duration-300 ${ isRight ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1' }`}>
                {t.common.viewPortfolio}
              </span>
              {!isRight && (
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
