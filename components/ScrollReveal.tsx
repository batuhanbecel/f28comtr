'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function ScrollReveal({ children, delay, className = '' }: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-reveal-delay={delay !== undefined ? String(delay) : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
