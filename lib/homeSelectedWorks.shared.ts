/** Stored in Redis (`site:home:selected`) — edited in admin. */
export interface HomeSelectedWorkStored {
  id: string;
  imageSrc: string;
  workTitle: string;
  photographerId: string;
}

export const HOME_SELECTED_WORKS_MAX = 6;
export const HOME_SELECTED_WORKS_REDIS_KEY = 'site:home:selected';
