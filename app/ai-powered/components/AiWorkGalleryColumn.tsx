'use client';

import Image from '@/components/Image';
import { useCallback, useState } from 'react';

import { Lightbox } from '@/components/Lightbox';
import { shouldSkipOptimization } from '@/lib/blob';
import { LIGHTBOX_IMAGE_QUALITY } from '@/lib/imageConfig';
import type { AiPoweredWorkImage } from '@/lib/aiPoweredWorks';
import { ViewTransition } from '@/lib/ViewTransition';

/** Wider than this (width / height) runs edge to edge; anything narrower sits in the column. */
const WIDE_ASPECT = 1.6;

/** Full-bleed panoramas. */
const WIDE_SIZES = '100vw';
/** The column: `.case-gallery__col` gutters (1.5rem / 3rem) up to 1152px. */
const COLUMN_SIZES =
  '(max-width: 767px) calc(100vw - 3rem), (max-width: 1247px) calc(100vw - 6rem), 1152px';
/** Half the column for side-by-side pairs (stacked on phones). */
const PAIR_SIZES =
  '(max-width: 767px) calc(100vw - 3rem), (max-width: 1247px) calc(50vw - 3rem), 576px';

type Group = { kind: 'wide'; items: number[] } | { kind: 'col'; items: number[] };

/** At most this aspect pairs up — two portraits/squares read as a spread; a
 *  landscape next to a portrait would leave one image half the other's height. */
const PAIR_MAX_ASPECT = 1.05;

/** Panoramas alone at full width; landscapes alone in the column; portraits and squares in pairs. */
function groupImages(images: AiPoweredWorkImage[]): Group[] {
  const groups: Group[] = [];
  let pending: number[] = [];
  const flush = () => {
    if (pending.length) groups.push({ kind: 'col', items: pending });
    pending = [];
  };
  images.forEach((img, i) => {
    const aspect = img.width && img.height ? img.width / img.height : 0;
    if (aspect >= WIDE_ASPECT) {
      flush();
      groups.push({ kind: 'wide', items: [i] });
      return;
    }
    if (aspect > PAIR_MAX_ASPECT) {
      flush();
      groups.push({ kind: 'col', items: [i] });
      return;
    }
    pending.push(i);
    if (pending.length === 2) flush();
  });
  flush();
  return groups;
}

interface AiWorkGalleryColumnProps {
  workSlug: string;
  images: AiPoweredWorkImage[];
  imageAlt: string;
  /** View-transition name prefix — matches the grid card the cover morphs from. */
  transitionPrefix?: string;
}

/**
 * Case-study gallery at each image's natural aspect ratio (no cropping),
 * gapless: wide images run edge to edge, the rest sit in the column — two
 * side by side from 768px. Every image opens the shared lightbox; the cover
 * carries the view-transition name so it morphs from the grid card.
 */
export function AiWorkGalleryColumn({
  workSlug,
  images,
  imageAlt,
  transitionPrefix = 'ai-work',
}: AiWorkGalleryColumnProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => setLightboxIndex(i), []);
  const close = useCallback(() => setLightboxIndex(null), []);

  const slides = images.map((img, i) => ({
    src: img.src,
    alt: images.length > 1 ? `${imageAlt} (${i + 1}/${images.length})` : imageAlt,
  }));

  if (images.length === 0) return null;

  /** `fitScreen`: a lone image in the column never runs taller than the screen. */
  const renderImage = (i: number, sizes: string, fitScreen = false) => {
    const img = images[i];
    const aspect = img.width && img.height ? img.width / img.height : 3 / 4;
    const ratio = img.width && img.height ? `${img.width} / ${img.height}` : '3 / 4';
    const node = (
      <Image
        src={img.src}
        alt={i === 0 ? imageAlt : ''}
        fill
        sizes={sizes}
        quality={LIGHTBOX_IMAGE_QUALITY}
        loading={i === 0 ? 'eager' : 'lazy'}
        fetchPriority={i === 0 ? 'high' : undefined}
        unoptimized={shouldSkipOptimization(img.src)}
        className="object-cover"
      />
    );
    return (
      <button
        key={`${img.src}-${i}`}
        type="button"
        onClick={() => open(i)}
        aria-label={slides[i]?.alt ?? imageAlt}
        className="tile relative block w-full cursor-zoom-in"
        style={
          fitScreen
            ? { aspectRatio: ratio, maxWidth: `calc(88svh * ${aspect.toFixed(4)})`, marginInline: 'auto' }
            : { aspectRatio: ratio }
        }
      >
        {i === 0 ? <ViewTransition name={`${transitionPrefix}-${workSlug}`}>{node}</ViewTransition> : node}
      </button>
    );
  };

  return (
    <div className="case-gallery">
      {groupImages(images).map((group) =>
        group.kind === 'wide' ? (
          renderImage(group.items[0], WIDE_SIZES)
        ) : (
          <div
            key={`col-${group.items[0]}`}
            className={`case-gallery__col ${group.items.length === 2 ? 'case-gallery__pair' : ''}`.trim()}
          >
            {group.items.length === 2
              ? group.items.map((i) => renderImage(i, PAIR_SIZES))
              : renderImage(group.items[0], COLUMN_SIZES, true)}
          </div>
        ),
      )}

      <Lightbox
        slides={slides}
        index={lightboxIndex}
        onClose={close}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
