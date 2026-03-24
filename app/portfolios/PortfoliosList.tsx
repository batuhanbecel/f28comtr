'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Photographer } from '@/lib/data';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { shouldSkipOptimization } from '@/lib/blob';

const BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

export function PortfoliosList({ photographers }: { photographers: Photographer[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  const filtered = photographers;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-th-bg text-th-fg">

      {/* Photographer Grid */}
      <section className="pt-32 md:pt-40 px-4 md:px-8 lg:px-12 pb-8">
        {/* Header */}
        <div className="px-4 md:px-8 mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'all 0.9s cubic-bezier(0.76,0,0.24,1) 0.1s',
          }}
        >
          <div className="hero-rule !ml-0" />
          <span className="section-label">{t.portfolios.sectionLabel}</span>
          <h1 className="heading-hero gradient-text mt-2">{t.portfolios.heading}</h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[3px]">
          {filtered.map((p, i) => (
            <Link
              key={p.id}
              href={`/${p.id}`}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative aspect-[3/4] overflow-hidden bg-th-fg/[0.03] block"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.8s cubic-bezier(0.76,0,0.24,1) ${0.15 + i * 0.06}s`,
              }}
            >
              <Image
                src={p.preview}
                alt={p.fullName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={90}
                placeholder="blur"
                blurDataURL={BLUR}
                unoptimized={shouldSkipOptimization(p.preview)}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Index */}
              <div className="absolute top-4 left-4">
                <span className="font-mono text-[10px] tracking-[0.3em] text-th-fg/30 group-hover:text-th-fg/60 transition-colors duration-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                <svg className="w-4 h-4 text-th-fg/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="square" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[8px] tracking-[0.5em] uppercase text-th-fg/40 group-hover:text-th-fg/60 transition-colors duration-300 mb-1.5">
                  {(t.titleMap as Record<string, string>)[p.title] ?? p.title}
                </p>
                <h2 className="text-lg md:text-xl font-black tracking-tight leading-tight text-th-fg/80 group-hover:text-th-fg transition-colors duration-300">
                  {p.fullName}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Divider + Portfolio text link list */}
      <section className="px-8 md:px-16 py-16 border-t border-th-fg/[0.06]">
        <div className="flex items-center justify-between mb-10">
          <span className="text-th-fg/20 text-[10px] tracking-[0.5em] uppercase">Index</span>
          <div className="flex-1 mx-6 h-px bg-th-fg/[0.06]" />
          <span className="text-th-fg/20 text-[10px] tracking-[0.5em] uppercase">{String(filtered.length).padStart(2, '0')}</span>
        </div>
        <ul className="space-y-0">
          {filtered.map((p, i) => (
            <li key={p.id}>
              <Link
                href={`/${p.id}`}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group flex items-center gap-6 py-4 border-b border-th-fg/[0.04] transition-colors duration-300 hover:bg-th-fg/[0.02] -mx-4 px-4"
              >
                <span className={`font-mono text-[10px] tracking-[0.3em] flex-shrink-0 transition-colors duration-300 ${
                  hoveredId === p.id ? 'text-th-fg/50' : 'text-th-fg/15'
                }`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`flex-1 text-sm font-bold tracking-tight transition-all duration-300 ${
                  hoveredId === p.id ? 'text-th-fg translate-x-1' : 'text-th-fg/50'
                }`}>
                  {p.fullName}
                </span>
                <span className={`text-[8px] tracking-[0.4em] uppercase transition-colors duration-300 ${
                  hoveredId === p.id ? 'text-th-fg/40' : 'text-th-fg/15'
                }`}>
                  {(t.titleMap as Record<string, string>)[p.title] ?? p.title}
                </span>
                <svg
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-all duration-500 ${
                    hoveredId === p.id ? 'opacity-60 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                >
                  <path strokeLinecap="square" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </main>
  );
}
