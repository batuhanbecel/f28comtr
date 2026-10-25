'use client';

import { BlockHead } from '@/components/gallery/BlockHead';
import { ScrollReveal } from '@/components/ScrollReveal';
import type { AiPoweredPageCopy } from '@/lib/pageCopy.types';

interface AiPoweredProcessStripProps {
  copy: AiPoweredPageCopy;
}

/** AI workflow — the same numbered hairline list as Production's process. */
export function AiPoweredProcessStrip({ copy }: AiPoweredProcessStripProps) {
  const steps = copy.process.steps ?? [];
  if (steps.length === 0) return null;

  return (
    <section className="g-section" aria-labelledby="ai-process-title">
      <BlockHead id="ai-process-title" label={copy.process.sectionLabel} title={copy.process.heading} />
      <div className="g-inner">
        <ol className="index-list index-list--steps">
          {steps.map((step, i) => (
            <ScrollReveal key={`${step.title}-${i}`} as="li" className="index-list__row" delay={Math.min(i, 6) * 0.04}>
              <span className="index-list__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="index-list__title">{step.title}</h3>
              <p className="index-list__body">{step.sub}</p>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
