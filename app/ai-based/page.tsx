import type { Metadata } from 'next';
import { MasonryGrid } from '@/components/MasonryGrid';
import { getAIImages } from '@/lib/db';
import { LocalizedHero } from '@/components/LocalizedHero';
import { Footer } from '@/components/Footer';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';

export const metadata: Metadata = {
  title: 'AI Based | f/2.8 Production Agency',
  description: 'Creative visual and video content powered by the latest generative AI models.',
};

export const revalidate = 60;

export default async function AIBasedPage() {
  const aiImages = await getAIImages();

  return (
    <ProductionSnapContainer snapMode="heroSnap">
      {/* Hero — snap point */}
      <section
        className="h-screen flex flex-col items-center justify-center px-6 md:px-12 text-center relative overflow-hidden"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div className="max-w-4xl mx-auto">
          <LocalizedHero page="aiBased" imageCount={aiImages.length} />
        </div>
        {/* Scroll arrow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/20 text-[9px] tracking-[0.45em] uppercase">Scroll</span>
            <svg className="w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M12 5v14M5 13l7 7 7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Grid — snap point (grid itself scrolls freely) */}
      <div style={{ scrollSnapAlign: 'start' }}>
        {aiImages.length > 0 ? (
          <MasonryGrid images={aiImages} photographerName="AI Based" />
        ) : (
          <div className="text-center py-20 px-6">
            <div className="glass-effect p-12 max-w-2xl mx-auto">
              <p className="body-text opacity-60 mb-4">No AI images available yet</p>
              <p className="label-text opacity-40">Add images to /public/ai-images to display them here</p>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </ProductionSnapContainer>
  );
}
