/**
 * Turkish-aware slug: "BERKİN METİN" → "berkin-metin", "İKSV" → "iksv".
 * `toLowerCase()` turns "İ" into "i" + U+0307 (combining dot), which the
 * non-alphanumeric pass would otherwise split into "berki-n", so lowercase
 * with the Turkish locale and strip any remaining diacritics first.
 */
const TR_MAP: Record<string, string> = { ı: 'i', ş: 's', ç: 'c', ğ: 'g', ü: 'u', ö: 'o' };

export function slugifyTr(input: string): string {
  return input
    .toLocaleLowerCase('tr')
    .replace(/[ışçğüö]/g, (ch) => TR_MAP[ch] ?? ch)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
