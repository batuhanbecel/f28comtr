import type { HomeSelectedWork } from '@/lib/homeV2.shared';
import {
  getHomeSelectedWorks,
  resolveHomeSelectedWorksForDisplay,
  HOME_SELECTED_WORKS_MAX,
} from '@/lib/homeSelectedWorks';

/** Home V2 selected works — configured in admin (`/admin/home-selected-works`). */
export async function getHomeV2SelectedWorks(
  limit = HOME_SELECTED_WORKS_MAX,
  workTitleFallback = 'Editorial campaign',
): Promise<HomeSelectedWork[]> {
  const stored = await getHomeSelectedWorks();
  return resolveHomeSelectedWorksForDisplay(
    stored.slice(0, limit),
    workTitleFallback,
  );
}
