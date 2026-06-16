export type WorkCategory = 'fullAi' | 'hybrid';

export interface CreditPerson {
  /** Photographer slug — set when the person has a Sanity photographer doc. */
  slug?: string;
  fullName: string;
}

export interface AiPoweredCredits {
  photographers: CreditPerson[];
  aiArtists: string[];
  retouchers: CreditPerson[];
}

export interface AiPoweredWorkImage {
  src: string;
  width?: number;
  height?: number;
}

export interface AiPoweredWork {
  id: string;
  slug: string;
  brand: string;
  brandKey: string;
  title: string;
  description: string;
  category: WorkCategory;
  /** All project images in display order. */
  images: AiPoweredWorkImage[];
  /** First image — grid cover, OG, filters. */
  imageSrc: string;
  /** Cover dimensions — detail layout. */
  imageWidth?: number;
  imageHeight?: number;
  imageAlt: string;
  year: number;
  tags?: string[];
  instagramUrl?: string;
  agency?: string;
  credits?: AiPoweredCredits;
}

export function deriveBrandKey(brand: string): string {
  return (
    brand
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'other'
  );
}
