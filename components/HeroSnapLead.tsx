interface HeroSnapLeadProps {
  children: React.ReactNode;
  className?: string;
}

/** First block below hero — scroll target after hero (stats, etc.). */
export function HeroSnapLead({ children, className = '' }: HeroSnapLeadProps) {
  return <div className={`hero-snap-lead ${className}`.trim()}>{children}</div>;
}
