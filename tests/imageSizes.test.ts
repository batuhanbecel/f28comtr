import { describe, expect, it } from 'vitest';
import { coverImageSizesSplit, sanityImageDimensions } from '@/lib/imageSizes';

const PANORAMA = 'https://cdn.sanity.io/images/p/production/abc-12672x6150.jpg';

describe('sanityImageDimensions', () => {
  it('reads the size from a Sanity URL', () => {
    expect(sanityImageDimensions(PANORAMA)).toEqual({ w: 12672, h: 6150 });
    expect(sanityImageDimensions(`${PANORAMA}?w=640`)).toEqual({ w: 12672, h: 6150 });
  });

  it('returns nothing for other URLs', () => {
    expect(sanityImageDimensions('/portfolios/previews/ozan-cakmak.webp')).toBeUndefined();
  });
});

describe('coverImageSizesSplit', () => {
  it('uses the phone frame height below 768px', () => {
    expect(coverImageSizesSplit(PANORAMA, 80)).toBe(
      '(max-width: 767px) and (max-aspect-ratio: 165/100) 165vh, (max-width: 767px) 100vw, ' +
        '(max-aspect-ratio: 207/100) 207vh, 100vw',
    );
  });

  it('falls back to 100vw for non-Sanity images', () => {
    expect(coverImageSizesSplit('/hero.jpg', 80)).toBe('100vw');
  });
});
