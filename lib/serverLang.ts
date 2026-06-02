import type { Lang } from '@/lib/translations';
import { getMetadataLang } from '@/lib/seo';

export type { Lang };

export async function getServerLang(): Promise<Lang> {
  return getMetadataLang();
}
