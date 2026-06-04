type SanityImageValue = {
  _type?: string;
  asset?: { _ref?: string; _type?: string };
};

/** First project image for grid cover (supports legacy single `image`). */
export function workCoverImage(work: {
  images?: SanityImageValue[] | null;
  image?: SanityImageValue | null;
}): SanityImageValue | undefined {
  const first = work.images?.[0];
  if (first?.asset?._ref) return first;
  if (work.image?.asset?._ref) return work.image;
  return undefined;
}
