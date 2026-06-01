import { describe, it, expect } from 'vitest';
import { deriveBrandKey } from '@/lib/brandKey';

describe('deriveBrandKey', () => {
  it('lowercases and slugifies', () => {
    expect(deriveBrandKey('Puma')).toBe('puma');
    expect(deriveBrandKey('Coca Cola')).toBe('coca-cola');
  });
  it('transliterates Turkish characters', () => {
    expect(deriveBrandKey('Şişecam')).toBe('sisecam');
    expect(deriveBrandKey('Türk Hava Yolları')).toBe('turk-hava-yollari');
    expect(deriveBrandKey('Çağdaş Öğün')).toBe('cagdas-ogun');
  });
  it('trims leading/trailing separators', () => {
    expect(deriveBrandKey('  Brand!  ')).toBe('brand');
    expect(deriveBrandKey('--x--')).toBe('x');
  });
  it('falls back to "other" for empty result', () => {
    expect(deriveBrandKey('')).toBe('other');
    expect(deriveBrandKey('!!!')).toBe('other');
  });
});
