export interface AiPortfolioTag {
  id: string;
  en: string;
  tr: string;
}

export interface AiPortfolioItem {
  src: string;
  tagIds: string[];
}

export interface AiPortfolioData {
  tags: AiPortfolioTag[];
  items: AiPortfolioItem[];
}

export function deriveTagId(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'tag'
  );
}

export function tagLabel(tag: AiPortfolioTag, lang: 'en' | 'tr'): string {
  return lang === 'tr' ? tag.tr : tag.en;
}

export function isPortfolioItem(v: unknown): v is AiPortfolioItem {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return typeof o.src === 'string' && Array.isArray(o.tagIds);
}

export function isPortfolioTag(v: unknown): v is AiPortfolioTag {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return typeof o.id === 'string' && typeof o.en === 'string' && typeof o.tr === 'string';
}
