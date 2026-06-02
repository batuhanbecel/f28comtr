'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { EditorialButton } from '@/components/EditorialButton';
import { useLanguage } from '@/context/LanguageContext';
import { shouldSkipOptimization } from '@/lib/blob';
import { HERO_IMAGE_SIZES } from '@/lib/imageSizes';

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

const BLUR = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

export function ParallaxSection({ photographer, index, total, fullscreen }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(index === 0);
  const { t } = useLanguage();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const numLabel = String(index + 1).padStart(2, '0');
  const totalLabel = total ? `/ ${String(total).padStart(2, '0')}` : '';

  return (
    <section
      ref={sectionRef}
      className={`relative ${fullscreen ? 'h-screen' : 'h-[70vh]'} w-full flex items-end overflow-hidden bg-th-bg`}
      style={fullscreen ? { scrollSnapAlign: 'start' } : undefined}
    >
      <Image
        src={photographer.preview}
        alt={photographer.fullName}
        fill
        className="object-cover object-center"
        loading={index <= 1 ? 'eager' : 'lazy'}
        fetchPriority={index === 0 ? 'high' : undefined}
        sizes={HERO_IMAGE_SIZES}
        quality={85}
        placeholder="blur"
        blurDataURL={BLUR}
        unoptimized={shouldSkipOptimization(photographer.preview)}
      />

      {/* Gradient overlay — theme background fade from bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--c-bg)/0.92)] via-[rgb(var(--c-bg)/0.18)] to-transparent" />

      {/* Text block — always bottom-left */}
      <div
        className="relative z-10 w-full px-8 md:px-16 lg:px-20 pb-12 md:pb-16"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.95s var(--ease-morph), transform 0.95s var(--ease-morph)',
        }}
      >
        {/* Meta row: title + counter */}
        <div className="flex items-center gap-5 mb-4">
          <span className="caption-text tracking-[0.38em]">
            {(t.titleMap as Record<string, string>)[photographer.title] ?? photographer.title}
          </span>
          <span className="mono-label">
            {numLabel} {totalLabel}
          </span>
        </div>

        {/* Name */}
        <h2
          className="heading-hero text-th-fg mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.95s var(--ease-morph) 0.12s, transform 0.95s var(--ease-morph) 0.12s',
          }}
        >
          {photographer.fullName}
        </h2>

        {/* CTA */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.95s var(--ease-morph) 0.2s',
          }}
        >
          <EditorialButton href={`/${photographer.id}`} variant="default" className="group">
            <span className="transition-transform duration-hover ease-brand group-hover:translate-x-1">
              {t.common.viewPortfolio}
            </span>
            <svg className="w-4 h-4 transition-transform duration-hover ease-brand group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </EditorialButton>
        </div>
      </div>
    </section>
  );
}
