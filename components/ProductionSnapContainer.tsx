interface Props {
  children: React.ReactNode;
  /** Kept for call-site compatibility — pages now use plain document scroll. */
  snapMode?: 'mandatory' | 'heroSnap';
}

/**
 * Page shell. Previously a fixed scroll container that hijacked the wheel to
 * jump hero→content; native document scrolling is predictable, works with
 * browser find/anchors/back-forward restoration, and respects user settings.
 */
export function ProductionSnapContainer({ children }: Props) {
  return <main className="hero-snap-container">{children}</main>;
}
