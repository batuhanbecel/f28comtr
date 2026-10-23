'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Rendered element — `li` keeps list semantics inside <ol>/<ul>. */
  as?: 'div' | 'li';
}

export function ScrollReveal({ children, delay, className = '', as: Tag = 'div' }: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLDivElement & HTMLLIElement>();

  return (
    <Tag
      ref={ref}
      data-reveal-delay={delay !== undefined ? String(delay) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
