import Image from '@/components/Image';
import { CLIENT_LOGO_SIZES } from '@/lib/imageSizes';

/** Logo file → readable brand name ("garanti-bbva.png" → "garanti bbva"). */
const logoName = (src: string) =>
  (src.split('/').pop() ?? '').replace(/\.(png|jpe?g|webp|svg|avif)$/i, '').replace(/[-_]+/g, ' ');

/** Columns per breakpoint — keep in sync with `.logo-wall` in globals.css. */
const COLUMNS = { sm: 3, md: 5, lg: 6 } as const;

/** Edge-to-edge hairline grid of monochrome logos. */
export function LogoWall({ logos, label }: { logos: string[]; label: string }) {
  if (logos.length === 0) return null;
  // Empty cells that close the last row so the hairline grid never ends ragged;
  // each one is shown only at the breakpoints where it is needed.
  const missing = Object.fromEntries(
    Object.entries(COLUMNS).map(([bp, cols]) => [bp, (cols - (logos.length % cols)) % cols]),
  ) as Record<keyof typeof COLUMNS, number>;
  const fillers = Math.max(missing.sm, missing.md, missing.lg);
  return (
    <ul className="logo-wall" aria-label={label}>
      {logos.map((logo) => (
        <li key={logo} className="logo-wall__cell">
          <Image src={logo} alt={logoName(logo)} fill sizes={CLIENT_LOGO_SIZES} loading="lazy" draggable={false} />
        </li>
      ))}
      {Array.from({ length: fillers }, (_, i) => (
        <li
          key={`filler-${i}`}
          aria-hidden
          className={`logo-wall__cell logo-wall__filler${i < missing.sm ? ' is-sm' : ''}${i < missing.md ? ' is-md' : ''}${
            i < missing.lg ? ' is-lg' : ''
          }`}
        />
      ))}
    </ul>
  );
}
