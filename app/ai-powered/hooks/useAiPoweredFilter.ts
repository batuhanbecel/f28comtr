"use client"

import { useState, useMemo, useCallback } from "react"
import type { AiPoweredWork, WorkCategory } from "@/lib/aiPoweredWorks"

export interface FilterState {
  brand: string
  category: WorkCategory | "all"
}

export function useAiPoweredFilter(works: AiPoweredWork[]) {
  const [filters, setFilters] = useState<FilterState>({
    brand: "all",
    category: "all",
  })

  const setBrand = useCallback((brand: string) => {
    setFilters((prev) => ({ ...prev, brand }))
  }, [])

  const setCategory = useCallback((category: WorkCategory | "all") => {
    setFilters((prev) => ({ ...prev, category }))
  }, [])

  const reset = useCallback(() => {
    setFilters({ brand: "all", category: "all" })
  }, [])

  const filtered: AiPoweredWork[] = useMemo(() => {
    return works.filter((work) => {
      const brandMatch =
        filters.brand === "all" || work.brandKey === filters.brand
      const categoryMatch =
        filters.category === "all" || work.category === filters.category
      return brandMatch && categoryMatch
    })
  }, [filters, works])

  const counts = useMemo(() => {
    const byBrand: Record<string, number> = { all: works.length }
    const byCategory: Record<string, number> = { all: works.length }

    works.forEach((w) => {
      byBrand[w.brandKey] = (byBrand[w.brandKey] ?? 0) + 1
      byCategory[w.category] = (byCategory[w.category] ?? 0) + 1
    })

    return { byBrand, byCategory }
  }, [works])

  const brands = useMemo(() => {
    const seen = new Map<string, string>()
    works.forEach((w) => {
      if (!seen.has(w.brandKey)) seen.set(w.brandKey, w.brand)
    })
    return [
      { key: "all", label: "Tümü" },
      ...Array.from(seen.entries())
        .map(([key, label]) => ({ key, label }))
        .sort((a, b) => a.label.localeCompare(b.label, "tr")),
    ]
  }, [works])

  return { filters, filtered, counts, brands, setBrand, setCategory, reset }
}
