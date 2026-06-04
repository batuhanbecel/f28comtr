import { F28_LOGO_ANIM_PARTS, F28_LOGO_VIEWBOX } from '@/lib/f28LogoPaths';

/** f/2.8 logo — Studio navbar + workspace icon için. */
export function StudioLogo() {
  return (
    <svg
      viewBox={F28_LOGO_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 'auto',
        height: '18px',
        display: 'block',
        fill: 'currentColor',
      }}
      aria-label="f/2.8"
    >
      {F28_LOGO_ANIM_PARTS.map((part, i) =>
        part.kind === 'path' ? (
          <path key={i} d={part.d} />
        ) : (
          <polygon key={i} points={part.points} />
        ),
      )}
    </svg>
  );
}
