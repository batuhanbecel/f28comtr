'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PageSection } from '@/components/PageSection';
import { ScrollReveal } from '@/components/ScrollReveal';
import { EditorialButton } from '@/components/EditorialButton';
import { DisplayCase } from '@/components/DisplayCase';
import { shouldSkipOptimization } from '@/lib/blob';
import { AI_WORK_CARD_SIZES } from '@/lib/imageSizes';

export interface HomeAiTeaserWork {
  slug: string;
  brand: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
}

interface HomeV2AiSplitProps {
  label: string;
  title: string;
  body: string;
  cta: string;
  works: HomeAiTeaserWork[];
}

/**
 * AI-Powered teaser. The AI side uses a tighter, square grid — production uses
 * wide editorial frames.
 */
export function HomeV2AiSplit({ label, title, body, cta, works }: HomeV2AiSplitProps) {
  return (
    <PageSection border className="py-16 md:py-24">
      <div className="home-v2-ai-split grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-16 items-end max-w-[80rem] mx-auto">
        <ScrollReveal className="min-w-0">
          <span className="section-label mb-6">{label}</span>
          <h2 className="heading-section mb-6 max-w-xl">
            <DisplayCase>{title}</DisplayCase>
          </h2>
          <p className="text-[15px] md:text-base leading-relaxed text-muted-body max-w-md mb-10">{body}</p>
          <EditorialButton href="/ai-powered" variant="primary">
            {cta}
          </EditorialButton>
        </ScrollReveal>

        {works.length > 0 ? (
          <ScrollReveal delay={0.08} className="min-w-0">
            <ul className="ai-teaser-grid">
              {works.map((work) => (
                <li key={work.slug}>
                  <Link href={`/ai-powered/works/${work.slug}`} className="group block">
                    <div className="relative aspect-square overflow-hidden bg-th-fg/[0.04]">
                      <Image
                        src={work.imageSrc}
                        alt={work.imageAlt}
                        fill
                        className="object-cover thumb-hover-scale"
                        sizes={AI_WORK_CARD_SIZES}
                        loading="lazy"
                        unoptimized={shouldSkipOptimization(work.imageSrc)}
                      />
                    </div>
                    <p className="ai-teaser-caption">
                      <span className="text-th-fg">{work.brand}</span>
                      {work.title && work.title !== work.brand ? <span> — {work.title}</span> : null}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        ) : null}
      </div>
    </PageSection>
  );
}
