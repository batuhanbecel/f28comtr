import { sanityFetch } from '@/lib/sanity.fetch';
import type { HomeSelectedWorkStored } from '@/lib/homeSelectedWorks.shared';

/** Fields projected from each featured-work array item. */
const WORK_FIELDS = `{
  "id": _key,
  "imageSrc": image.asset->url,
  workTitle,
  "photographerId": photographer->slug.current
}`;

/**
 * Reads featured works; prefers the Home page document's list, then the legacy
 * singleton. (The projection used to be nested — `works[]{ works[]{…} }` —
 * which returned empty items, so curated works never reached the site.)
 */
const HOME_SELECTED_QUERY = `coalesce(
  select(count(*[_id == "homeV2PageCopy"][0].works) > 0 => *[_id == "homeV2PageCopy"][0].works[]${WORK_FIELDS}),
  *[_id == "homeSelectedWorks"][0].works[]${WORK_FIELDS}
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

/** Site-wide "Seçili İşler" list on the Production document. */
const SELECTED_WORKS_QUERY = `*[_id == "productionPageCopy"][0].selectedWorks[]${WORK_FIELDS}`;

export async function getSelectedWorksFromSanity(): Promise<HomeSelectedWorkStored[]> {
  const result = await sanityFetch<RawEntry[] | null>(SELECTED_WORKS_QUERY);
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
