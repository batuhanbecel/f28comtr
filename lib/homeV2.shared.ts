import type { ArtistRole } from '@/lib/artistRoles';

/** The artist's first role (display order) — work credits stay one word long. */
export type HomeSelectedWorkRole = ArtistRole;

export interface HomeSelectedWork {
  imageSrc: string;
  workTitle: string;
  artistName: string;
  role: HomeSelectedWorkRole;
  href: string;
}

/** Home v2 section copy — sourced from Sanity with translation fallbacks. */
export interface HomeV2Copy {
  heroLabel: string;
  heroTitle: string;
  heroDescription: string;
  servicesMarqueeLabel: string;
  selectedWorksLabel: string;
  selectedWorksHeading: string;
  workTitleFallback: string;
  artistsLabel: string;
  artistsHeading: string;
  viewAllArtists: string;
  aiSplitLabel: string;
  aiSplitTitle: string;
  aiSplitBody: string;
  aiSplitCta: string;
  aiWorksStat: string;
  aiSceneLeft: string;
  aiSceneRight: string;
  artistsIntro: string;
  clientsMarqueeLabel: string;
  clientsHeading: string;
  clientsIntro: string;
}

/** Most images an editor can pick for the home AI scene. */
export const HOME_AI_SCENE_MAX = 6;
/** Images shown in the AI scene when the editor picked none. */
export const HOME_AI_SCENE_DEFAULT_COUNT = 4;

/** One AI Portfolio image in the home AI scene. */
export interface HomeAiSceneImage {
  src: string;
  /** Portfolio tags in the page language. */
  tags: string[];
}

export interface HomeV2HeroSlide {
  src: string;
  alt: string;
  /** Work title shown in the hero index caption. */
  title?: string;
  /** Artist credit shown next to the title. */
  credit?: string;
  /** Where the caption links (the artist's portfolio). */
  href?: string;
}
