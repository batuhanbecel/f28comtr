import type { Lang } from '@/lib/translations';

/**
 * Words that keep a fixed spelling when an ALL-CAPS heading is converted to
 * sentence case ("AI-POWERED" → "AI-powered", "İSTANBUL" stays a proper noun).
 * Matched on the original upper-case token — lowercasing first would turn
 * Turkish "AI" into "aı" and miss the match.
 */
const FIXED_WORDS: Record<Lang, Record<string, string>> = {
  en: {
    AI: 'AI',
    CGI: 'CGI',
    VFX: 'VFX',
    '3D': '3D',
    ISTANBUL: 'Istanbul',
    İSTANBUL: 'Istanbul',
    TURKEY: 'Turkey',
    'F/2.8': 'f/2.8',
  },
  tr: {
    AI: 'AI',
    YZ: 'YZ',
    CGI: 'CGI',
    VFX: 'VFX',
    '3D': '3D',
    İSTANBUL: 'İstanbul',
    ISTANBUL: 'İstanbul',
    TÜRKİYE: 'Türkiye',
    'F/2.8': 'f/2.8',
  },
};

/** Brand phrases that keep their own capitalisation inside any heading. */
const FIXED_PHRASES: [RegExp, string][] = [[/AI-POWERED/g, 'AI-Powered']];

const HAS_LOWERCASE = /\p{Ll}/u;
const WORD = /[\p{L}\p{N}/.]+/gu;
// First letter of the text and of every sentence (line breaks inside a title don't start one).
const SENTENCE_START = /(^|[.!?]\s+)(\p{Ll})/gu;

/**
 * Sentence-case a heading that was typed in ALL CAPS (common in the CMS).
 * Text that already contains lowercase letters is returned untouched — the
 * editor chose its casing on purpose.
 */
export function toDisplayCase(text: string, lang: Lang): string {
  if (!text || HAS_LOWERCASE.test(text)) return text;
  const locale = lang === 'tr' ? 'tr' : 'en';
  const fixed = FIXED_WORDS[lang];
  const phrased = FIXED_PHRASES.reduce((acc, [re, out]) => acc.replace(re, out), text);
  return phrased
    // Words already re-cased by FIXED_PHRASES (e.g. "Powered") contain lowercase — leave them.
    .replace(WORD, (word) => (HAS_LOWERCASE.test(word) ? word : fixed[word] ?? word.toLocaleLowerCase(locale)))
    .replace(SENTENCE_START, (_, lead: string, ch: string) => lead + ch.toLocaleUpperCase(locale));
}

/**
 * Person names typed in ALL CAPS → "Ozan Çakmak". Names are Turkish, so the
 * Turkish locale is used regardless of UI language ("BERKİN" → "Berkin").
 */
export function toNameCase(name: string): string {
  if (!name || HAS_LOWERCASE.test(name)) return name;
  return name
    .toLocaleLowerCase('tr')
    .replace(/(^|[\s'’-])(\p{Ll})/gu, (_, lead: string, ch: string) => lead + ch.toLocaleUpperCase('tr'));
}
