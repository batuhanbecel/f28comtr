import type { ReactNode } from 'react';

interface HeroRevealProps {
  children: ReactNode;
  className?: string;
}

/** Single entrance for hero blocks — label, title, stats move as one unit. */
export function HeroReveal({ children, className = '' }: HeroRevealProps) {
  return <div className={`hero-reveal ${className}`.trim()}>{children}</div>;
}
