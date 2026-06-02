'use client';

import { PageSection } from '@/components/PageSection';
import { ScrollReveal } from '@/components/ScrollReveal';
import { EditorialButton } from '@/components/EditorialButton';

interface HomeV2AiSplitProps {
  label: string;
  title: string;
  body: string;
  cta: string;
  workCount: number;
  worksStatLabel: string;
  brands: string[];
}

export function HomeV2AiSplit({
  label,
  title,
  body,
  cta,
  workCount,
  worksStatLabel,
  brands,
}: HomeV2AiSplitProps) {
  const uniqueBrands = [...new Set(brands.filter(Boolean))].slice(0, 24);

  return (
    <PageSection border className="py-16 md:py-24">
      <div className="home-v2-ai-split grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 xl:gap-24 items-start">
        <ScrollReveal className="home-v2-ai-split-copy min-w-0 lg:pr-4 xl:pr-8">
          <span className="section-label block mb-6">{label}</span>
          <h2 className="heading-section mb-6 max-w-xl">{title}</h2>
          <p className="text-[14px] md:text-[15px] leading-relaxed text-th-fg/55 max-w-lg mb-10">
            {body}
          </p>
          <EditorialButton href="/ai-powered" variant="primary">
            {cta}
          </EditorialButton>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="min-w-0 lg:pl-2">
          <div className="editorial-panel p-8 md:p-12 flex flex-col gap-8 h-full min-h-[280px]">
            <div className="border-b border-th-fg/10 pb-8">
              <span
                className="font-black tracking-tighter text-th-fg block leading-none"
                style={{ fontSize: 'clamp(3rem, 10vw, 5.5rem)' }}
              >
                {workCount}+
              </span>
              <span className="text-[9px] tracking-[0.45em] uppercase font-mono text-th-fg/35 mt-3 block">
                {worksStatLabel}
              </span>
            </div>
            {uniqueBrands.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {uniqueBrands.map((brand) => (
                  <span key={brand} className="editorial-chip text-[10px]">
                    {brand}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </ScrollReveal>
      </div>
    </PageSection>
  );
}
