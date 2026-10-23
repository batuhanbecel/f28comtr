'use client';

import { BlockHead } from '@/components/gallery/BlockHead';
import { LogoWall } from '@/components/gallery/LogoWall';

interface HomeV2ClientLogosMarqueeProps {
  label: string;
  title: string;
  intro?: string;
  logos: string[];
}

/** Clients: shared block head + edge-to-edge hairline logo wall. */
export function HomeV2ClientLogosMarquee({ label, title, intro, logos }: HomeV2ClientLogosMarqueeProps) {
  if (logos.length === 0) return null;
  return (
    <section className="g-section g-section--flush" aria-labelledby="clients-title">
      <BlockHead id="clients-title" label={label} title={title} intro={intro} />
      <LogoWall logos={logos} label={title} />
    </section>
  );
}
