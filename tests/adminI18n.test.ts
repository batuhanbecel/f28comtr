import { describe, it, expect } from 'vitest';
import { formatAdmin } from '@/lib/adminI18n';

describe('formatAdmin', () => {
  it('replaces named placeholders', () => {
    expect(formatAdmin('{count} works', { count: 5 })).toBe('5 works');
    expect(formatAdmin('Delete {name}?', { name: 'Ozan' })).toBe('Delete Ozan?');
  });
  it('supports multiple placeholders', () => {
    expect(formatAdmin('Uploading {done}/{total}', { done: 2, total: 7 })).toBe('Uploading 2/7');
  });
  it('leaves unknown placeholders untouched', () => {
    expect(formatAdmin('Hi {missing}', {})).toBe('Hi {missing}');
  });
  it('returns the template unchanged when no placeholders', () => {
    expect(formatAdmin('No tokens here', { x: 1 })).toBe('No tokens here');
  });
});
