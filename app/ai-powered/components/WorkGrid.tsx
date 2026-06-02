"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { BalancedMasonryGrid, Frame } from "@masonry-grid/react"
import { useLanguage } from "@/context/LanguageContext"
import type { AiPoweredWork } from "@/lib/aiPoweredWorks"
import { WorkCard } from "./WorkCard"

interface WorkGridProps {
  works: AiPoweredWork[]
  onOpenAt: (index: number) => void
}

// Fallback ratio used only until each image's real dimensions are measured.
const FRAME_W = 4
const FRAME_H = 3

export function WorkGrid({ works, onOpenAt }: WorkGridProps) {
  const { t } = useLanguage()
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
      const cols = w >= 1024 ? 4 : 2
      setFrameWidth(Math.floor(w / cols))
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
        <p className="text-[13px] text-th-fg/30 tracking-wide">{t.aiPowered.filters.empty}</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="ai-work-masonry">
      <BalancedMasonryGrid frameWidth={frameWidth} gap={2}>
        {works.map((work, i) => {
          const d = dims[work.imageSrc]
          return (
            <Frame key={work.id} width={d?.w ?? FRAME_W} height={d?.h ?? FRAME_H}>
              <WorkCard
                work={work}
                priority={i === 0}
                onOpen={() => onOpenAt(i)}
                onMeasure={handleMeasure}
              />
            </Frame>
          )
        })}
      </BalancedMasonryGrid>
    </div>
  )
}
