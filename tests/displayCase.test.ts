import { describe, expect, it } from 'vitest';
import { toDisplayCase, toNameCase } from '@/lib/displayCase';

describe('toDisplayCase', () => {
  it('sentence-cases ALL CAPS English headings', () => {
    expect(toDisplayCase('PRODUCTION AT ITS FINEST', 'en')).toBe('Production at its finest');
    expect(toDisplayCase('PRODUCTION\nIS OUR LIFE', 'en')).toBe('Production\nis our life');
  });

  it('uses Turkish casing rules', () => {
    expect(toDisplayCase('PRODÜKSİYONUN EN İYİ HALİ', 'tr')).toBe('Prodüksiyonun en iyi hali');
    expect(toDisplayCase('NASIL ÇALIŞIYORUZ', 'tr')).toBe('Nasıl çalışıyoruz');
    expect(toDisplayCase('İLETİŞİM', 'tr')).toBe('İletişim');
  });

  it('keeps acronyms and proper nouns', () => {
    expect(toDisplayCase('AI-POWERED', 'en')).toBe('AI-Powered');
    expect(toDisplayCase('BASED IN ISTANBUL', 'en')).toBe('Based in Istanbul');
    expect(toDisplayCase('İSTANBUL STÜDYOSU', 'tr')).toBe('İstanbul stüdyosu');
    expect(toDisplayCase('AI-POWERED', 'tr')).toBe('AI-Powered');
    expect(toDisplayCase('AI-POWERED PRODUCTION', 'en')).toBe('AI-Powered production');
    expect(toDisplayCase('ANA SAYFA', 'tr')).toBe('Ana sayfa');
  });

  it('leaves mixed-case text alone', () => {
    expect(toDisplayCase('Traditional production meets AI', 'en')).toBe('Traditional production meets AI');
  });
});

describe('toNameCase', () => {
  it('title-cases Turkish names typed in caps', () => {
    expect(toNameCase('OZAN ÇAKMAK')).toBe('Ozan Çakmak');
    expect(toNameCase('BERKİN METİN')).toBe('Berkin Metin');
    expect(toNameCase('HALDUN KIRKBİR')).toBe('Haldun Kırkbir');
    expect(toNameCase('Yonca Muslubaş')).toBe('Yonca Muslubaş');
  });
});
