'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [hovered, setHovered] = useState<'production' | 'ai' | null>(null);

  return (
    <main className="fixed inset-0 flex flex-col md:flex-row overflow-hidden">

      {/* Production */}
      <Link
        href="/production"
        onMouseEnter={() => setHovered('production')}
        onMouseLeave={() => setHovered(null)}
        className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden"
      >
        <Image
          src="/landing-1.webp"
          alt="Production"
          fill
          className="object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-[1.06]"
          priority
          quality={90}
        />

        {/* Cinematic dark base */}
        <div className={`absolute inset-0 transition-all duration-700 ${
          hovered === 'ai' ? 'bg-black/75' : 'bg-black/45'
        }`} />
        {/* Bottom gradient for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent h-1/3" />
        {/* Hover brightness lift */}
        <div className={`absolute inset-0 transition-opacity duration-700 bg-white/[0.03] ${
          hovered === 'production' ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Text block */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-14">
          {/* Thin rule */}
          <div className={`h-px mb-5 transition-all duration-700 origin-left ${
            hovered === 'production' ? 'w-12 bg-white/50' : 'w-6 bg-white/20'
          }`} />

          <p className={`text-[9px] tracking-[0.55em] uppercase mb-4 transition-all duration-500 ${
            hovered === 'ai' ? 'text-white/15 translate-y-1' :
            hovered === 'production' ? 'text-white/70 translate-y-0' :
            'text-white/40 translate-y-0'
          }`}>
            Photography &amp; Retouching
          </p>

          <h1 className={`heading-hero transition-all duration-500 ${
            hovered === 'ai' ? 'text-white/25' : 'text-white'
          }`}>
            PRODUCTION
          </h1>

          {/* Enter CTA */}
          <div className={`flex items-center gap-3 mt-6 transition-all duration-500 ${
            hovered === 'production' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}>
            <span className="w-8 h-px bg-white/60" />
            <span className="text-white/70 text-[9px] tracking-[0.5em] uppercase">Enter</span>
            <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Divider */}
      <div className="absolute left-0 md:left-1/2 top-1/2 md:top-0 right-0 md:right-auto bottom-auto md:bottom-0 w-full md:w-px h-px md:h-full bg-gradient-to-r md:bg-gradient-to-b from-transparent via-white/25 to-transparent -translate-y-1/2 md:translate-y-0 md:-translate-x-1/2 pointer-events-none z-20" />

      {/* AI Based */}
      <Link
        href="/ai-based"
        onMouseEnter={() => setHovered('ai')}
        onMouseLeave={() => setHovered(null)}
        className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden"
      >
        <Image
          src="/landing-2.jpg"
          alt="AI Based"
          fill
          className="object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-[1.06]"
          priority
          quality={90}
        />

        <div className={`absolute inset-0 transition-all duration-700 ${
          hovered === 'production' ? 'bg-black/75' : 'bg-black/45'
        }`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent h-1/3" />
        <div className={`absolute inset-0 transition-opacity duration-700 bg-white/[0.03] ${
          hovered === 'ai' ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Text block */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-14">
          <div className={`h-px mb-5 transition-all duration-700 origin-left ${
            hovered === 'ai' ? 'w-12 bg-white/50' : 'w-6 bg-white/20'
          }`} />

          <p className={`text-[9px] tracking-[0.55em] uppercase mb-4 transition-all duration-500 ${
            hovered === 'production' ? 'text-white/15 translate-y-1' :
            hovered === 'ai' ? 'text-white/70 translate-y-0' :
            'text-white/40 translate-y-0'
          }`}>
            Artificial Intelligence &amp; Creativity
          </p>

          <h1 className={`heading-hero transition-all duration-500 ${
            hovered === 'production' ? 'text-white/25' : 'text-white'
          }`}>
            AI BASED
          </h1>

          <div className={`flex items-center gap-3 mt-6 transition-all duration-500 ${
            hovered === 'ai' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}>
            <span className="w-8 h-px bg-white/60" />
            <span className="text-white/70 text-[9px] tracking-[0.5em] uppercase">Enter</span>
            <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Bottom strip */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center pointer-events-none">
        <span className="text-white/15 text-[8px] tracking-[0.6em] uppercase">Istanbul — f28.com.tr</span>
      </div>
    </main>
  );
}
