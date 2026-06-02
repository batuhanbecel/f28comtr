'use client';

import { F28_LOGO_SHAPES, F28_LOGO_VIEWBOX } from '@/lib/f28LogoPaths';

interface HomeV2HeroLogoProps {
  title: string;
}

/**
 * Hero logo — draw, fill locks, stroke erases & redraws (globals.css, no fade-out).
 */
export function HomeV2HeroLogo({ title }: HomeV2HeroLogoProps) {
  return (
    <h1 className="home-v2-hero-logo-heading w-full m-0">
      <span className="sr-only">{title}</span>
      <div className="home-v2-hero-logo-stage mx-auto w-fit max-w-full">
        <div className="home-v2-hero-logo text-white" aria-hidden>
          <svg
            className="home-v2-hero-logo-svg"
            viewBox={F28_LOGO_VIEWBOX}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="home-v2-hero-logo-fill">
              {F28_LOGO_SHAPES.map((shape, i) =>
                'points' in shape ? (
                  <polygon key={`f-${i}`} points={shape.points} />
                ) : (
                  <path key={`f-${i}`} d={shape.d} />
                ),
              )}
            </g>
            <g className="home-v2-hero-logo-strokes">
              {F28_LOGO_SHAPES.map((shape, i) =>
                'points' in shape ? (
                  <polygon
                    key={`s-${i}`}
                    className="home-v2-hero-logo-stroke"
                    points={shape.points}
                    pathLength={1}
                    style={{ ['--stroke-i' as string]: i }}
                  />
                ) : (
                  <path
                    key={`s-${i}`}
                    className="home-v2-hero-logo-stroke"
                    d={shape.d}
                    pathLength={1}
                    style={{ ['--stroke-i' as string]: i }}
                  />
                ),
              )}
            </g>
          </svg>
        </div>
      </div>
    </h1>
  );
}
