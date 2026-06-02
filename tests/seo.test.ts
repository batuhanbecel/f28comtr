import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { getSiteUrl, absoluteUrl } from '@/lib/siteUrl';
import { formatSeoTemplate } from '@/lib/seo';

describe('getSiteUrl', () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = original;
  });

  it('returns default production URL when env unset', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getSiteUrl()).toBe('https://www.f28.com.tr');
  });

  it('strips trailing slash from env URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com/';
    expect(getSiteUrl()).toBe('https://example.com');
  });
});

describe('absoluteUrl', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it('joins path to site base', () => {
    expect(absoluteUrl('/production')).toBe('https://www.f28.com.tr/production');
  });

  it('returns base for root path', () => {
    expect(absoluteUrl('/')).toBe('https://www.f28.com.tr');
  });
});

describe('formatSeoTemplate', () => {
  it('replaces placeholders', () => {
    expect(
      formatSeoTemplate('{name} — {title}', { name: 'Jane', title: 'Photographer' }),
    ).toBe('Jane — Photographer');
  });
});
