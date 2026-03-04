import { MasonryGrid } from '@/components/MasonryGrid';
import { getAIImages } from '@/lib/db';
import { Footer } from '@/components/Footer';

export const revalidate = 60;

export default async function AIBasedPage() {
  const aiImages = await getAIImages();

  return (
    <main className="min-h-screen pb-20">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <span className="section-label fade-in-up" style={{ animationDelay: '0.05s' }}>Artificial Intelligence &amp; Creativity</span>
          <h1 className="heading-hero gradient-text fade-in-up" style={{ animationDelay: '0.15s' }}>
            AI BASED
          </h1>
          <p className="body-text max-w-2xl mx-auto opacity-50 mt-8 fade-in-up" style={{ animationDelay: '0.25s' }}>
            A curated collection of AI-assisted and AI-generated visuals, exploring the intersection of machine learning and photographic artistry. Each image represents a collaboration between human vision and artificial intelligence.
          </p>
          {aiImages.length > 0 && (
            <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mt-6 fade-in-up" style={{ animationDelay: '0.35s' }}>
              {aiImages.length} works
            </p>
          )}
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

      <div className="w-full">
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
      </div>
      <Footer />
    </main>
  );
}
