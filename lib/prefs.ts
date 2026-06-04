import type { Lang } from '@/lib/translations';

export const LANG_COOKIE = 'f28_lang';
export const THEME_COOKIE = 'f28_theme';
export const PREFS_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type Theme = 'dark' | 'light';

export function parseLang(value: string | undefined | null): Lang {
  return value === 'tr' ? 'tr' : 'en';
}

export function parseTheme(value: string | undefined | null): Theme {
  return value === 'light' ? 'light' : 'dark';
}

export function langFromAcceptLanguage(header: string | null): Lang {
  const primary = header?.split(',')[0]?.trim().toLowerCase() ?? '';
  if (primary.startsWith('tr')) return 'tr';
  return 'en';
}

export function persistLangClient(l: Lang) {
  localStorage.setItem(LANG_COOKIE, l);
  document.cookie = `${LANG_COOKIE}=${l};path=/;max-age=${PREFS_COOKIE_MAX_AGE};SameSite=Lax`;
  document.documentElement.lang = l;
}

export function persistThemeClient(t: Theme) {
  localStorage.setItem(THEME_COOKIE, t);
  document.cookie = `${THEME_COOKIE}=${t};path=/;max-age=${PREFS_COOKIE_MAX_AGE};SameSite=Lax`;
  document.documentElement.setAttribute('data-theme', t);
}
