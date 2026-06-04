import { LexoRank } from 'lexorank';

/** orderRank between two neighbors (ascending list). */
export function orderRankBetween(before: string | null, after: string | null): string {
  if (!before && !after) return LexoRank.middle().toString();
  if (!before && after) return LexoRank.parse(after).genPrev().toString();
  if (before && !after) return LexoRank.parse(before).genNext().toString();
  return LexoRank.parse(before!).between(LexoRank.parse(after!)).toString();
}

export function orderRankAfter(last: string | null): string {
  if (!last) return LexoRank.middle().toString();
  return LexoRank.parse(last).genNext().toString();
}
