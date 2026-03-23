'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { shouldSkipOptimization } from '@/lib/blob';

interface PanelProps {
  href: string;
  imageSrc: string;
  imageAlt: string;
  label: string;
  heading: string;
  enterLabel: string;
  isDimmed: boolean;
  visible: boolean;
  enterDelay: string;
  onEnter: () => void;
  onLeave: () => void;
}

function Panel({
  href, imageSrc, imageAlt, label, heading, enterLabel,
  isDimmed, visible, enterDelay, onEnter, onLeave,
}: PanelProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
    const tick = () => {
      if (!alive) return;
      mouse.current.cx = lerp(mouse.current.cx, mouse.current.tx, 0.055);
      mouse.current.cy = lerp(mouse.current.cy, mouse.current.ty, 0.055);
      if (imageRef.current) {
        imageRef.current.style.transform =
          `scale(1.1) translate3d(${mouse.current.cx}px,${mouse.current.cy}px,0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      alive = false;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const handleMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouse.current.tx = -((e.clientX - r.left) / r.width - 0.5) * 24;
    mouse.current.ty = -((e.clientY - r.top) / r.height - 0.5) * 16;
  }, []);

  const handleLeave = useCallback(() => {
    mouse.current.tx = 0;
    mouse.current.ty = 0;
    onLeave();
  }, [onLeave]);

  return (
    <Link
      href={href}
      className="relative flex-1 min-h-0 overflow-hidden block"
      onMouseMove={handleMove}
      onMouseEnter={onEnter}
      onMouseLeave={handleLeave}
    >
      {/* Parallax image layer — extends beyond edges to allow translation */}
      <div
        ref={imageRef}
        className="absolute parallax-image"
        style={{ inset: '-8%', transform: 'scale(1.1)' }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          fetchPriority="high"
          quality={85}
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized={shouldSkipOptimization(imageSrc)}
        />
      </div>

      {/* Tint overlay — dims when sibling is hovered */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: isDimmed ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.32)' }}
      />
      {/* Strong bottom gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" />

      {/* Text block */}
      <div
        className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 md:p-12 lg:p-16 overflow-hidden whitespace-nowrap"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: `opacity 1.1s cubic-bezier(0.76,0,0.24,1) ${enterDelay}, transform 1.1s cubic-bezier(0.76,0,0.24,1) ${enterDelay}`,
        }}
      >
        {/* Accent rule */}
        <div
          className="h-px mb-5 origin-left transition-all duration-700"
          style={{ width: isDimmed ? '16px' : '28px', background: isDimmed ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.35)' }}
        />

        {/* Sub-label */}
        <p
          className="text-[9px] tracking-[0.55em] uppercase mb-3 transition-all duration-600"
          style={{ color: isDimmed ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)' }}
        >
          {label}
        </p>

        {/* Main heading */}
        <h2
          className="heading-hero transition-all duration-700 whitespace-nowrap"
          style={{ color: isDimmed ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,1)' }}
        >
          {heading}
        </h2>

        {/* CTA — always on mobile, on all screens (subtle always) */}
        <div
          className="flex items-center gap-3 mt-5 transition-all duration-500"
          style={{ opacity: isDimmed ? 0 : 0.6 }}
        >
          <span className="w-6 h-px bg-white/70" />
          <span className="text-white text-[9px] tracking-[0.5em] uppercase">{enterLabel}</span>
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="square" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export function LandingPanels() {
  const [hovered, setHovered] = useState<'production' | 'ai' | null>(null);
  const [visible, setVisible] = useState(false);
  const [landingImages, setLandingImages] = useState<string[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchLandingImages = async () => {
      try {
        const res = await fetch('/api/admin/landing-images');
        if (res.ok) {
          const data = await res.json();
          setLandingImages(data.images || []);
        }
      } catch {
        console.error('Failed to fetch landing images');
      }
    };
    fetchLandingImages();
  }, []);

  // Fallback to local paths if no images in Redis yet
  const productionImage = landingImages[0] || '/landing-1.webp';
  const aiImage = landingImages[1] || '/landing-2.webp';

  return (
    <main className="fixed inset-0 flex flex-col md:flex-row overflow-hidden">
      <Panel
        href="/production"
        imageSrc={productionImage}
        imageAlt="Production"
        label={t.landing.productionLabel}
        heading={t.nav.production}
        enterLabel={t.common.enter}
        isDimmed={hovered === 'ai'}
        visible={visible}
        enterDelay="0.15s"
        onEnter={() => setHovered('production')}
        onLeave={() => setHovered(null)}
      />

      {/* Thin centre divider */}
      <div className="w-full md:w-px h-px md:h-full flex-shrink-0 z-10 pointer-events-none bg-gradient-to-r md:bg-gradient-to-b from-transparent via-white/12 to-transparent" />

      <Panel
        href="/ai-based"
        imageSrc={aiImage}
        imageAlt="AI Based"
        label={t.landing.aiLabel}
        heading={t.nav.aiBased}
        enterLabel={t.common.enter}
        isDimmed={hovered === 'production'}
        visible={visible}
        enterDelay="0.32s"
        onEnter={() => setHovered('ai')}
        onLeave={() => setHovered(null)}
      />
    </main>
  );
}
