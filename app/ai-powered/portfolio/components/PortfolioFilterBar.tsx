'use client';

import { useLanguage } from '@/context/LanguageContext';
import { tagLabel, type AiPortfolioTag } from '@/lib/aiPoweredPortfolio.shared';
import type { PortfolioFilterState } from '../hooks/useAiPortfolioFilter';

interface PortfolioFilterBarProps {
  filters: PortfolioFilterState;
  tags: AiPortfolioTag[];
  counts: Record<string, number>;
  onTag: (tagId: string) => void;
  total: number;
}

export function PortfolioFilterBar({
  filters,
  tags,
  counts,
  onTag,
  total,
}: PortfolioFilterBarProps) {
  const { lang, t } = useLanguage();

  const options = [
    { id: 'all', label: t.aiPoweredPortfolio.filters.all },
    ...tags.map((tag) => ({ id: tag.id, label: tagLabel(tag, lang) })),
  ];

  if (tags.length === 0) return null;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-label">{t.aiPoweredPortfolio.filters.category}</span>
        <div className="filter-pills" role="group" aria-label={t.aiPoweredPortfolio.filters.category}>
          {options.map((opt) => {
            const count = counts[opt.id] ?? 0;
            if (opt.id !== 'all' && count === 0) return null;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onTag(opt.id)}
                className={`filter-pill ${filters.tag === opt.id ? 'active' : ''}`}
                aria-pressed={filters.tag === opt.id}
              >
                {opt.label}
                {opt.id !== 'all' && <span className="pill-count">{count}</span>}
              </button>
            );
          })}
        </div>
        <p className="filter-result" aria-live="polite">
          <b>{total}</b>
          <span>{t.aiPoweredPortfolio.filters.resultsSuffix}</span>
        </p>
      </div>
    </div>
  );
}
