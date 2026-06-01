"use client"

import { useLanguage } from "@/context/LanguageContext"
import type { FilterState } from "../hooks/useAIFilter"
import type { WorkCategory } from "../data/works"

interface BrandOption {
  key: string
  label: string
}

interface FilterBarProps {
  filters: FilterState
  brands: BrandOption[]
  counts: {
    byBrand: Record<string, number>
    byCategory: Record<string, number>
  }
  onBrand: (brand: string) => void
  onCategory: (cat: WorkCategory | "all") => void
  total: number
}

export function FilterBar({
  filters,
  brands,
  counts,
  onBrand,
  onCategory,
  total,
}: FilterBarProps) {
  const { t } = useLanguage()

  const categoryOptions: { key: WorkCategory | "all"; label: string }[] = [
    { key: "all", label: t.aiBased.filters.all },
    { key: "visual", label: t.aiBased.filters.visual },
    { key: "video", label: t.aiBased.filters.video },
    { key: "hybrid", label: t.aiBased.filters.hybrid },
  ]

  const brandOptions = brands.map((b) =>
    b.key === "all" ? { ...b, label: t.aiBased.filters.all } : b
  )

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <span className="filter-label section-label">{t.aiBased.filters.brand}</span>
        <div className="filter-pills">
          {brandOptions.map((b) => {
            const count = counts.byBrand[b.key] ?? 0
            if (b.key !== "all" && count === 0) return null
            return (
              <button
                key={`brand-${b.key}`}
                onClick={() => onBrand(b.key)}
                className={`filter-pill editorial-panel ${filters.brand === b.key ? "active" : ""}`}
                aria-pressed={filters.brand === b.key}
              >
                {b.label}
                {b.key !== "all" && <span className="pill-count">{count}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="filter-row filter-row--secondary">
        <span className="filter-label section-label">{t.aiBased.filters.type}</span>
        <div className="filter-pills">
          {categoryOptions.map((c) => {
            const count = counts.byCategory[c.key] ?? 0
            if (c.key !== "all" && count === 0) return null
            return (
              <button
                key={`cat-${c.key}`}
                onClick={() => onCategory(c.key)}
                className={`filter-pill filter-pill--cat editorial-panel ${
                  filters.category === c.key ? "active" : ""
                }`}
                aria-pressed={filters.category === c.key}
              >
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      <p className="result-count" aria-live="polite">
        <span className="result-num">{total}</span>
        <span className="result-suffix">{t.aiBased.filters.resultsSuffix}</span>
      </p>
    </div>
  )
}
