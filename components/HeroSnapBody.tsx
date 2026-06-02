interface HeroSnapBodyProps {
  children: React.ReactNode;
  className?: string;
}

/** Content below a full-viewport hero — second scroll-snap anchor. */
export function HeroSnapBody({ children, className = '' }: HeroSnapBodyProps) {
  return <div className={`hero-snap-body ${className}`.trim()}>{children}</div>;
}
