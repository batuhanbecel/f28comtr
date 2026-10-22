interface ScrollerArrowProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
  label: string;
  className?: string;
}

/** Square prev/next button for horizontal scrollers (carousels, strips). */
export function ScrollerArrow({ direction, onClick, disabled, label, className = '' }: ScrollerArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`home-v2-artists-arrow shrink-0 disabled:opacity-25 disabled:pointer-events-none ${className}`.trim()}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden>
        {direction === 'prev' ? (
          <path strokeLinecap="square" d="M15 6l-6 6 6 6" />
        ) : (
          <path strokeLinecap="square" d="M9 6l6 6-6 6" />
        )}
      </svg>
    </button>
  );
}
