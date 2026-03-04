'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Photographer } from '@/lib/data';
import { Footer } from '@/components/Footer';

const BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

export function PortfoliosList({ photographers }: { photographers: Photographer[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const active = photographers.find(p => p.id === hoveredId);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Fixed right-panel image (desktop only) */}
      <div className="fixed right-0 top-0 bottom-0 w-[42%] z-0 pointer-events-none hidden lg:block overflow-hidden">
        {photographers.map(p => (
          <div
            key={p.id}
            className={`absolute inset-0 transition-opacity duration-700 ${hoveredId === p.id ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={p.preview}
              alt={p.fullName}
              fill
              className="object-cover object-center"
              sizes="42vw"
              quality={80}
              placeholder="blur"
              blurDataURL={BLUR}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
        <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredId ? 'opacity-0' : 'opacity-100'}`}>
          <div className="absolute inset-0 bg-white/[0.02]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/8 text-[8px] tracking-[0.8em] uppercase">f/2.8</p>
          </div>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      {/* Scrollable left content */}
      <div className="relative z-10 lg:w-[58%] pt-36 pb-24">

        {/* Header */}
        <div className="px-8 md:px-16 mb-16">
          <span className="section-label">Our Work</span>
          <h1 className="heading-hero mt-3">PORTFOLIOS</h1>
          <p className="text-white/30 text-sm tracking-widest mt-4 uppercase">
            {photographers.length} Photographers
          </p>
        </div>

        <div className="mx-8 md:mx-16 h-px bg-white/10 mb-0" />

        <ul>
          {photographers.map((p, i) => (
            <li key={p.id} className="border-b border-white/[0.07]">
              <Link
                href={`/${p.id}`}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group flex items-center gap-6 md:gap-10 px-8 md:px-16 py-8 md:py-10 transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <span className={`font-mono text-[11px] tracking-[0.3em] flex-shrink-0 transition-colors duration-300 ${
                  hoveredId === p.id ? 'text-white/60' : 'text-white/20'
                }`}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                  <p className={`text-[9px] tracking-[0.55em] uppercase mb-2 transition-all duration-300 ${
                    hoveredId === p.id ? 'text-white/60 translate-x-1' : 'text-white/25'
                  }`}>
                    {p.title}
                  </p>
                  <h2 className={`font-black tracking-tighter leading-none transition-all duration-300 ${
                    hoveredId === p.id ? 'text-white translate-x-1' : 'text-white/70'
                  }`}
                    style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)' }}
                  >
                    {p.fullName}
                  </h2>
                </div>

                <div className="relative w-14 h-18 flex-shrink-0 overflow-hidden lg:hidden">
                  <Image
                    src={p.preview}
                    alt={p.fullName}
                    fill
                    className="object-cover"
                    sizes="56px"
                    quality={60}
                    placeholder="blur"
                    blurDataURL={BLUR}
                  />
                </div>

                <svg
                  className={`w-4 h-4 flex-shrink-0 transition-all duration-500 ${
                    hoveredId === p.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                >
                  <path strokeLinecap="square" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Footer />
        </div>
      </div>

      {active && (
        <div className="fixed bottom-6 right-6 z-20 lg:hidden">
          <div className="bg-black/80 backdrop-blur-sm border border-white/10 px-4 py-2">
            <p className="text-white text-xs tracking-widest uppercase">{active.fullName}</p>
          </div>
        </div>
      )}
    </main>
  );
}
