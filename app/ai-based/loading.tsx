import { HeroLoadingSkeleton } from '@/components/HeroLoadingSkeleton';
import { MasonryGridSkeleton } from '@/components/MasonryGridSkeleton';

export default function AIBasedLoading() {
  return (
    <main className="min-h-screen bg-th-bg">
      <HeroLoadingSkeleton maxWidth="max-w-5xl" />
      <section className="page-section max-w-7xl mx-auto px-6">
        <MasonryGridSkeleton />
      </section>
    </main>
  );
}
