'use client';

import NextImage, { type ImageProps } from 'next/image';

import { isSanityImageUrl, sanityImageLoader } from '@/lib/sanityImageLoader';

/**
 * Drop-in next/image that sends Sanity CDN URLs through Sanity's own resizer
 * instead of /_next/image. A Client Component, so Server Components can use it
 * without passing a loader function across the RSC boundary.
 */
export default function Image(props: ImageProps) {
  const { src } = props;
  if (typeof src === 'string' && isSanityImageUrl(src)) {
    // Photography is the product: 85 unless a caller asks otherwise (Next's default is 75)
    return <NextImage loader={sanityImageLoader} quality={85} {...props} />;
  }
  return <NextImage {...props} />;
}
