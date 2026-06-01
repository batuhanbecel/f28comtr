"use client"

import { useState, useCallback, useDeferredValue } from "react"
import type { Work } from "../data/works"
import { useAIFilter } from "../hooks/useAIFilter"
import { FilterBar } from "./FilterBar"
import { WorkGrid } from "./WorkGrid"
import { Lightbox } from "./Lightbox"

interface AIBasedGalleryProps {
  works: Work[]
}

export function AIBasedGallery({ works }: AIBasedGalleryProps) {
  const { filters, filtered, counts, brands, setBrand, setCategory } = useAIFilter(works)
  const deferredFiltered = useDeferredValue(filtered)
  const isFiltering = deferredFiltered !== filtered
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openAt = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  return (
    <section className="ai-gallery-section">
      <FilterBar
        filters={filters}
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
        <WorkGrid works={deferredFiltered} onOpenAt={openAt} />
      </div>

      <Lightbox
        works={deferredFiltered}
        index={lightboxIndex}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
      />
    </section>
  )
}
