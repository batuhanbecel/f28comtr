'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { shouldSkipOptimization } from '@/lib/blob';
import { LANDING_PANEL_SIZES } from '@/lib/imageSizes';

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
  isPrimary?: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function Panel({
  href, imageSrc, imageAlt, label, heading, enterLabel,
  isDimmed, visible, enterDelay, isPrimary = false, onEnter, onLeave,
}: PanelProps) {
  return (
    <Link
      href={href}
      className="group relative flex-1 min-h-0 overflow-hidden block"
      aria-label={`${heading} — ${enterLabel}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={`object-cover transition-transform duration-[var(--duration-reveal-ms)] ease-snappy ${isDimmed ? 'scale-100' : 'group-hover:scale-[1.04]'}`}
          loading={isPrimary ? 'eager' : 'lazy'}
          fetchPriority={isPrimary ? 'high' : undefined}
          quality={85}
          sizes={LANDING_PANEL_SIZES}
          unoptimized={shouldSkipOptimization(imageSrc)}
        />
      </div>

      {/* Dim overlay — theme-aware */}
      <div
        className="absolute inset-0 transition-opacity duration-hover ease-brand"
        style={{ background: isDimmed ? 'rgb(var(--c-bg) / 0.68)' : 'rgb(var(--c-bg) / 0.22)' }}
      />
      {/* Bottom gradient — theme-aware */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--c-bg)/0.92)] via-[rgb(var(--c-bg)/0.18)] to-transparent" />

      {/* Bottom text */}
      <div
        className="absolute bottom-0 left-0 right-0 px-7 sm:px-10 md:px-12 lg:px-14 pb-10 md:pb-14 z-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(32px)',
          transition: `opacity var(--duration-reveal) var(--ease-brand) ${enterDelay}, transform var(--duration-reveal) var(--ease-brand) ${enterDelay}`,
        }}
      >
        {/* Thin rule */}
        <div
          className="h-px mb-5 origin-left transition-all duration-hover ease-brand"
          style={{
            width: isDimmed ? '10px' : '32px',
            background: isDimmed ? 'rgb(var(--c-fg) / 0.08)' : 'rgb(var(--c-fg) / 0.35)',
          }}
        />

        {/* Label */}
        <p
          className="text-[9px] tracking-[0.6em] uppercase font-mono mb-3 transition-opacity duration-hover ease-brand"
          style={{ color: isDimmed ? 'rgb(var(--c-fg) / 0.12)' : 'rgb(var(--c-fg) / 0.5)' }}
        >
          {label}
        </p>

        {/* Section heading */}
        <h2
          className="heading-hero transition-colors duration-hover ease-brand"
          style={{ color: isDimmed ? 'rgb(var(--c-fg) / 0.15)' : 'rgb(var(--c-fg))' }}
        >
          {heading}
        </h2>

        {/* Enter CTA */}
        <div
          className={`flex items-center gap-3 mt-7 transition-all duration-hover ease-brand ${isDimmed ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}
        >
          <span className="btn-editorial !text-[9px] !py-2.5 !px-4 !gap-2.5">
            <span className="w-4 h-px bg-th-fg/55" />
            <span>{enterLabel}</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

interface LandingPanelsProps {
  initialImages?: string[];
}

export function LandingPanels({ initialImages = [] }: LandingPanelsProps) {
  const [hovered, setHovered] = useState<'production' | 'ai' | null>(null);
  const [visible, setVisible] = useState(false);
  const [landingImages, setLandingImages] = useState<string[]>(initialImages);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (initialImages.length >= 2) return;
    const fetchLandingImages = async () => {
      try {
        const res = await fetch('/api/admin/landing-images');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.images) && data.images.length > 0) {
            setLandingImages(data.images);
          }
        }
      } catch {}
    };
    fetchLandingImages();
  }, [initialImages.length]);

  const productionImage = landingImages[0] || '/landing-1.webp';
  const aiImage = landingImages[1] || '/landing-2.webp';

  return (
    <main className="fixed inset-0 overflow-hidden" aria-label="f/2.8 Production Agency">
      {/* Panels */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
      <Panel
        href="/production"
        imageSrc={productionImage}
        imageAlt="Production"
        label={t.landing.productionLabel}
        heading={t.nav.production}
        enterLabel={t.common.enter}
        isDimmed={hovered === 'ai'}
        visible={visible}
        enterDelay="0.1s"
        isPrimary
        onEnter={() => setHovered('production')}
        onLeave={() => setHovered(null)}
      />

      {/* Divider */}
      <div className="w-full md:w-px h-px md:h-full flex-shrink-0 z-10 pointer-events-none bg-th-fg/[0.12]" />

      <Panel
        href="/ai-based"
        imageSrc={aiImage}
        imageAlt="AI Based"
        label={t.landing.aiLabel}
        heading={t.nav.aiBased}
        enterLabel={t.common.enter}
        isDimmed={hovered === 'production'}
        visible={visible}
        enterDelay="0.25s"
        onEnter={() => setHovered('ai')}
        onLeave={() => setHovered(null)}
      />
      </div>

    </main>
  );
}
