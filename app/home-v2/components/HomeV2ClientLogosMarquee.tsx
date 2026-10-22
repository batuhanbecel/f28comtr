'use client';

import Image from 'next/image';
import { PageSection } from '@/components/PageSection';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CLIENT_LOGO_SIZES } from '@/lib/imageSizes';

interface HomeV2ClientLogosMarqueeProps {
  label: string;
  logos: string[];
}

/** Client logos as a calm static wall — no auto-scrolling band. */
export function HomeV2ClientLogosMarquee({ label, logos }: HomeV2ClientLogosMarqueeProps) {
  if (logos.length === 0) return null;

  return (
    <PageSection border className="py-16 md:py-20">
      <div className="max-w-[80rem] mx-auto">
        <ScrollReveal className="mb-10">
          <span className="section-label">{label}</span>
        </ScrollReveal>
        <ul className="client-logo-wall" aria-label={label}>
          {logos.map((logo) => {
            const name = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') ?? '';
            return (
              <li key={logo} className="client-logo-wall__cell">
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
              </li>
            );
          })}
        </ul>
      </div>
    </PageSection>
  );
}
