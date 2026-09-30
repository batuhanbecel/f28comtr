import { describe, it, expect } from 'vitest';
import { orderRankAfter, orderRankBefore, orderRankBetween } from '@/sanity/lib/lexorank';

describe('lexorank', () => {
  it('orderRankBefore generates a rank strictly smaller than the given rank', () => {
    const baseRank = orderRankBefore(null); // default middle
    const prevRank = orderRankBefore(baseRank);

    expect(prevRank < baseRank).toBe(true);

    const prevPrevRank = orderRankBefore(prevRank);
    expect(prevPrevRank < prevRank).toBe(true);
  });

  it('orderRankAfter generates a rank strictly larger than the given rank', () => {
    const baseRank = orderRankAfter(null);
    const nextRank = orderRankAfter(baseRank);

    expect(nextRank > baseRank).toBe(true);
  });

  it('orderRankBetween places rank between two items', () => {
    const first = orderRankBefore(null);
    const third = orderRankAfter(first);
    const second = orderRankBetween(first, third);

    expect(second > first).toBe(true);
    expect(second < third).toBe(true);
  });
});
