"use client"

import { Lightbox as UnifiedLightbox } from "@/components/Lightbox"
import { useLanguage } from "@/context/LanguageContext"
import type { Work } from "../data/works"

interface LightboxProps {
  works: Work[]
  index: number | null
  onClose: () => void
  onIndexChange: (next: number) => void
}

export function Lightbox({ works, index, onClose, onIndexChange }: LightboxProps) {
  const { t } = useLanguage()

  const slides = works.map((w) => ({ src: w.imageSrc, alt: w.imageAlt }))

  const categoryLabels: Record<string, string> = {
    visual: t.aiBased.filters.visual,
    video: t.aiBased.filters.video,
    hybrid: t.aiBased.filters.hybrid,
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
            <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-1">{work.brand}</p>
            {work.title && (
              <p className="text-white/90 text-sm leading-snug">{work.title}</p>
            )}
            <p className="text-white/30 text-[9px] tracking-[0.2em] uppercase mt-1">
              {categoryLabels[work.category] ?? work.category}
            </p>
          </>
        )
      }}
    />
  )
}
