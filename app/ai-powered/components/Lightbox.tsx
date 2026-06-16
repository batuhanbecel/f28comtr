"use client"

import { Lightbox as UnifiedLightbox } from "@/components/Lightbox"
import type { AiPoweredPageCopy } from '@/lib/pageCopy.types'
import type { AiPoweredWork } from "@/lib/aiPoweredWorks"

interface LightboxProps {
  works: AiPoweredWork[]
  filtersCopy: AiPoweredPageCopy['filters']
  index: number | null
  onClose: () => void
  onIndexChange: (next: number) => void
}

export function Lightbox({ works, filtersCopy, index, onClose, onIndexChange }: LightboxProps) {
  const slides = works.map((w) => ({ src: w.imageSrc, alt: w.imageAlt }))

  const categoryLabels: Record<string, string> = {
    fullAi: filtersCopy.fullAi,
    hybrid: filtersCopy.hybrid,
  }

  return (
    <UnifiedLightbox
      slides={slides}
      index={index}
      onClose={onClose}
      onIndexChange={onIndexChange}
      renderMeta={(idx) => {
        const work = works[idx]
        if (!work) return null
        return (
          <>
            <p className="caption-text text-white/62 tracking-[0.24em] mb-1">{work.brand}</p>
            {work.title && (
              <p className="text-white/90 text-sm leading-snug">{work.title}</p>
            )}
            <p className="caption-text text-white/52 tracking-[0.16em] mt-1">
              {categoryLabels[work.category] ?? work.category}
            </p>
          </>
        )
      }}
    />
  )
}
