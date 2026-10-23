"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { BalancedMasonryGrid, Frame } from "@masonry-grid/react"
import type { AiPoweredWork } from "@/lib/aiPoweredWorks"
import { WorkCard } from "./WorkCard"

import type { AiPoweredPageCopy } from '@/lib/pageCopy.types'

const GRID_GAP = 2

interface WorkGridProps {
  works: AiPoweredWork[]
  filtersCopy: AiPoweredPageCopy['filters']
}

// Fallback ratio used only until each image's real dimensions are measured.
const FRAME_W = 4
const FRAME_H = 3

export function WorkGrid({ works, filtersCopy }: WorkGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [frameWidth, setFrameWidth] = useState(360)
  const [dims, setDims] = useState<Record<string, { w: number; h: number }>>({})

  const handleMeasure = useCallback((src: string, w: number, h: number) => {
    setDims((prev) => (prev[src] ? prev : { ...prev, [src]: { w, h } }))
  }, [])

  useEffect(() => {
    let ticking = false
    const update = () => {
      const w = containerRef.current?.clientWidth || window.innerWidth
      // Shared gallery columns: 3 from tablet up (work stays large), 2 on phones.
      const cols = w >= 768 ? 3 : 2
      // The grid is `repeat(auto-fill, minmax(frameWidth, 1fr))` with a gap, so the
      // gaps must come out of the width or the last column never fits.
      setFrameWidth(Math.floor((w - GRID_GAP * (cols - 1)) / cols))
      ticking = false
    }
    update()
    const onResize = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    window.addEventListener("resize", onResize, { passive: true })
    return () => window.removeEventListener("resize", onResize)
  }, [])

  if (works.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted-body tracking-wide">{filtersCopy.empty}</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="ai-work-masonry">
      <BalancedMasonryGrid frameWidth={frameWidth} gap={GRID_GAP}>
        {works.map((work, i) => {
          const d = dims[work.imageSrc]
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
