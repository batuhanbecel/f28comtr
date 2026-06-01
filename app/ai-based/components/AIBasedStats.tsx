"use client"

import { useLanguage } from "@/context/LanguageContext"
import { ScrollReveal } from "@/components/ScrollReveal"

interface AIBasedStatsProps {
  workCount: number
  brandCount: number
}

export function AIBasedStats({ workCount, brandCount }: AIBasedStatsProps) {
  const { t } = useLanguage()

  const stats = [
    { value: `${workCount}+`, label: t.aiBased.stats.projects },
    { value: `${brandCount}+`, label: t.aiBased.stats.brands },
    { value: "2008", label: t.aiBased.stats.since },
  ]

  return (
    <section className="border-y border-th-fg/[0.07] mt-6 w-full max-w-2xl mx-auto">
      <div className="flex items-stretch divide-x divide-th-fg/[0.07]">
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 0.06} className="flex-1">
            <div className="flex flex-col items-center justify-center gap-3 py-8 md:py-12 px-4">
              <span className="font-black tracking-tighter text-th-fg leading-none" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)' }}>
                {stat.value}
              </span>
              <span className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase font-mono text-th-fg/35 text-center leading-relaxed">
                {stat.label}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

export function WorksBadge(_props: { workCount: number }) {
  return null
}
