import { MasonryGridSkeleton } from '@/components/MasonryGridSkeleton';

export default function PortfolioLoading() {
  return (
    <main className="min-h-screen bg-th-bg">
      <section className="hero-screen h-[70vh] md:h-[80vh] flex items-end justify-center px-6 md:px-12 pb-16 md:pb-24">
        <div className="page-heading-stack page-heading-stack--center gap-5 w-full max-w-4xl">
          <div className="hero-rule mx-auto animate-pulse opacity-30" />
          <div className="h-6 w-28 editorial-panel animate-pulse mx-auto" />
          <div className="h-16 md:h-24 w-64 md:w-80 editorial-panel animate-pulse mx-auto" />
          <div className="h-10 w-40 editorial-panel animate-pulse mx-auto mt-2" />
        </div>
      </section>

      <section className="page-section !pt-10">
        <MasonryGridSkeleton />
      </section>
    </main>
  );
}
