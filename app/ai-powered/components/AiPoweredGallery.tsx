"use client"

import { useState, useCallback, useDeferredValue } from "react"
import type { AiPoweredWork } from "@/lib/aiPoweredWorks"
import { useAiPoweredFilter } from "../hooks/useAiPoweredFilter"
import { FilterBar } from "./FilterBar"
import { WorkGrid } from "./WorkGrid"
import { Lightbox } from "./Lightbox"

interface AiPoweredGalleryProps {
  works: AiPoweredWork[]
}

export function AiPoweredGallery({ works }: AiPoweredGalleryProps) {
  const { filters, filtered, counts, brands, setBrand, setCategory } = useAiPoweredFilter(works)
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
