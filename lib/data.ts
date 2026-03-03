export interface Photographer {
  id: string;
  name: string;
  fullName: string;
  title: string;
  folder: string;
  preview: string;
}

export const photographers: Photographer[] = [
  {
    id: 'ozan-cakmak',
    name: 'Ozan',
    fullName: 'OZAN ÇAKMAK',
    title: 'PHOTOGRAPHER',
    folder: 'ozan-cakmak',
    preview: '/portfolios/previews/ozan-cakmak.webp'
  },
  {
    id: 'emre-yunusoglu',
    name: 'Emre',
    fullName: 'EMRE YUNUSOĞLU',
    title: 'PHOTOGRAPHER',
    folder: 'emre-yunusoglu',
    preview: '/portfolios/previews/emre-yunusoglu.webp'
  },
  {
    id: 'berkin-metin',
    name: 'Berkin',
    fullName: 'BERKİN METİN',
    title: 'PHOTOGRAPHER',
    folder: 'berkin-metin',
    preview: '/portfolios/previews/berkin-metin.webp'
  },
  {
    id: 'yonca-muslubas',
    name: 'Yonca',
    fullName: 'YONCA MUSLUBAŞ',
    title: 'PHOTOGRAPHER',
    folder: 'yonca-muslubas',
    preview: '/portfolios/previews/yonca-muslubas.webp'
  },
  {
    id: 'omur-temel',
    name: 'Ömür',
    fullName: 'ÖMÜR TEMEL',
    title: 'PHOTOGRAPHER',
    folder: 'omur-temel',
    preview: '/portfolios/previews/omur-temel.webp'
  },
  {
    id: 'kerem-cakmak',
    name: 'Kerem',
    fullName: 'KEREM ÇAKMAK',
    title: 'RETOUCHER',
    folder: 'kerem-cakmak',
    preview: '/portfolios/previews/kerem-cakmak.webp'
  },
  {
    id: 'dogu-biricik',
    name: 'Doğu',
    fullName: 'DOĞU BİRİCİK',
    title: 'RETOUCHER',
    folder: 'dogu-biricik',
    preview: '/portfolios/previews/dogu-biricik.webp'
  }
];

export const contactInfo = {
  instagram: 'https://www.instagram.com/f28production',
  linkedin: 'https://linkedin.com/company/f-2-8-production/',
  email: 'info@f28.com.tr',
  address: 'Mecidiyeköy, Kuştepe Mahallesi, Yoncalı Sokak, No: 1',
  city: '34387 Şişli/İstanbul'
};
