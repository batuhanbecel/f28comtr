"use client"

import { useLanguage } from "@/context/LanguageContext"
import type { Work } from "../data/works"
import { WorkCard } from "./WorkCard"

interface WorkGridProps {
  works: Work[]
  onOpenAt: (index: number) => void
}

export function WorkGrid({ works, onOpenAt }: WorkGridProps) {
  const { t } = useLanguage()

  if (works.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-[13px] text-th-fg/30 tracking-wide">{t.aiBased.filters.empty}</p>
      </div>
    )
  }

  return (
    <>
      <div className="editorial-grid ai-work-grid">
        {works.map((work, i) => (
          <div
            key={work.id}
            className={`ai-work-cell${i < 6 ? " ai-work-cell--animate" : ""}`}
            style={i < 6 ? { animationDelay: `${i * 30}ms` } : undefined}
          >
            <WorkCard
              work={work}
              priority={i === 0}
              onOpen={() => onOpenAt(i)}
            />
          </div>
        ))}
      </div>
    </>
  )
}

