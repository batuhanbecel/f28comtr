export type HomeSelectedWorkRole = 'photographer' | 'retoucher';

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
  clientsMarqueeLabel: string;
}

export interface HomeV2HeroSlide {
  src: string;
  alt: string;
}
