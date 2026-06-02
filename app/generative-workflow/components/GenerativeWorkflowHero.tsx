"use client"

import { EditorialPageHero } from '@/components/EditorialPageHero';
import { useLanguage } from '@/context/LanguageContext';

interface GenerativeWorkflowHeroProps {
  statsSlot?: React.ReactNode;
}

export function GenerativeWorkflowHero({ statsSlot }: GenerativeWorkflowHeroProps) {
  const { t } = useLanguage();
  const steps = t.generativeWorkflow.process.steps;

  return (
    <>
      <EditorialPageHero page="generativeWorkflow">{statsSlot}</EditorialPageHero>

      <section className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-12 md:pt-16 pb-16 md:pb-20" aria-label={t.generativeWorkflow.process.sectionLabel}>
        <div className="page-heading-stack mb-10">
          <span className="section-label">{t.generativeWorkflow.process.sectionLabel}</span>
          <h2 className="heading-section">{t.generativeWorkflow.process.heading}</h2>
        </div>

        <ol className="process-strip">
          {steps.map((step, i) => (
            <li key={step.title} className="process-step">
              <div className="step-head">
                <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="step-rule" aria-hidden="true" />
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-sub">{step.sub}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
