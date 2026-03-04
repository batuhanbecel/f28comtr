import { MasonryGrid } from '@/components/MasonryGrid';
import { getAIImages } from '@/lib/db';
import { Footer } from '@/components/Footer';

export const revalidate = 60;

export default async function AIBasedPage() {
  const aiImages = await getAIImages();

  return (
    <main className="min-h-screen pb-20">
      {/* Hero */}
      <section className="pt-48 pb-28 px-6 md:px-12 text-center">
        <span className="section-label fade-in-up" style={{ animationDelay: '0.05s' }}>Artificial Intelligence &amp; Creativity</span>
        <h1 className="heading-hero gradient-text fade-in-up" style={{ animationDelay: '0.15s' }}>
          AI BASED
        </h1>
        {aiImages.length > 0 && (
          <p className="body-text opacity-30 mt-6 fade-in-up" style={{ animationDelay: '0.25s' }}>
            {aiImages.length} works
          </p>
        )}
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
