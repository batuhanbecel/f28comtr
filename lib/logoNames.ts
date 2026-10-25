/**
 * Logo uploads keep their original filenames ("ar_elik-1774301272746-suq5.webp",
 * "po-…") — turn them into a URL slug and a readable brand name for `alt`.
 */

const BRAND_NAMES: Record<string, string> = {
  puma: 'Puma',
  'ar-elik': 'Arçelik',
  arcelik: 'Arçelik',
  fiat: 'Fiat',
  ford: 'Ford',
  garanti: 'Garanti BBVA',
  lassa: 'Lassa',
  nike: 'Nike',
  nissan: 'Nissan',
  opet: 'Opet',
  po: 'Petrol Ofisi',
  qnb: 'QNB Finansbank',
  sahibinden: 'sahibinden.com',
  thy: 'Turkish Airlines',
  total: 'Total',
  trendyol: 'Trendyol',
  turkcell: 'Turkcell',
  vodafone: 'Vodafone',
  yapikredi: 'Yapı Kredi',
  alamet: 'Alamet Holistic',
  bbdo: 'Punch BBDO',
  fcb: 'FCB Artgroup',
  havas: 'Havas',
  rafineri: 'Rafineri',
  tbwa: 'TBWA Istanbul',
  tribal: 'Tribal Worldwide',
  wmlyr: 'VMLY&R',
  zer: 'Zer',
};

/** "0_puma-1774301272222-ijfy.webp" → "puma" */
export function logoSlug(filename: string): string {
  return filename
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/-\d{10,}-[a-z0-9]+$/i, '')
    .replace(/^\d+_/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Logo URL → brand name, read from the vanity slug the URL ends with. */
export function logoName(src: string): string {
  const slug = (src.split('?')[0].split('/').pop() ?? '').replace(/\.[a-z0-9]+$/i, '');
  return BRAND_NAMES[slug] ?? slug.replace(/[-_]+/g, ' ');
}
