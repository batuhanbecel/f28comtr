import { describe, it, expect } from 'vitest';
import { parseLang, parseTheme, langFromAcceptLanguage } from '@/lib/prefs';

describe('parseLang', () => {
  it('returns tr only for "tr"', () => {
    expect(parseLang('tr')).toBe('tr');
  });
  it('defaults to en for anything else', () => {
    expect(parseLang('en')).toBe('en');
    expect(parseLang('fr')).toBe('en');
    expect(parseLang(undefined)).toBe('en');
    expect(parseLang(null)).toBe('en');
  });
});

describe('parseTheme', () => {
  it('returns light only for "light"', () => {
    expect(parseTheme('light')).toBe('light');
  });
  it('defaults to dark otherwise', () => {
    expect(parseTheme('dark')).toBe('dark');
    expect(parseTheme('sepia')).toBe('dark');
    expect(parseTheme(undefined)).toBe('dark');
    expect(parseTheme(null)).toBe('dark');
  });
});

describe('langFromAcceptLanguage', () => {
  it('detects Turkish from primary tag', () => {
    expect(langFromAcceptLanguage('tr-TR,tr;q=0.9,en;q=0.8')).toBe('tr');
    expect(langFromAcceptLanguage('tr')).toBe('tr');
  });
  it('falls back to en', () => {
    expect(langFromAcceptLanguage('en-US,en;q=0.9')).toBe('en');
    expect(langFromAcceptLanguage(null)).toBe('en');
    expect(langFromAcceptLanguage('')).toBe('en');
  });
});
