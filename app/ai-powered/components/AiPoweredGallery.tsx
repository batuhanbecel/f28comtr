"use client"

import { useDeferredValue } from "react"
import type { AiPoweredWork } from "@/lib/aiPoweredWorks"
import { useAiPoweredFilter } from "../hooks/useAiPoweredFilter"
import { FilterBar } from "./FilterBar"
import { WorkGrid } from "./WorkGrid"

import type { AiPoweredPageCopy } from '@/lib/pageCopy.types'

interface AiPoweredGalleryProps {
  works: AiPoweredWork[]
  copy: Pick<AiPoweredPageCopy, 'filters'>
}

export function AiPoweredGallery({ works, copy }: AiPoweredGalleryProps) {
  const { filters, filtered, counts, brands, setBrand, setCategory } = useAiPoweredFilter(works)
  const deferredFiltered = useDeferredValue(filtered)
  const isFiltering = deferredFiltered !== filtered

  return (
    <section className="ai-gallery-section">
      <FilterBar
        filters={filters}
        filtersCopy={copy.filters}
        brands={brands}
        counts={counts}
        onBrand={setBrand}
        onCategory={setCategory}
        total={filtered.length}
      />
      <div
        className="transition-opacity duration-200"
        style={{ opacity: isFiltering ? 0.65 : 1 }}
      >
        <WorkGrid works={deferredFiltered} filtersCopy={copy.filters} />
      </div>
    </section>
  )
}
