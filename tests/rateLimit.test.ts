import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

describe('rateLimit', () => {
  it('allows requests within the limit', () => {
    const ip = '192.168.1.100';
    const res1 = checkRateLimit(ip, { windowMs: 1000, max: 3 });
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(ip, { windowMs: 1000, max: 3 });
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(ip, { windowMs: 1000, max: 3 });
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('blocks requests exceeding the limit', () => {
    const ip = '192.168.1.101';
    checkRateLimit(ip, { windowMs: 1000, max: 2 });
    checkRateLimit(ip, { windowMs: 1000, max: 2 });

    const blocked = checkRateLimit(ip, { windowMs: 1000, max: 2 });
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('resets limit after window expiry', async () => {
    const ip = '192.168.1.102';
    checkRateLimit(ip, { windowMs: 20, max: 1 });

    const blocked = checkRateLimit(ip, { windowMs: 20, max: 1 });
    expect(blocked.success).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 30));

    const afterExpiry = checkRateLimit(ip, { windowMs: 20, max: 1 });
    expect(afterExpiry.success).toBe(true);
  });
});

describe('getClientIp', () => {
  it('extracts IP from x-forwarded-for first entry', () => {
    const req = new Request('https://f28.com.tr', {
      headers: { 'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178' },
    });
    expect(getClientIp(req)).toBe('203.0.113.195');
  });

  it('extracts IP from x-real-ip when x-forwarded-for is missing', () => {
    const req = new Request('https://f28.com.tr', {
      headers: { 'x-real-ip': '198.51.100.4' },
    });
    expect(getClientIp(req)).toBe('198.51.100.4');
  });

  it('falls back to 127.0.0.1 when no headers present', () => {
    const req = new Request('https://f28.com.tr');
    expect(getClientIp(req)).toBe('127.0.0.1');
  });
});
