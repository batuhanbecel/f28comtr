'use client';

import { useMemo, useState, useCallback } from 'react';
import type { AiPortfolioItem, AiPortfolioTag } from '@/lib/aiPoweredPortfolio.shared';

export type PortfolioFilterState = {
  tag: string;
};

export function useAiPortfolioFilter(items: AiPortfolioItem[], tags: AiPortfolioTag[]) {
  const [filters, setFilters] = useState<PortfolioFilterState>({ tag: 'all' });

  const filtered = useMemo(() => {
    if (filters.tag === 'all') return items;
    return items.filter((item) => item.tagIds.includes(filters.tag));
  }, [filters.tag, items]);

  const counts = useMemo(() => {
    const byTag: Record<string, number> = { all: items.length };
    for (const tag of tags) {
      byTag[tag.id] = items.filter((item) => item.tagIds.includes(tag.id)).length;
    }
    return byTag;
  }, [items, tags]);

  const setTag = useCallback((tag: string) => {
    setFilters({ tag });
  }, []);

  const reset = useCallback(() => {
    setFilters({ tag: 'all' });
  }, []);

  return { filters, filtered, counts, setTag, reset };
}
