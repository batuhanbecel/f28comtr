import { describe, expect, it } from 'vitest';
import { slugifyTr } from '@/sanity/lib/slugify';

describe('slugifyTr', () => {
  it('handles uppercase Turkish İ without splitting words', () => {
    expect(slugifyTr('BERKİN METİN')).toBe('berkin-metin');
    expect(slugifyTr('DOĞU BİRİCİK')).toBe('dogu-biricik');
    expect(slugifyTr('İKSV')).toBe('iksv');
  });

  it('maps the remaining Turkish letters and trims separators', () => {
    expect(slugifyTr('  Şişli Çiçek — Güneş Öğün ')).toBe('sisli-cicek-gunes-ogun');
    expect(slugifyTr('ÖMÜR TEMEL')).toBe('omur-temel');
  });
});
