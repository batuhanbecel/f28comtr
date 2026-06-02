'use client';

import { PageSection } from '@/components/PageSection';
import { HeroSnapTarget } from '@/components/HeroSnapTarget';
import { ScrollReveal } from '@/components/ScrollReveal';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';

interface ProductionSectionsProps {
  copy: ProductionPageCopy;
}

export function ProductionSections({ copy }: ProductionSectionsProps) {
  const { services, process, deliverables } = copy;
  const serviceItems = services.items ?? [];
  const processSteps = process.steps ?? [];
  const deliverableItems = deliverables.items ?? [];
  const visibleDeliverables = deliverableItems.filter(Boolean);
  const processStripClass =
    processSteps.length === 5 ? 'process-strip process-strip--five' : 'process-strip';

  return (
    <>
      {serviceItems.length > 0 ? (
        <HeroSnapTarget className="hero-snap-target--pad">
        <PageSection className="pt-6 md:pt-8 pb-16 md:pb-20">
          <ScrollReveal className="page-heading-stack mb-10 md:mb-14">
            <span className="section-label">{services.sectionLabel}</span>
            <h2 className="heading-section">{services.heading}</h2>
          </ScrollReveal>

          <div className="editorial-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {serviceItems.map((item, i) => (
              <ScrollReveal key={`${item.title}-${i}`} delay={0.08 + i * 0.05}>
                <article className="editorial-panel h-full p-8 md:p-10 flex flex-col gap-4">
                  <span className="mono-label">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base md:text-lg font-medium tracking-tight text-th-fg/90">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-body">{item.description}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </PageSection>
        </HeroSnapTarget>
      ) : null}

      {processSteps.length > 0 ? (
        <PageSection border className="py-16 md:py-20">
          <ScrollReveal className="page-heading-stack mb-10">
            <span className="section-label">{process.sectionLabel}</span>
            <h2 className="heading-section">{process.heading}</h2>
          </ScrollReveal>

          <ol className={processStripClass}>
            {processSteps.map((step, i) => (
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
        </PageSection>
      ) : null}

      {visibleDeliverables.length > 0 ? (
        <PageSection className="py-16 md:py-20">
          <ScrollReveal className="page-heading-stack mb-10">
            <span className="section-label">{deliverables.sectionLabel}</span>
            <h2 className="heading-section">{deliverables.heading}</h2>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-wrap gap-3 max-w-4xl">
              {visibleDeliverables.map((item, i) => (
                <span key={`${item}-${i}`} className="editorial-chip">
                  <span className="mono-label">{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </PageSection>
      ) : null}
    </>
  );
}
