import type { ArtistRole } from '@/lib/artistRoles';

export interface Photographer {
  id: string;
  name: string;
  fullName: string;
  /** Display order (Photographer, Retoucher, AI Artist) — see `lib/artistRoles.ts`. */
  roles: ArtistRole[];
  folder: string;
  preview: string;
}

export const photographers: Photographer[] = [
  {
    id: 'ozan-cakmak',
    name: 'Ozan',
    fullName: 'OZAN ÇAKMAK',
    roles: ['PHOTOGRAPHER'],
    folder: 'ozan-cakmak',
    preview: '/portfolios/previews/ozan-cakmak.webp',
  },
  {
    id: 'emre-yunusoglu',
    name: 'Emre',
    fullName: 'EMRE YUNUSOĞLU',
    roles: ['PHOTOGRAPHER'],
    folder: 'emre-yunusoglu',
    preview: '/portfolios/previews/emre-yunusoglu.webp',
  },
  {
    id: 'berkin-metin',
    name: 'Berkin',
    fullName: 'BERKİN METİN',
    roles: ['PHOTOGRAPHER'],
    folder: 'berkin-metin',
    preview: '/portfolios/previews/berkin-metin.webp',
  },
  {
    id: 'yonca-muslubas',
    name: 'Yonca',
    fullName: 'YONCA MUSLUBAŞ',
    roles: ['PHOTOGRAPHER'],
    folder: 'yonca-muslubas',
    preview: '/portfolios/previews/yonca-muslubas.webp',
  },
  {
    id: 'haldun-kirkbir',
    name: 'Haldun',
    fullName: 'HALDUN KIRKBİR',
    roles: ['PHOTOGRAPHER'],
    folder: 'haldun-kirkbir',
    preview: '/portfolios/previews/haldun-kirkbir.webp',
  },
  {
    id: 'omur-temel',
    name: 'Ömür',
    fullName: 'ÖMÜR TEMEL',
    roles: ['PHOTOGRAPHER'],
    folder: 'omur-temel',
    preview: '/portfolios/previews/omur-temel.webp',
  },
  {
    id: 'kerem-cakmak',
    name: 'Kerem',
    fullName: 'KEREM ÇAKMAK',
    roles: ['RETOUCHER'],
    folder: 'kerem-cakmak',
    preview: '/portfolios/previews/kerem-cakmak.webp',
  },
  {
    id: 'dogu-biricik',
    name: 'Doğu',
    fullName: 'DOĞU BİRİCİK',
    roles: ['RETOUCHER'],
    folder: 'dogu-biricik',
    preview: '/portfolios/previews/dogu-biricik.webp',
  },
  {
    id: 'batuhan-becel',
    name: 'Batuhan',
    fullName: 'BATUHAN BECEL',
    roles: ['RETOUCHER'],
    folder: 'batuhan-becel',
    preview: '/portfolios/previews/batuhan-becel.jpg',
  }
];

export const contactInfo = {
  instagram: 'https://www.instagram.com/f28production',
  linkedin: 'https://linkedin.com/company/f-2-8-production/',
  email: 'info@f28.com.tr',
  address: 'Mecidiyeköy, Kuştepe Mahallesi, Yoncalı Sokak, No: 1',
  city: '34387 Şişli/İstanbul'
};
