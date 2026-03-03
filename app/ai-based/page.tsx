import { MasonryGrid } from '@/components/MasonryGrid';
import { getAIImages } from '@/lib/utils';

export default function AIBasedPage() {
  const aiImages = getAIImages();

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="w-full">
        {aiImages.length > 0 ? (
          <MasonryGrid images={aiImages} photographerName="AI Based" />
        ) : (
          <div className="text-center py-20 px-6">
            <div className="glass-effect p-12 rounded-lg max-w-2xl mx-auto">
              <p className="body-text opacity-60 mb-4">No AI images available yet</p>
              <p className="label-text opacity-40">Add images to /public/ai-images to display them here</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
