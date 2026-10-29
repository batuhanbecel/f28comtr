import { describe, expect, it } from 'vitest';
import { formatRoles, normalizeRoles, rolesPhrase } from '@/lib/artistRoles';
import { translations } from '@/lib/translations';

describe('normalizeRoles', () => {
  it('reads the legacy single title as a one-role list', () => {
    expect(normalizeRoles('RETOUCHER')).toEqual(['RETOUCHER']);
    expect(normalizeRoles(['PHOTOGRAPHER', null])).toEqual(['PHOTOGRAPHER']);
  });

  it('keeps display order and drops duplicates and unknown values', () => {
    expect(normalizeRoles(['AI_ARTIST', 'PHOTOGRAPHER', 'AI_ARTIST', 'DIRECTOR'])).toEqual([
      'PHOTOGRAPHER',
      'AI_ARTIST',
    ]);
    expect(normalizeRoles(['ai artist'])).toEqual(['AI_ARTIST']);
  });

  it('falls back to photographer when nothing is usable', () => {
    expect(normalizeRoles(undefined)).toEqual(['PHOTOGRAPHER']);
    expect(normalizeRoles([])).toEqual(['PHOTOGRAPHER']);
  });
});

describe('formatRoles', () => {
  it('joins localized labels', () => {
    expect(formatRoles(['PHOTOGRAPHER', 'AI_ARTIST'], translations.tr.titleMap)).toBe('Fotoğrafçı · AI Sanatçısı');
    expect(formatRoles(['RETOUCHER', 'AI_ARTIST'], translations.en.titleMap)).toBe('Retoucher · AI Artist');
  });
});

describe('rolesPhrase', () => {
  it('reads as words inside a sentence', () => {
    expect(rolesPhrase(['PHOTOGRAPHER'], 'en')).toBe('Photographer');
    expect(rolesPhrase(['PHOTOGRAPHER', 'AI_ARTIST'], 'en')).toBe('Photographer & AI artist');
    expect(rolesPhrase(['PHOTOGRAPHER', 'RETOUCHER', 'AI_ARTIST'], 'tr')).toBe('fotoğrafçı, rötuşçu ve AI sanatçısı');
    expect(rolesPhrase(['AI_ARTIST'], 'en')).toBe('AI artist');
  });
});
