"use client"

import { useState, useCallback } from "react"
import { BalancedMasonryGrid, Frame } from "@masonry-grid/react"
import type { AiPoweredWork } from "@/lib/aiPoweredWorks"
import { WorkCard } from "./WorkCard"
import { GALLERY_COLUMNS_STYLE } from "@/lib/imageSizes"

import type { AiPoweredPageCopy } from '@/lib/pageCopy.types'

const GRID_GAP = 2

interface WorkGridProps {
  works: AiPoweredWork[]
  filtersCopy: AiPoweredPageCopy['filters']
}

// Fallback ratio for a cover whose size Sanity didn't report, until it loads.
const FRAME_W = 4
const FRAME_H = 3

export function WorkGrid({ works, filtersCopy }: WorkGridProps) {
  const [dims, setDims] = useState<Record<string, { w: number; h: number }>>({})

  const handleMeasure = useCallback((src: string, w: number, h: number) => {
    setDims((prev) => (prev[src] ? prev : { ...prev, [src]: { w, h } }))
  }, [])

  if (works.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted-body tracking-wide">{filtersCopy.empty}</p>
      </div>
    )
  }

  return (
    <div className="ai-work-masonry gallery-columns">
      <BalancedMasonryGrid style={GALLERY_COLUMNS_STYLE} gap={GRID_GAP}>
        {works.map((work, i) => {
          // Sanity's dimensions size the frame in the server render — no shift on load
          const d =
            dims[work.imageSrc] ??
            (work.imageWidth && work.imageHeight ? { w: work.imageWidth, h: work.imageHeight } : undefined)
          return (
            <Frame key={work.id} width={d?.w ?? FRAME_W} height={d?.h ?? FRAME_H}>
              <WorkCard
                work={work}
                filtersCopy={filtersCopy}
                priority={i === 0}
                onMeasure={handleMeasure}
              />
            </Frame>
          )
        })}
      </BalancedMasonryGrid>
    </div>
  )
}
