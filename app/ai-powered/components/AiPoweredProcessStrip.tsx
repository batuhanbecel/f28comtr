'use client';

import { PageSection } from '@/components/PageSection';
import { HeroSnapTarget } from '@/components/HeroSnapTarget';
import { ScrollReveal } from '@/components/ScrollReveal';
import type { AiPoweredPageCopy } from '@/lib/pageCopy.types';

interface AiPoweredProcessStripProps {
  copy: AiPoweredPageCopy;
}

export function AiPoweredProcessStrip({ copy }: AiPoweredProcessStripProps) {
  const steps = copy.process.steps ?? [];
  if (steps.length === 0) return null;

  return (
    <HeroSnapTarget className="hero-snap-target--pad">
      <PageSection border className="pt-6 md:pt-8 pb-16 md:py-20" aria-label={copy.process.sectionLabel}>
        <ScrollReveal className="page-heading-stack mb-10">
          <span className="section-label">{copy.process.sectionLabel}</span>
          <h2 className="heading-section">{copy.process.heading}</h2>
        </ScrollReveal>

        <ScrollReveal>
          <ol className="process-strip">
            {steps.map((step, i) => (
              <li key={`${step.title}-${i}`} className="process-step">
                <div className="step-head">
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="step-rule" aria-hidden="true" />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-sub">{step.sub}</p>
              </li>
            ))}
          </ol>
        </ScrollReveal>
      </PageSection>
    </HeroSnapTarget>
  );
}
