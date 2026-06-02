interface HeroSnapTargetProps {
  children: React.ReactNode;
  className?: string;
}

/** Scroll destination after hero — keeps content below fixed navbar. */
export function HeroSnapTarget({ children, className = '' }: HeroSnapTargetProps) {
  return <div className={`hero-snap-target ${className}`.trim()}>{children}</div>;
}
