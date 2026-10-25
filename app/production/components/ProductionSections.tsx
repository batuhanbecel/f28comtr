'use client';

import { BlockHead } from '@/components/gallery/BlockHead';
import { ScrollReveal } from '@/components/ScrollReveal';
import type { ProductionPageCopy } from '@/lib/pageCopy.types';

interface ProductionSectionsProps {
  copy: ProductionPageCopy;
}

const num = (i: number) => String(i + 1).padStart(2, '0');

/** Services, process and deliverables as numbered hairline lists — no cards. */
export function ProductionSections({ copy }: ProductionSectionsProps) {
  const { services, process, deliverables } = copy;
  const serviceItems = services.items ?? [];
  const processSteps = process.steps ?? [];
  const deliverableItems = (deliverables.items ?? []).filter(Boolean);

  return (
    <>
      {serviceItems.length > 0 ? (
        <section className="g-section" aria-labelledby="services-title">
          <BlockHead id="services-title" label={services.sectionLabel} title={services.heading} />
          <div className="g-inner">
            <ol className="index-list">
              {serviceItems.map((item, i) => (
                <ScrollReveal key={`${item.title}-${i}`} as="li" className="index-list__row" delay={Math.min(i, 6) * 0.04}>
                  <span className="index-list__num">{num(i)}</span>
                  <h3 className="index-list__title">{item.title}</h3>
                  <p className="index-list__body">{item.description}</p>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {processSteps.length > 0 ? (
        <section className="g-section" aria-labelledby="process-title">
          <BlockHead id="process-title" label={process.sectionLabel} title={process.heading} />
          <div className="g-inner">
            <ol className="index-list index-list--steps">
              {processSteps.map((step, i) => (
                <ScrollReveal key={`${step.title}-${i}`} as="li" className="index-list__row" delay={Math.min(i, 6) * 0.04}>
                  <span className="index-list__num">{num(i)}</span>
                  <h3 className="index-list__title">{step.title}</h3>
                  <p className="index-list__body">{step.sub}</p>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {deliverableItems.length > 0 ? (
        <section className="g-section" aria-labelledby="deliverables-title">
          <BlockHead id="deliverables-title" label={deliverables.sectionLabel} title={deliverables.heading} />
          <div className="g-inner">
            <ul className="tag-list">
              {deliverableItems.map((item, i) => (
                <li key={`${item}-${i}`}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
