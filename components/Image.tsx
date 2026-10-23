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
    return <NextImage loader={sanityImageLoader} {...props} />;
  }
  return <NextImage {...props} />;
}
