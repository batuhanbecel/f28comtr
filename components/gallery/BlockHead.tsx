import type { ReactNode } from 'react';
import { DisplayCase } from '@/components/DisplayCase';
import { ScrollReveal } from '@/components/ScrollReveal';

interface BlockHeadProps {
  label?: string;
  title: string;
  /** Short paragraph on the right (wide screens) / under the title (mobile). */
  intro?: ReactNode;
  /** Links or controls aligned with the intro. */
  actions?: ReactNode;
  id?: string;
  /** h1 for page-level blocks, h2 (default) for sections. */
  as?: 'h1' | 'h2';
}

/** Shared section header: label + title left, intro / actions right. */
export function BlockHead({ label, title, intro, actions, id, as: Heading = 'h2' }: BlockHeadProps) {
  return (
    <ScrollReveal className="g-head">
      <div className="page-heading-stack">
        {label ? <span className="section-label">{label}</span> : null}
        <Heading id={id} className="heading-section">
          <DisplayCase>{title}</DisplayCase>
        </Heading>
      </div>
      {intro || actions ? (
        <div className="g-head__aside">
          {intro ? <p className="g-head__intro">{intro}</p> : null}
          {actions ? <div className="g-head__actions">{actions}</div> : null}
        </div>
      ) : null}
    </ScrollReveal>
  );
}
