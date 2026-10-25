/** Stored in Redis (`site:home:selected`) — edited in admin. */
export interface HomeSelectedWorkStored {
  id: string;
  imageSrc: string;
  workTitle: string;
  photographerId: string;
}

export const HOME_SELECTED_WORKS_MAX = 6;
/** Site-wide "Seçili İşler" list (Production document) — home mosaic, strips. */
export const SELECTED_WORKS_MAX = 24;
export const HOME_SELECTED_WORKS_REDIS_KEY = 'site:home:selected';
