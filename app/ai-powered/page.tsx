import type { Metadata } from "next"
import { Suspense } from "react"
import { AiPoweredGallery } from "./components/AiPoweredGallery"
import { AiPoweredHero } from "./components/AiPoweredHero"
import { AiPoweredProcessStrip } from "./components/AiPoweredProcessStrip"
import { AiPoweredStats } from "./components/AiPoweredStats"
import { Footer } from "@/components/Footer"
import { HeroSnapBody } from "@/components/HeroSnapBody"
import { ProductionSnapContainer } from "@/components/ProductionSnapContainer"
import { getAiPoweredWorks } from "@/lib/aiPoweredWorks"
import type { AiPoweredWork } from "@/lib/aiPoweredWorks"
import { getPageCopy } from "@/lib/pageCopy"
import { getServerLang } from "@/lib/serverLang"
import { generatePageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("aiPowered", "/ai-powered")
}

export const revalidate = 60

async function StatsBlock({
  worksPromise,
  copy,
}: {
  worksPromise: Promise<AiPoweredWork[]>
  copy: Awaited<ReturnType<typeof getPageCopy<'aiPowered'>>>
}) {
  const works = await worksPromise
  const brandCount = new Set(works.map((w) => w.brandKey)).size
  return <AiPoweredStats workCount={works.length} brandCount={brandCount} copy={copy} inHero />
}

async function GalleryBlock({
  worksPromise,
}: {
  worksPromise: Promise<AiPoweredWork[]>
}) {
  const [works, lang] = await Promise.all([worksPromise, getServerLang()])
  const copy = await getPageCopy('aiPowered', lang)
  return <AiPoweredGallery works={works} copy={copy} />
}

function StatsSkeleton() {
  return (
    <section className="border-y border-th-fg/[0.12] w-full max-w-2xl mx-auto mt-4 opacity-40">
      <div className="flex items-stretch divide-x divide-th-fg/[0.12]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 py-7 md:py-10 px-4">
            <div className="h-8 w-12 bg-th-fg/10 animate-pulse" />
            <div className="h-2 w-20 bg-th-fg/5 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  )
}

function GallerySkeleton() {
  return (
    <section className="ai-gallery-section">
      <div className="editorial-grid grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="editorial-panel bg-th-fg/[0.04] animate-pulse !border-th-fg/[0.06]"
            style={{
              aspectRatio: i % 3 === 0 ? '3/4' : i % 2 === 0 ? '1/1' : '4/3',
              animationDelay: `${i * 40}ms`,
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default async function AiPoweredPage() {
  const lang = await getServerLang();
  const copy = await getPageCopy('aiPowered', lang);
  const worksPromise = getAiPoweredWorks()

  return (
    <ProductionSnapContainer snapMode="heroSnap">
      <AiPoweredHero
        lang={lang}
        copy={copy}
        statsSlot={
          <Suspense fallback={<StatsSkeleton />}>
            <StatsBlock worksPromise={worksPromise} copy={copy} />
          </Suspense>
        }
      />
      <HeroSnapBody className="bg-th-bg text-th-fg min-h-screen">
        <AiPoweredProcessStrip copy={copy} />
        <Suspense fallback={<GallerySkeleton />}>
          <GalleryBlock worksPromise={worksPromise} />
        </Suspense>
        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  )
}
