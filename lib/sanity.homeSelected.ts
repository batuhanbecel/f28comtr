import { sanityFetch } from '@/lib/sanity.fetch';
import type { HomeSelectedWorkStored } from '@/lib/homeSelectedWorks.shared';

const WORKS_PROJECTION = `works[]{
  "id": _key,
  "imageSrc": image.asset->url,
  workTitle,
  "photographerId": photographer->slug.current
}`;

/** Reads featured works; prefers non-empty published list, then legacy singleton. */
const HOME_SELECTED_QUERY = `coalesce(
  *[_id == "homeV2PageCopy"][0]{
    "works": select(count(works) > 0 => works[]{ ${WORKS_PROJECTION} })
  }.works,
  *[_id == "homeSelectedWorks"][0]{ works[]{ ${WORKS_PROJECTION} } }.works
)`;

interface RawEntry {
  id: string | null;
  imageSrc: string | null;
  workTitle: string | null;
  photographerId: string | null;
}

export async function getHomeSelectedWorksFromSanity(): Promise<HomeSelectedWorkStored[]> {
  const result = await sanityFetch<RawEntry[] | null>(HOME_SELECTED_QUERY);
  return (result ?? [])
    .filter(
      (e): e is RawEntry & { id: string; imageSrc: string; photographerId: string } =>
        typeof e?.id === 'string' &&
        typeof e?.imageSrc === 'string' &&
        e.imageSrc.length > 0 &&
        typeof e?.photographerId === 'string' &&
        e.photographerId.length > 0,
    )
    .map((e) => ({
      id: e.id,
      imageSrc: e.imageSrc,
      workTitle: e.workTitle ?? '',
      photographerId: e.photographerId,
    }));
}
