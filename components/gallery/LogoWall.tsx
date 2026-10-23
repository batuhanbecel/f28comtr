import Image from '@/components/Image';
import { CLIENT_LOGO_SIZES } from '@/lib/imageSizes';

/** Logo file → readable brand name ("garanti-bbva.png" → "garanti bbva"). */
const logoName = (src: string) =>
  (src.split('/').pop() ?? '').replace(/\.(png|jpe?g|webp|svg|avif)$/i, '').replace(/[-_]+/g, ' ');

/** Edge-to-edge hairline grid of monochrome logos. */
export function LogoWall({ logos, label }: { logos: string[]; label: string }) {
  if (logos.length === 0) return null;
  return (
    <ul className="logo-wall" aria-label={label}>
      {logos.map((logo) => (
        <li key={logo} className="logo-wall__cell">
          <Image src={logo} alt={logoName(logo)} fill sizes={CLIENT_LOGO_SIZES} loading="lazy" draggable={false} />
        </li>
      ))}
    </ul>
  );
}
