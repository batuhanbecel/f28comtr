import { describe, expect, it } from 'vitest';

import { isSanityImageUrl, sanityImageLoader } from '@/lib/sanityImageLoader';

const SRC = 'https://cdn.sanity.io/images/gf675s1m/production/abc-11008x6144.jpg';

describe('sanityImageLoader', () => {
  it('detects Sanity CDN URLs only', () => {
    expect(isSanityImageUrl(SRC)).toBe(true);
    expect(isSanityImageUrl('/portfolios/a/b.webp')).toBe(false);
    expect(isSanityImageUrl('https://x.public.blob.vercel-storage.com/a.jpg')).toBe(false);
  });

  it('adds width, quality and format params', () => {
    const url = new URL(sanityImageLoader({ src: SRC, width: 640, quality: 85 }));
    expect(url.origin + url.pathname).toBe(SRC);
    expect(url.searchParams.get('w')).toBe('640');
    expect(url.searchParams.get('q')).toBe('85');
    expect(url.searchParams.get('auto')).toBe('format');
    expect(url.searchParams.get('fit')).toBe('max');
  });

  it('defaults quality to 75 and overrides an existing width', () => {
    const url = new URL(sanityImageLoader({ src: `${SRC}?rect=0,0,100,100&w=9000`, width: 1080 }));
    expect(url.searchParams.get('rect')).toBe('0,0,100,100');
    expect(url.searchParams.get('w')).toBe('1080');
    expect(url.searchParams.get('q')).toBe('75');
  });
});
