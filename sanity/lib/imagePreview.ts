import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

import { dataset, projectId } from '../env';

export function imagePreviewUrl(
  source: SanityImageSource | undefined,
  width = 480,
  height = 360,
): string | null {
  if (!source) return null;
  try {
    const builder = imageUrlBuilder({ projectId, dataset });
    return builder.image(source).width(width).height(height).fit('crop').url();
  } catch {
    return null;
  }
}
