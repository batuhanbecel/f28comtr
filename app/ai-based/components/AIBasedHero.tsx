"use client"

import { PageHeader } from '@/components/PageHeader';
import { useLanguage } from '@/context/LanguageContext';

interface AIBasedHeroProps {
  statsSlot?: React.ReactNode;
}

export function AIBasedHero({ statsSlot }: AIBasedHeroProps) {
  const { t } = useLanguage();
  const steps = t.aiBased.process.steps;

  return (
    <>
      <section className="hero-screen min-h-screen flex flex-col items-center justify-center section-padding text-center relative overflow-hidden pb-16">
        <PageHeader
          label={t.aiBased.sectionLabel}
          title={t.aiBased.heading}
          description={t.aiBased.description}
          variant="hero"
          preline
        >
          {statsSlot ? <div className="mt-4 w-full">{statsSlot}</div> : null}
        </PageHeader>
      </section>

      <section className="page-section page-section--border max-w-7xl mx-auto w-full" aria-label={t.aiBased.process.sectionLabel}>
        <div className="page-heading-stack gap-3 mb-10">
          <span className="section-label">{t.aiBased.process.sectionLabel}</span>
          <h2 className="heading-section">{t.aiBased.process.heading}</h2>
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
