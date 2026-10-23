import Image from '@/components/Image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { shouldSkipOptimization } from '@/lib/blob';
import { GRID_IMAGE_QUALITY } from '@/lib/imageConfig';

interface TileProps {
  href: string;
  src: string;
  alt: string;
  sizes: string;
  title: string;
  meta?: string;
  /** CSS aspect ratio, e.g. "4 / 5". */
  ratio?: string;
  eager?: boolean;
  /** Keep the credit visible instead of revealing it on hover (index pages). */
  showCredit?: boolean;
  /** Optional wrapper around the image (e.g. a ViewTransition). */
  wrapImage?: (image: ReactNode) => ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Edge-to-edge image tile with a credit that appears on hover / focus (always on touch). */
export function Tile({
  href,
  src,
  alt,
  sizes,
  title,
  meta,
  ratio = '4 / 5',
  eager,
  showCredit,
  wrapImage,
  className = '',
  style,
}: TileProps) {
  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      quality={GRID_IMAGE_QUALITY}
      unoptimized={shouldSkipOptimization(src)}
    />
  );
  return (
    <Link
      href={href}
      className={`tile ${showCredit ? 'tile--credit' : ''} ${className}`.trim()}
      style={{ aspectRatio: ratio, ...style }}
    >
      {wrapImage ? wrapImage(image) : image}
      <span className="tile__credit">
        <span className="tile__title">{title}</span>
        {meta ? <span className="tile__meta">{meta}</span> : null}
      </span>
    </Link>
  );
}
