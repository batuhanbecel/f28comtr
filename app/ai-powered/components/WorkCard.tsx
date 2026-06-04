"use client"

import { memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { shouldSkipOptimization } from "@/lib/blob"
import { GRID_IMAGE_QUALITY } from "@/lib/imageConfig"
import { AI_WORK_CARD_SIZES } from "@/lib/imageSizes"
import { useInView } from "@/lib/useInView"
import type { AiPoweredPageCopy } from '@/lib/pageCopy.types'
import type { AiPoweredWork } from "@/lib/aiPoweredWorks"

interface WorkCardProps {
  work: AiPoweredWork
  filtersCopy: AiPoweredPageCopy['filters']
  priority?: boolean
  onMeasure?: (src: string, w: number, h: number) => void
}

export const WorkCard = memo(function WorkCard({
  work,
  filtersCopy,
  priority = false,
  onMeasure,
}: WorkCardProps) {
  const { ref, inView } = useInView<HTMLAnchorElement>({
    rootMargin: "400px 0px",
    initial: priority,
  })

  const categoryLabels: Record<string, string> = {
    visual: filtersCopy.visual,
    video: filtersCopy.video,
    hybrid: filtersCopy.hybrid,
  }

  const typeLabel = categoryLabels[work.category] ?? work.category
  const ariaLabel = [work.brand, work.title, typeLabel].filter(Boolean).join(" — ")

  return (
    <Link
      ref={ref}
      href={`/ai-powered/works/${work.slug}`}
      className="ai-work-card card-editorial"
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
    </Link>
  )
})
