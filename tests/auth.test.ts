import { describe, it, expect, beforeAll } from 'vitest';
import { createAdminToken, verifyAdminToken } from '@/lib/auth';

beforeAll(() => {
  process.env.ADMIN_PASSWORD = 'test-secret-password';
});

describe('admin token', () => {
  it('verifies a freshly created token', async () => {
    const token = await createAdminToken();
    expect(await verifyAdminToken(token)).toBe(true);
  });

  it('rejects a tampered token', async () => {
    const token = await createAdminToken();
    const tampered = token.slice(0, -2) + (token.endsWith('a') ? 'bb' : 'aa');
    expect(await verifyAdminToken(tampered)).toBe(false);
  });

  it('rejects garbage input', async () => {
    expect(await verifyAdminToken('not-a-token')).toBe(false);
    expect(await verifyAdminToken('')).toBe(false);
  });

  it('rejects a token signed with a different password', async () => {
    const token = await createAdminToken();
    process.env.ADMIN_PASSWORD = 'a-different-password';
    expect(await verifyAdminToken(token)).toBe(false);
    process.env.ADMIN_PASSWORD = 'test-secret-password';
  });
});
