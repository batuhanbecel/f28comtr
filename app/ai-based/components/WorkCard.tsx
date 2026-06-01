"use client"

import { memo } from "react"
import Image from "next/image"
import { shouldSkipOptimization } from "@/lib/blob"
import { GRID_IMAGE_QUALITY } from "@/lib/imageConfig"
import { AI_WORK_CARD_SIZES } from "@/lib/imageSizes"
import { useInView } from "@/lib/useInView"
import { useLanguage } from "@/context/LanguageContext"
import type { Work } from "../data/works"

interface WorkCardProps {
  work: Work
  priority?: boolean
  onOpen?: () => void
  onMeasure?: (src: string, w: number, h: number) => void
}

export const WorkCard = memo(function WorkCard({
  work,
  priority = false,
  onOpen,
  onMeasure,
}: WorkCardProps) {
  const { t } = useLanguage()
  const { ref, inView } = useInView<HTMLButtonElement>({
    rootMargin: "400px 0px",
    initial: priority,
  })

  const categoryLabels: Record<string, string> = {
    visual: t.aiBased.filters.visual,
    video: t.aiBased.filters.video,
    hybrid: t.aiBased.filters.hybrid,
  }

  const typeLabel = categoryLabels[work.category] ?? work.category
  const ariaLabel = [work.brand, work.title, typeLabel].filter(Boolean).join(" — ")

  return (
    <button
      ref={ref}
      type="button"
      className="ai-work-card card-editorial"
      onClick={onOpen}
      aria-label={ariaLabel || work.imageAlt}
    >
      <div className="ai-work-image-wrap">
        {inView ? (
          <Image
            src={work.imageSrc}
            alt={work.imageAlt}
            fill
            sizes={AI_WORK_CARD_SIZES}
            className="ai-work-image"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            quality={GRID_IMAGE_QUALITY}
            unoptimized={shouldSkipOptimization(work.imageSrc)}
            onLoad={(e) => {
              const img = e.currentTarget
              if (img.naturalWidth && img.naturalHeight) {
                onMeasure?.(work.imageSrc, img.naturalWidth, img.naturalHeight)
              }
            }}
          />
        ) : null}
        <div className="ai-work-overlay">
          <div className="ai-work-overlay-inner">
            <span className="ai-work-overlay-brand">{work.brand}</span>
            {work.title ? (
              <p className="ai-work-overlay-title">{work.title}</p>
            ) : (
              <p className="ai-work-overlay-title ai-work-overlay-title--empty" aria-hidden="true">
                &nbsp;
              </p>
            )}
            <span className="ai-work-overlay-category">{typeLabel}</span>
          </div>
        </div>
      </div>
    </button>
  )
})
