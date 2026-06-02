export type HomeSelectedWorkRole = 'photographer' | 'retoucher';

export interface HomeSelectedWork {
  imageSrc: string;
  workTitle: string;
  artistName: string;
  role: HomeSelectedWorkRole;
  href: string;
}
