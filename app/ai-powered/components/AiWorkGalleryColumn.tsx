'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

import { Lightbox } from '@/components/Lightbox';
import { shouldSkipOptimization } from '@/lib/blob';
import { LIGHTBOX_IMAGE_QUALITY } from '@/lib/imageConfig';
import type { AiPoweredWorkImage } from '@/lib/aiPoweredWorks';
import { ViewTransition } from '@/lib/ViewTransition';

const COLUMN_SIZES =
  '(max-width: 1024px) 100vw, (max-width: 1280px) 62vw, 760px';

interface AiWorkGalleryColumnProps {
  workSlug: string;
  images: AiPoweredWorkImage[];
  imageAlt: string;
}

/**
 * Case-study image column: every project image stacked vertically at its own
 * natural aspect ratio (no cropping), each opening the shared lightbox. The
 * cover carries the view-transition name so it morphs from the grid card.
 */
export function AiWorkGalleryColumn({ workSlug, images, imageAlt }: AiWorkGalleryColumnProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => setLightboxIndex(i), []);
  const close = useCallback(() => setLightboxIndex(null), []);

  const slides = images.map((img, i) => ({
    src: img.src,
    alt: images.length > 1 ? `${imageAlt} (${i + 1}/${images.length})` : imageAlt,
  }));

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {images.map((img, i) => {
        const ratio =
          img.width && img.height ? `${img.width} / ${img.height}` : '3 / 4';
        const node = (
          <Image
            src={img.src}
            alt={i === 0 ? imageAlt : ''}
            fill
            sizes={COLUMN_SIZES}
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
            className="group card-editorial relative block w-full cursor-zoom-in overflow-hidden bg-th-fg/[0.04]"
            style={{ aspectRatio: ratio }}
          >
            {i === 0 ? <ViewTransition name={`ai-work-${workSlug}`}>{node}</ViewTransition> : node}

            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgb(var(--c-bg)/0.72)] opacity-0 transition-opacity duration-ui ease-brand group-hover:opacity-100">
              <svg
                className="h-6 w-6 text-th-fg/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.25}
              >
                <path strokeLinecap="square" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </span>
          </button>
        );
      })}

      <Lightbox
        slides={slides}
        index={lightboxIndex}
        onClose={close}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
