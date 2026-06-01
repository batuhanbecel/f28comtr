"use client"

import { EditorialPageHero } from '@/components/EditorialPageHero';
import { useLanguage } from '@/context/LanguageContext';

interface AIBasedHeroProps {
  statsSlot?: React.ReactNode;
}

export function AIBasedHero({ statsSlot }: AIBasedHeroProps) {
  const { t } = useLanguage();
  const steps = t.aiBased.process.steps;

  return (
    <>
      <EditorialPageHero page="aiBased">{statsSlot}</EditorialPageHero>

      <section className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-12 md:pt-16 pb-16 md:pb-20" aria-label={t.aiBased.process.sectionLabel}>
        <div className="page-heading-stack mb-10">
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
