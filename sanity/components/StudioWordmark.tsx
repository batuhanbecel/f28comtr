import { F28_LOGO_ANIM_PARTS, F28_LOGO_VIEWBOX } from '@/lib/f28LogoPaths';

/**
 * Navbar logo slotu — f/2.8 markası + sönük "PRODUCTION" alt etiketi.
 * Workspace ikonu için sade mark (`StudioLogo`) ayrı tutulur.
 */
export function StudioWordmark() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        color: 'currentColor',
      }}
      aria-label="f/2.8 Production"
    >
      <svg
        viewBox={F28_LOGO_VIEWBOX}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 'auto', height: 17, display: 'block', fill: 'currentColor' }}
        aria-hidden
      >
        {F28_LOGO_ANIM_PARTS.map((part, i) =>
          part.kind === 'path' ? (
            <path key={i} d={part.d} />
          ) : (
            <polygon key={i} points={part.points} />
          ),
        )}
      </svg>
      <span
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          lineHeight: 1.05,
          fontFamily:
            "'SF Mono', ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em' }}>
          f/2.8
        </span>
        <span
          style={{
            fontSize: 8.5,
            fontWeight: 500,
            letterSpacing: '0.34em',
            opacity: 0.55,
            textTransform: 'uppercase',
          }}
        >
          Production
        </span>
      </span>
    </span>
  );
}
