import { HeroLoadingSkeleton } from '@/components/HeroLoadingSkeleton';
import { MasonryGridSkeleton } from '@/components/MasonryGridSkeleton';

export default function PortfoliosLoading() {
  return (
    <main className="min-h-screen bg-th-bg">
      <HeroLoadingSkeleton />
      <section className="section-padding pt-16">
        <MasonryGridSkeleton />
      </section>
    </main>
  );
}
