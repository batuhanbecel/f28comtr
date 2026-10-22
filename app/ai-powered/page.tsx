import type { Metadata } from "next"
import { Suspense } from "react"
import { AiPoweredGallery } from "./components/AiPoweredGallery"
import { AiPoweredHero } from "./components/AiPoweredHero"
import { AiPoweredProcessStrip } from "./components/AiPoweredProcessStrip"
import { Footer } from "@/components/Footer"
import { HeroSnapBody } from "@/components/HeroSnapBody"
import { ProductionSnapContainer } from "@/components/ProductionSnapContainer"
import { getAiPoweredWorks, getPageCopy, type AiPoweredWork } from "@/lib/cms"
import { getServerLang } from "@/lib/serverLang"
import { generatePageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata("aiPowered", "/ai-powered")
}

export const revalidate = 60

async function GalleryBlock({
  worksPromise,
}: {
  worksPromise: Promise<AiPoweredWork[]>
}) {
  const [works, lang] = await Promise.all([worksPromise, getServerLang()])
  const copy = await getPageCopy('aiPowered', lang)
  return <AiPoweredGallery works={works} copy={copy} />
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
      <AiPoweredHero lang={lang} copy={copy} />
      <HeroSnapBody className="bg-th-bg text-th-fg min-h-screen">
        {/* Work first, process explanation after */}
        <Suspense fallback={<GallerySkeleton />}>
          <GalleryBlock worksPromise={worksPromise} />
        </Suspense>
        <AiPoweredProcessStrip copy={copy} />
        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  )
}
