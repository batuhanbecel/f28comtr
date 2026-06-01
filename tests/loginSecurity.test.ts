import { describe, it, expect } from 'vitest';
import { constantTimeEqual } from '@/lib/loginSecurity';

describe('constantTimeEqual', () => {
  it('returns true for identical strings', async () => {
    expect(await constantTimeEqual('hunter2', 'hunter2')).toBe(true);
  });
  it('returns false for different strings', async () => {
    expect(await constantTimeEqual('hunter2', 'hunter3')).toBe(false);
  });
  it('returns false for different lengths', async () => {
    expect(await constantTimeEqual('short', 'a-much-longer-value')).toBe(false);
  });
  it('handles empty strings', async () => {
    expect(await constantTimeEqual('', '')).toBe(true);
    expect(await constantTimeEqual('', 'x')).toBe(false);
  });
});
