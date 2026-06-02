"use client"

import { EditorialPageHero } from '@/components/EditorialPageHero';
import { PageSection } from '@/components/PageSection';
import { ScrollReveal } from '@/components/ScrollReveal';
import type { AiPoweredPageCopy } from '@/lib/pageCopy.types';
import type { Lang } from '@/lib/translations';

interface AiPoweredHeroProps {
  lang: Lang;
  copy: AiPoweredPageCopy;
  statsSlot?: React.ReactNode;
}

export function AiPoweredHero({ lang, copy, statsSlot }: AiPoweredHeroProps) {
  const steps = copy.process.steps ?? [];
  const heroCopy = {
    label: copy.sectionLabel,
    title: copy.heading,
    description: copy.description,
  };

  return (
    <>
      <EditorialPageHero page="aiPowered" lang={lang} heroCopy={heroCopy}>
        {statsSlot}
      </EditorialPageHero>

      {steps.length > 0 ? (
        <PageSection border className="py-16 md:py-20" aria-label={copy.process.sectionLabel}>
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
      ) : null}
    </>
  );
}
