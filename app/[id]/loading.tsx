import { HeroLoadingSkeleton } from '@/components/HeroLoadingSkeleton';
import { MasonryGridSkeleton } from '@/components/MasonryGridSkeleton';

export default function PortfolioLoading() {
  return (
    <main className="min-h-screen bg-th-bg">
      <HeroLoadingSkeleton />
      <section className="page-section !pt-10">
        <MasonryGridSkeleton />
      </section>
    </main>
  );
}
