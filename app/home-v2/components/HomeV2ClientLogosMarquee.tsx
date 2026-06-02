'use client';

import Image from 'next/image';
import { PageSection } from '@/components/PageSection';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CLIENT_LOGO_SIZES } from '@/lib/imageSizes';

interface HomeV2ClientLogosMarqueeProps {
  label: string;
  logos: string[];
}

function LogoRow({
  items,
  direction,
}: {
  items: string[];
  direction: 'forward' | 'reverse';
}) {
  const loop = [...items, ...items];
  return (
    <div className="home-v2-logos-marquee-row overflow-hidden rounded-sm border border-th-fg/[0.06]">
      <div className={`production-marquee-track production-marquee-track--${direction}`}>
        {loop.map((logo, i) => {
          const name = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') ?? '';
          return (
            <div key={`${logo}-${i}`} className="home-v2-logos-marquee-cell">
              <Image
                src={logo}
                alt={name}
                width={140}
                height={80}
                className="home-v2-logos-marquee-img"
                sizes={CLIENT_LOGO_SIZES}
                loading="lazy"
                draggable={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HomeV2ClientLogosMarquee({ label, logos }: HomeV2ClientLogosMarqueeProps) {
  if (logos.length === 0) return null;

  const mid = Math.ceil(logos.length / 2);
  const rowA = logos.slice(0, mid);
  const rowB = logos.slice(mid);

  return (
    <PageSection border className="py-16 md:py-20">
      <ScrollReveal className="mb-8">
        <span className="section-label section-label--pill">{label}</span>
      </ScrollReveal>
      <div className="home-v2-logos-marquee-contained flex flex-col gap-3" aria-label={label}>
        <LogoRow items={rowA} direction="forward" />
        {rowB.length > 0 ? <LogoRow items={rowB} direction="reverse" /> : null}
      </div>
    </PageSection>
  );
}
