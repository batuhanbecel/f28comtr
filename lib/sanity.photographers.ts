import { sanityFetch } from '@/lib/sanity.fetch';
import type { Photographer } from '@/lib/data';

const PHOTOGRAPHERS_QUERY = `*[_type == "photographer"] | order(orderRank asc, fullName asc) {
  "id": slug.current,
  name,
  fullName,
  title,
  "folder": slug.current,
  "preview": preview.asset->url
}`;

const PHOTOGRAPHER_IMAGES_QUERY = `*[_type == "photographer" && slug.current == $slug][0]{
  "images": portfolioImages[].asset->url
}`;

export async function getPhotographersFromSanity(): Promise<Photographer[]> {
  const result = await sanityFetch<Photographer[] | null>(PHOTOGRAPHERS_QUERY);
  return (result ?? []).filter((p): p is Photographer => Boolean(p?.id && p?.preview));
}

export async function getPhotographerImagesFromSanity(slug: string): Promise<string[]> {
  const result = await sanityFetch<{ images: (string | null)[] | null } | null>(
    PHOTOGRAPHER_IMAGES_QUERY,
    { slug },
  );
  const images = result?.images ?? [];
  return images.filter((u): u is string => typeof u === 'string' && u.length > 0);
}
