export type WorkCategory = 'visual' | 'video' | 'hybrid';

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

export interface AiPoweredWork {
  id: string;
  slug: string;
  brand: string;
  brandKey: string;
  title: string;
  description: string;
  category: WorkCategory;
  imageSrc: string;
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
